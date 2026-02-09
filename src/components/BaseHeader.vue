<template>
  <el-header class="header-container">
    <div class="left">
      <el-icon class="fold-icon" @click="handleFoldClick">
        <component :is="statusStore.isFold ? 'Expand' : 'Fold'" />
      </el-icon>
      <div class="tag-container">
        <el-tag
          size="large"
          v-for="tag in statusStore.tags"
          :key="tag.name"
          :closable="tag.name !== '控制台'"
          :type="!tag.isActive ? 'info' : tag.type"
          @click="handleClick(tag)"
          @close="handleClose(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
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
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import type { TagsItem } from '@/type/public'

const router = useRouter()
const statusStore = useStatusStore()
const handleFoldClick = () => {
  statusStore.toggleFold()
}

const handleClick = (tag: TagsItem) => {
  router.push(tag.path)
  statusStore.addTag(tag)
}

const handleClose = (tag: TagsItem) => {
  // 如果删除的是非选中的项目
  if (tag.path !== router.currentRoute.value.path) {
    statusStore.removeTag(tag)
    return
  }
  const index = statusStore.tags.findIndex((item) => item.path === tag.path)
  // 如果删除的是选中的项目，并且是最后一个元素
  if (index === statusStore.tags.length - 1) {
    statusStore.removeTag(tag)
    router.push(statusStore.tags[index - 1]?.path as string)
  } else {
    // 如果删除的是选中的项目，并且不是最后一个元素
    statusStore.removeTag(tag)
    router.push(statusStore.tags[index]?.path as string)
  }
}

watch(
  () => router.currentRoute.value,
  (newVal) => {
    statusStore.addTag({
      name: newVal.meta.name as string,
      path: newVal.path,
      icon: newVal.meta.icon as string,
    })
  },
  {
    immediate: true,
  },
)
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
  .left {
    display: flex;
    gap: 10px;
    .tag-container {
      text-align: center;
      line-height: 50px;
      .el-tag {
        margin: 0 5px;
        cursor: pointer;
        &:hover {
          background-color: #efefef;
        }
      }
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
