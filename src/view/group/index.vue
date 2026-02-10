<template>
  <el-dialog v-model="dialogVisible" title="添加权限" width="500" :before-close="handleClose">
    <el-form
      ref="formRef"
      v-loading="Loading"
      :model="menuForm"
      :rules="rules"
      label-width="100px"
      width="500"
    >
      <el-form-item label="添加权限" prop="name">
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
        <el-button @click="dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-button type="primary" @click="handelAddMenu">添加权限</el-button>
</template>

<script setup lang="ts">
import { getMenuService, setMenuService, getMenuListService } from '@/apis'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
const Loading = ref(false)

// form 的数据
const menuForm = reactive({
  name: '',
  permissions: '',
  id: '',
})
const rules = reactive({
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
})
// 查询参数
const params = reactive({
  pageSize: 10,
  pageNum: 1,
})
// 树的属性
const treeRef = ref()
const defaultProps = {
  children: 'children',
  label: 'label',
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
      ElMessage.success('添加成功')
      dialogVisible.value = false
    }
  } catch (error: any) {
    console.error('表单验证失败', error)
    ElMessage.error(error.message)
  }
}
// 关闭菜单的回调
const handleClose = () => {
  dialogVisible.value = false
}
// 添加权限的回调
const handelAddMenu = () => {
  dialogVisible.value = true
  getMenuList()
}
// 菜单权限数据
const menuList = ref()
const getMenuList = () => {
  Loading.value = true
  getMenuService()
    .then((res) => {
      if (res.code === 10000) {
        menuList.value = res.data
      }
    })
    .catch((error) => {
      ElMessage.error(error.message)
      Loading.value = false
    })
    .finally(() => {
      Loading.value = false
    })
}
const getMenuListData = async () => {
  const res = await getMenuListService(params)
}
// getMenuListData()
</script>
