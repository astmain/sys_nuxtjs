<template>
    <div>
        <h1>about</h1>

        <el-button type="warning" @click="about()"> about</el-button>
        <div>count: {{ BUS.count }}</div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const BUS = useBUS();

async function about() {

    console.log('route.path', route.path);
    console.log('route.fullPath', route.fullPath);
    console.log('route.params', route.params);



}

definePageMeta({
    path: "/about",
    alias: "/about",
});
</script>
