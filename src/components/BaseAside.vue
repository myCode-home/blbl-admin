<template>
  <el-menu style="width: 230px;" active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
    default-active="2" text-color="#fff" @open="handleOpen" @close="handleClose">
    <p class="log-header">DIDI管理</p>
    <BaseMenu :routes="router.options.routes[0]?.children"> </BaseMenu>
  </el-menu>
</template>

<script setup lang="ts">
import BaseMenu from '@/components/BaseMenu.vue'
import { useRouter } from 'vue-router';
// import type { routesData } from '@/type/route';

const router = useRouter();
// console.log(router.options.routes[0]?.children, '!!!!!!!!!!!');

const handleClose = () => { }
const handleOpen = () => { }
</script>

<style lang="scss" scoped>
.log-header {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  padding: 20px 0;
  text-align: center;
  color: aliceblue;
}
</style>