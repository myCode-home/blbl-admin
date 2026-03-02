<template>我是dashboard页面</template>
<script lang="ts" setup>
import { getReportService } from '@/apis'
import { onMounted, ref } from 'vue'

const getReport = async () => {
  const res = await getReportService()
  if (res.code === 10000) {
    console.log(res)
  }
}
onMounted(() => {
  getReport()
})
</script>
