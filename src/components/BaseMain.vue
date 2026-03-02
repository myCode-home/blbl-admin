<template>
  <el-main class="base-main">
    <el-scrollbar height="100%">
      <layout-header />
      <router-view #default="{ Component }">
        <component :is="Component" />
      </router-view>
    </el-scrollbar>
  </el-main>
</template>

<script setup lang="ts">
import LayoutHeader from './LayoutHeader.vue'
</script>

<style scoped lang="scss">
.base-main {
  background-color: #efefef;
  overflow-x: hidden;
}
</style>
