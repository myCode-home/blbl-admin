<template>
  <el-card style="width: 100%">
    <template v-if="$props.headerBtn" #header>
      <div class="card-header">
        <slot name="headerBtn"></slot>
      </div>
    </template>
    <el-table
      ref="tableRef"
      @selection-change="handleSelectionChange"
      border
      v-loading="props.tableLoading"
      :data="props.tableData"
      style="width: 100%"
    >
      <el-table-column v-if="props.selection" type="selection" :selectable="selection" width="55" />
      <el-table-column
        v-for="item in props.columns"
        :key="item.id"
        :prop="item.id"
        :label="item.name"
      >
        <template v-if="item.id === 'create_time'" #default="scope">
          <slot name="create_time" :row="scope.row"></slot>
        </template>
        <template v-if="item.id === 'permissions_id'" #default="scope">
          <slot name="permissions_id" :row="scope.row"></slot>
        </template>
        <template v-if="item.id === 'active'" #default="scope">
          <slot name="active" :row="scope.row"></slot>
        </template>
        <template v-if="item.id === 'avatar'" #default="scope">
          <slot name="avatar" :row="scope.row"></slot>
        </template>
        <template v-if="item.id === 'sex'" #default="scope">
          <slot name="sex" :row="scope.row"></slot>
        </template>
        <template v-if="item.id === 'trade_state'" #default="scope">
          <slot name="trade_state" :row="scope.row"></slot>
        </template>
      </el-table-column>
      <el-table-column v-if="props.showOperation" label="操作">
        <template #default="scope">
          <slot name="operation" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="props.total > 0" #footer>
      <el-pagination
        v-model:current-page="props.params.pageNum"
        v-model:page-size="props.params.pageSize"
        :page-sizes="[1, 5, 10, 15]"
        layout="sizes, prev, pager, next"
        :total="props.total"
        @size-change="emits('size-change', props.params.pageSize)"
        @current-change="emits('current-change', props.params.pageNum)"
      />
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { toRaw, ref } from 'vue'
import type { ColumnsData } from '@/type/data'
const emits = defineEmits(['size-change', 'current-change', 'selection-change'])
const props = defineProps({
  headerBtn: {
    type: Boolean,
    default: false,
  },
  showOperation: {
    type: Boolean,
    default: true,
  },
  tableLoading: {
    type: Boolean,
    default: false,
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  params: {
    type: Object,
    default: () => ({
      pageSize: 10,
      pageNum: 1,
    }),
  },
  total: {
    type: Number,
    default: 0,
  },
  columns: {
    type: Array<ColumnsData>,
    default: () => [],
  },
  selection: {
    type: Boolean,
    default: false,
  },
})
const selection = (row: any) => {
  return true
}

const handleSelectionChange = (row: any) => {
  emits('selection-change', toRaw(row))
}
const tableRef = ref()
const clearSelection = () => {
  tableRef.value.clearSelection()
}

defineExpose({
  clearSelection,
})
</script>
