<template>
  <el-menu
    :collapse="statusStore.isFold"
    :style="{ width: statusStore.isFold ? '70px' : '230px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="route.path"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <p class="log-header">{{ statusStore.isFold ? 'DIDI' : 'DIDI管理' }}</p>
    <BaseMenu :routes="router.options.routes[0]?.children"> </BaseMenu>
  </el-menu>
</template>

<script setup lang="ts">
import { useStatusStore } from '@/store/status'
const statusStore = useStatusStore()
import BaseMenu from '@/components/BaseMenu.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
// console.log(route.path)

const handleClose = () => {}
const handleOpen = () => {}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  width: 230px;
  transition: width 0.1s ease-in-out;
  transform: translateX(0);
}
.log-header {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  padding: 20px 0;
  text-align: center;
  color: aliceblue;
}
</style>
