<template>
    <div>
        <h1>home</h1>

        <el-button type="warning" @click="home()"> home</el-button>
        <div>count: {{ BUS.count }}</div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const BUS = useBUS();
async function home() {
    console.log('route.path', route.path);
    console.log('route.fullPath', route.fullPath);
    console.log('route.params', route.params);
    const res = await useFetch("/api/hello");
    console.log("接口请求数据---res", res.data.value);
}

definePageMeta({
    path: "/home",
    alias: "/home",
});
</script>
