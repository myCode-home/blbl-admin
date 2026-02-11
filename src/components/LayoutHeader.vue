<template>
  <el-card>
    <div class="box">
      <p>{{ name }}</p>
      <p>{{ desc }}</p>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const name = computed(() => route.meta.name)
const desc = computed(() => route.meta.describe)
</script>

<style scoped lang="scss">
.box {
  box-sizing: border-box;
}
</style>
