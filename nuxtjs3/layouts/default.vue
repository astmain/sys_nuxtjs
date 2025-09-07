<template>
    <div style="display: flex; flex-direction: row; gap: 10px;">





        <div style="display: flex; gap: 10px;flex-direction: column; border-right: 1px solid #000;padding-right: 10px;">
            <NuxtLink to="/login">login</NuxtLink>
            <NuxtLink to="/home">home</NuxtLink>
            <NuxtLink to="/about">about</NuxtLink>
        </div>

        <div style="flex: 1;">
            <div
                style=" display: flex; justify-content: space-between; align-items: center;border-bottom: 1px solid #000;">
                <h3>
                    admin
                </h3>
                <div>
                    <el-button type="primary" @click="login_out">login_out</el-button>
                </div>


            </div>
            <slot />
        </div>


    </div>
</template>

<script setup lang="ts">
const router = useRouter();


function login_out() {
    router.push("/login");
}

</script>

<style scoped></style>