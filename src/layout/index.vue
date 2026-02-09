<template>
  <div class="common-layout">
    <el-container class="common-layout-container">
      <BaseAside />
      <el-container
        class="common-layout-main"
        :style="{
          width: statusStore.isFold ? 'calc(100vw - 70px)' : 'calc(100vw - 230px)',
        }"
      >
        <BaseHeader />
        <BaseMain />
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import BaseAside from '@/components/BaseAside.vue'
import BaseHeader from '@/components/BaseHeader.vue'
import BaseMain from '@/components/BaseMain.vue'
import { useStatusStore } from '@/store/status'

// 状态管理
const statusStore = useStatusStore()
</script>
<style lang="scss" scoped>
.common-layout {
  height: 100%;
  background-color: rgb(146, 54, 69);
  .common-layout-container {
    height: 100%;
    .common-layout-main {
      flex-direction: column;
      background-color: #fff;
      transition: width 0.2s ease-in-out;
    }
  }
}
</style>
