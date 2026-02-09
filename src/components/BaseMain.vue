<template>
  <el-main style="background-color: pink">
    <router-view #default="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-main>
</template>
