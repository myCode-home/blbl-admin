<template>
  <super-table
    :headerBtn="true"
    :tableLoading="tableLoading"
    :tableData="orderList"
    :params="params"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :columns="orderColumns"
  >
    <template #headerBtn>
      <div class="search">
        <el-input
          v-model="params.out_trade_no"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" icon="Search" circle plain @click="handleSearch" />
      </div>
    </template>
    <template #trade_state="{ row }">
      <el-tag type="primary" v-if="row.trade_state === '待支付'">待支付</el-tag>
      <el-tag type="success" v-else-if="row.trade_state === '待服务'">待服务</el-tag>
      <el-tag type="info" v-else>已取消</el-tag>
    </template>
    <template #operation="{ row }">
      <el-popconfirm
        @confirm="handleComplete(row)"
        hide-icon
        class="box-item"
        title="服务完成？"
        placement="left-start"
      >
        <template #reference>
          <el-button
            :disabled="row.trade_state !== '待服务'"
            type="primary"
            icon="Pointer"
            circle
            plain
          />
        </template>
      </el-popconfirm>
    </template>
  </super-table>
</template>

<script lang="ts" setup>
import { getOrderListService, updateOrderService } from '@/apis'
import { onMounted, ref } from 'vue'
import { orderColumns } from '@/utils/data'
import { ElMessage } from 'element-plus'
const orderList = ref<any>([])

const params = ref<any>({
  pageNum: 1,
  pageSize: 10,
  out_trade_no: '',
})
const tableLoading = ref(false)
const total = ref(0)
const getOrderList = async () => {
  tableLoading.value = true
  try {
    const res = await getOrderListService(params.value)
    if (res.code === 10000) {
      orderList.value = res.data.list
      orderList.value.forEach((item: any) => {
        item.companion_name = item.companion.name
        item.companion_mobile = item.companion.mobile
      })
      total.value = res.data.total
    }
  } catch (error) {
  } finally {
    tableLoading.value = false
  }
}
// 查询订单
const handleSearch = () => {
  params.value.out_trade_no = params.value.out_trade_no.trim()
  params.value.pageNum = 1
  getOrderList()
}
// 确认服务完成
const handleComplete = async (row: any) => {
  try {
    await updateOrderService({
      id: row.transaction_id,
    })
    getOrderList()
    ElMessage.success('服务完成成功')
  } catch (error) {
    ElMessage.error(error as string)
  }
}
const handleSizeChange = (val: number) => {
  params.value.pageSize = val
  getOrderList()
}
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  getOrderList()
}
onMounted(() => {
  getOrderList()
})
</script>

<style lang="scss">
.search {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
