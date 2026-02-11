<template>
  <el-main style="background-color: #efefef">
    <layout-header />
    <router-view #default="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-main>
</template>
<script setup lang="ts">
import LayoutHeader from './LayoutHeader.vue'
</script>
