<template>
  <SuperTable
    :headerBtn="true"
    :tableLoading="tableLoading"
    :tableData="tableData"
    :params="params"
    :total="total"
    :columns="adminColumns"
  >
    <template #create_time="{ row }">
      {{ row.create_time ? new Date(row.create_time).toLocaleString() : '-' }}
    </template>
    <template #active="{ row }">
      <el-tag :type="row.active ? 'success' : 'danger'">{{ row.active ? '正常' : '禁用' }}</el-tag>
    </template>
    <template #permissions_id="{ row }">
      {{ permissions(row.permissions_id) }}
    </template>
    <template #operation="{ row }">
      <el-button type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
    </template>
  </SuperTable>
  <el-dialog title="编辑" v-model="dialogVisible" width="50%">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="电话号" prop="mobile">
        <el-input disabled v-model="form.mobile" placeholder="请输入电话号" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
          v-model="form.permissions_id"
          :options="menuList"
          :props="{
            label: 'name',
            value: 'id',
          }"
          placeholder="请选择菜单权限"
          style="width: 240px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { getUserListService, setUserService, getMenuSelectListService } from '@/apis'
import { onMounted, reactive, ref } from 'vue'
import SuperTable from '@/components/SuperTable.vue'
import { adminColumns } from '@/utils/data'

const params = reactive({
  pageSize: 10,
  pageNum: 1,
})
const formRef = ref()
const form = reactive({
  mobile: '',
  name: '',
  permissions_id: '',
})
const rules = reactive({
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  permissions_id: [{ required: true, message: '请选择菜单权限', trigger: 'change' }],
})
const tableLoading = ref(false)
const total = ref(0)
const tableData = ref([])
const dialogVisible = ref(false)

const handleEdit = (row: any) => {
  form.mobile = row.mobile
  form.name = row.name
  form.permissions_id = row.permissions_id
  dialogVisible.value = true
}
const handleClose = () => {
  dialogVisible.value = false
  Object.assign(form, {
    mobile: '',
    name: '',
    permissions_id: '',
  })
}
const handleSubmit = async () => {
  await formRef.value.validate()
  console.log(form)
  try {
    console.log({
      name: form.name,
      permissions_id: form.permissions_id,
    })
    const res = await setUserService({
      name: form.name,
      permissions_id: form.permissions_id,
    })
    if (res.code === 10000) {
      ElMessage.success('编辑成功')
      dialogVisible.value = false
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    dialogVisible.value = false
  }
}

const getList = async () => {
  try {
    tableLoading.value = true
    const res = await getUserListService(params)
    if (res.code !== 10000) return ElMessage.error(res.msg)

    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    tableLoading.value = false
  }
}
// 权限列表
const menuList = ref()
const getMenuSelectList = async () => {
  try {
    const res = await getMenuSelectListService()
    if (res.code !== 10000) return ElMessage.error(res.msg)
    menuList.value = res.data
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}
const permissions = (id: number | string) => {
  if (!menuList.value || menuList.value.length === 0) {
    return '-'
  }
  const itemIndex = menuList.value.findIndex((item: any) => {
    return item.id === id
  })
  return itemIndex !== -1 ? menuList.value[itemIndex].name : '-'
}
onMounted(async () => {
  await getList()
  await getMenuSelectList()
})
</script>
