<template>
  <el-main style="background-color: #efefef">
    <router-view #default="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-main>
</template>
