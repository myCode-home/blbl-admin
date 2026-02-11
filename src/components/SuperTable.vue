<template>
  <el-card style="width: 100%">
    <template #header>
      <div v-if="$props.headerBtn" class="card-header">
        <slot name="headerBtn"></slot>
      </div>
    </template>
    <el-table border v-loading="props.tableLoading" :data="props.tableData" style="width: 100%">
      <el-table-column
        v-for="item in [
          { id: 'id', name: 'id' },
          { id: 'name', name: '名字' },
          { id: 'permissionName', name: '权限名称' },
        ]"
        :key="item.id"
        :prop="item.id"
        :label="item.name"
      />
      <el-table-column label="操作">
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
const emits = defineEmits(['size-change', 'current-change'])
const props = defineProps({
  headerBtn: {
    type: Boolean,
    default: false,
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
})
</script>
