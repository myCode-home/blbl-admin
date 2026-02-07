<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <BaseAside />
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import BaseAside from '@/components/BaseAside.vue'
</script>
<style lang="scss" scoped>
.common-layout {
  background-color: #efefef;
}
</style>