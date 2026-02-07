<template>
  <el-header class="header-container">
    <div class="left">
      <el-icon class="fold-icon" @click="handleFoldClick">
        <component :is="statusStore.isFold ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <div class="right">
      <div class="avata">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </div>
      <div class="user">
        <el-dropdown>
          <span class="el-dropdown-link">
            admin<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="Plus">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { useStatusStore } from '@/store/status'

const statusStore = useStatusStore()
const handleFoldClick = () => {
  statusStore.toggleFold()
}
</script>

<style lang="scss" scoped>
.header-container {
  background-color: #fff;
  padding: 0 30px 0 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .fold-icon {
    font-size: 20px;
    height: 50px;
    width: 50px;
    transition: all 0.1s ease-in-out;
    border-radius: 0 4px 4px 0;
    &:hover {
      background-color: #bfbfbf;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .avata {
      margin-right: 10px;
    }
  }
}
</style>
