<template>
    <div>
        <h1>[content]</h1>



        <el-button type="warning" @click="fun1('hello')"> lazy button</el-button>
    </div>
</template>

<script>

import { ElMessage } from 'element-plus';

export default {
    name: 'Content',
    methods: {

        fun1(message) {
            ElMessage.success(message);
            console.log('route.path', this.$route.path);
            console.log('route.fullPath', this.$route.fullPath);
            console.log('route.params', this.$route.params);
            console.log('route.query', this.$route.query);
        }
    },
    mounted() {
        console.log('[content].vue');
    }
}
</script>
