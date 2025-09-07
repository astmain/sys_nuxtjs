<template>
    <div>
        <h1>login</h1>

        <el-button type="warning" @click="fun1('hello')"> fun1</el-button>
        <div>count: {{ BUS.count }}</div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const BUS = useBUS();

async function fun1(message: string) {
    ElMessage.success(message);
    console.log('route.path', route.path);
    console.log('route.fullPath', route.fullPath);
    console.log('route.params', route.params);
    console.log('route.query', route.query);

    BUS.count++;


    // const res = await $fetch("/api/hello");
    // console.log("接口请求数据---res", res)


    // const res = await useAsyncData("item", () => $fetch("/api/hello"));
    // console.log("接口请求数据---res", res.data.value);


    const res = await useFetch("/api/hello");
    console.log("接口请求数据---res", res.data.value);
    router.push("/home");



}


definePageMeta({
    layout: false,
    path: "/login",
    alias: "/",

});
</script>
