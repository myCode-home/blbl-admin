<template>
  <div width="100%">
    <super-table
      :headerBtn="true"
      :tableLoading="tableLoading"
      :tableData="tableData"
      :params="params"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #operation="{ row }">
        <el-button type="primary" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
      </template>
      <template #headerBtn>
        <div class="card-header">
          <el-button icon="Plus" type="primary" @click="handelAddMenu">添加权限</el-button>
        </div>
      </template>
    </super-table>
  </div>

  <!-- 添加/编辑的dialog -->
  <el-dialog v-model="dialogVisible" :title="status.title" width="500" :before-close="handleClose">
    <el-form
      ref="formRef"
      v-loading="dialogLoading"
      :model="menuForm"
      :rules="rules"
      label-width="100px"
      width="500"
    >
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="menuForm.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item v-show="false" prop="id">
        <el-input v-model="menuForm.id" />
      </el-form-item>
      <el-form-item label="权限列表" prop="permissions">
        <el-tree
          style="max-width: 600px"
          :data="menuList"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2]"
          :default-checked-keys="[4, 5]"
          :props="defaultProps"
          ref="treeRef"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getMenuService, setMenuService, getMenuListService } from '@/apis'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
const dialogLoading = ref(false)

// dialog相关的
const status = reactive({
  title: '添加权限',
  isAdd: true,
})
// form 的数据
const menuForm = reactive({
  name: '',
  permissions: '',
  id: '',
})
const rules = reactive({
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
})
// 树的属性
const treeRef = ref()
const defaultProps = {
  children: 'children',
  label: 'label',
}

// 表格数据
const tableData = ref()
// 查询参数
const total = ref(0)
const params = reactive({
  pageSize: 10,
  pageNum: 1,
})
// 表格加载状态
const tableLoading = ref(false)

const handleEdit = async (row: any) => {
  dialogVisible.value = true
  status.isAdd = false
  status.title = '编辑权限'
  Object.assign(menuForm, {
    name: row.name,
    id: row.id,
    permission: row.permission,
  })

  // 确保获取菜单数据
  await getMenuList()
  if (treeRef.value) {
    try {
      // 确保permission是数组
      const permissions = Array.isArray(row.permission) ? row.permission : []
      treeRef.value.setCheckedKeys(permissions)
    } catch (error) {
      console.error('设置选中权限失败:', error)
    }
  } else {
    return
  }
}

// 弹窗是否显示
const dialogVisible = ref(false)

const formRef = ref()
// 提交添加权限的回调
const handleSubmit = async () => {
  if (!formRef.value || !treeRef.value) return

  try {
    await formRef.value.validate()
    const checkedKeys = treeRef.value.getCheckedKeys()
    menuForm.permissions = JSON.stringify(checkedKeys)
    const res = await setMenuService(menuForm)
    if (res.code === 10000) {
      ElMessage.success(!status.isAdd ? '编辑成功' : '添加成功')
      dialogVisible.value = false
      getMenuListData()
    }
  } catch (error: any) {
    console.error('表单验证失败', error)
    ElMessage.error(error.message)
  } finally {
    dialogLoading.value = false
    getMenuListService(params)
  }
}
// 关闭菜单的回调
const handleClose = () => {
  dialogVisible.value = false

  // 重置表单
  if (formRef.value) {
    try {
      formRef.value.resetFields()
    } catch (error) {
      console.error('重置表单失败:', error)
    }
  }

  // 清空树的选中状态
  if (treeRef.value) {
    try {
      treeRef.value.setCheckedKeys([])
    } catch (error) {
      console.error('清空树选中状态失败:', error)
    }
  }
}
// 添加权限的回调
const handelAddMenu = async () => {
  await getMenuList()
  dialogVisible.value = true

  // 重置表单状态
  if (formRef.value) {
    try {
      formRef.value.resetFields()
    } catch (error) {
      console.error('重置表单失败:', error)
    }
  }

  // 清空树的选中状态
  if (treeRef.value) {
    try {
      treeRef.value.setCheckedKeys([])
    } catch (error) {
      console.error('清空树选中状态失败:', error)
    }
  }
}
// 菜单权限数据
const menuList = ref()
const getMenuList = () => {
  dialogLoading.value = true
  getMenuService()
    .then((res) => {
      if (res.code === 10000) {
        menuList.value = res.data
      }
    })
    .catch((error) => {
      ElMessage.error(error.message)
      dialogLoading.value = false
    })
    .finally(() => {
      dialogLoading.value = false
    })
}
const getMenuListData = async () => {
  tableLoading.value = true
  try {
    const res = await getMenuListService(params)
    if (res.code === 10000) {
      tableData.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    tableLoading.value = false
  }
}
const handleSizeChange = (val: number) => {
  params.pageSize = val
  getMenuListData()
}
const handleCurrentChange = (val: number) => {
  params.pageNum = val
  getMenuListData()
}
onMounted(() => {
  getMenuListData()
})
</script>
