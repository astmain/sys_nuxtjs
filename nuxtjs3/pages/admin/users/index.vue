<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">用户管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理系统用户账户</p>
      </div>
      <el-button type="primary" @click="showCreateDialog = true">
        添加用户
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <el-input
            v-model="searchForm.search"
            placeholder="搜索用户名、邮箱或姓名"
            clearable
            @input="handleSearch"
          />
          <el-select
            v-model="searchForm.status"
            placeholder="状态筛选"
            clearable
            @change="handleSearch"
          >
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
          <el-button @click="handleSearch" type="primary">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="bg-white shadow rounded-lg">
      <el-table :data="users" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="px-6 py-4 border-t">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 创建/编辑用户对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingUser ? '编辑用户' : '添加用户'"
      width="600px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editingUser">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="departmentIds">
          <el-select
            v-model="userForm.departmentIds"
            multiple
            placeholder="选择部门"
            style="width: 100%"
          >
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="userForm.roleIds"
            multiple
            placeholder="选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ editingUser ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'permission']
})

const userFormRef = ref()
const loading = ref(false)
const submitting = ref(false)
const showCreateDialog = ref(false)
const editingUser = ref(null)

const searchForm = reactive({
  search: '',
  status: null
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const users = ref([])
const departments = ref([])
const roles = ref([])

const userForm = reactive({
  username: '',
  email: '',
  password: '',
  realName: '',
  phone: '',
  status: 1,
  departmentIds: [],
  roleIds: []
})

const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm
    }
    
    const { data } = await $fetch('/api/users', { query: params })
    users.value = data.list
    pagination.total = data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取部门和角色列表
const fetchDepartmentsAndRoles = async () => {
  try {
    const [deptRes, roleRes] = await Promise.all([
      $fetch('/api/departments'),
      $fetch('/api/roles')
    ])
    departments.value = deptRes.data.list
    roles.value = roleRes.data.list
  } catch (error) {
    console.error('获取部门和角色列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchUsers()
}

// 重置
const handleReset = () => {
  searchForm.search = ''
  searchForm.status = null
  pagination.page = 1
  fetchUsers()
}

// 分页
const handleSizeChange = (val) => {
  pagination.limit = val
  pagination.page = 1
  fetchUsers()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchUsers()
}

// 编辑用户
const handleEdit = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    username: user.username,
    email: user.email,
    realName: user.realName || '',
    phone: user.phone || '',
    status: user.status,
    departmentIds: user.userDepartments?.map((ud) => ud.department.id) || [],
    roleIds: user.userRoles?.map((ur) => ur.role.id) || []
  })
  showCreateDialog.value = true
}

// 删除用户
const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm('确定要删除此用户吗？', '确认删除', {
      type: 'warning'
    })
    
    await $fetch(`/api/users/${user.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    const valid = await userFormRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    const method = editingUser.value ? 'PUT' : 'POST'
    const url = editingUser.value ? `/api/users/${editingUser.value.id}` : '/api/users'
    
    await $fetch(url, {
      method,
      body: userForm
    })
    
    ElMessage.success(editingUser.value ? '更新成功' : '创建成功')
    showCreateDialog.value = false
    resetForm()
    fetchUsers()
  } catch (error) {
    ElMessage.error(editingUser.value ? '更新失败' : '创建失败')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  editingUser.value = null
  Object.assign(userForm, {
    username: '',
    email: '',
    password: '',
    realName: '',
    phone: '',
    status: 1,
    departmentIds: [],
    roleIds: []
  })
  userFormRef.value?.resetFields()
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchUsers()
  fetchDepartmentsAndRoles()
})
</script>
