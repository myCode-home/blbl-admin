<template>
  <template v-for="item in props.routes" :key="item.path">
    <el-menu-item
      v-if="!item.children || item.children.length === 0"
      :index="`${item.meta?.path}`"
      @click="handelClick(item)"
    >
      <el-icon>
        <component :is="item.meta?.icon" />
      </el-icon>
      <span>{{ item.meta?.name }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="`${item.path}`">
      <template #title>
        <el-icon>
          <component :is="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta?.name }}</span>
      </template>
      <BaseMenu :routes="item.children" />
    </el-sub-menu>
  </template>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
defineOptions({
  name: 'BaseMenu',
})
const props = defineProps({
  routes: {
    type: Array as any,
  },
})
const handelClick = (item: any) => {
  // console.log(item)
  router.push(item.meta.path)
  // router.push({ name: item.name })
}
</script>
<style lang="scss" scoped></style>
