<template>
  <!-- 陪护师管理弹窗 -->
  <el-dialog v-model="visible" title="陪护师管理" width="50%">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-image
          v-if="form.avatar"
          :src="form.avatar"
          fit="fill"
          style="width: 100px; height: 100px"
        />
        <el-button v-else type="primary" size="small" @click="handleUploadAvatar"
          >上传头像</el-button
        >
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="60" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="1"> 生效 </el-radio>
          <el-radio :value="0"> 失效 </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
  <!-- 选择头像弹窗 -->
  <el-dialog v-model="avatarVisible" title="选择头像" width="40%">
    <div v-loading="avatarLoading">
      <el-image
        v-for="item in avatarList as any"
        :key="item.id"
        :src="item.url"
        :lazy="true"
        :fit="'fill'"
        class="avatar-item"
        :class="{ active: item.url === selectAvatar }"
        @click="selectAvatar = item.url"
      />
    </div>
    <template #footer>
      <el-button @click="handleCancelAvatar">取消</el-button>
      <el-button type="primary" @click="handleSelectAvatar">选择</el-button>
    </template>
  </el-dialog>
  <super-table
    ref="tableRef"
    :headerBtn="true"
    :tableData="tableData"
    :total="total"
    :columns="companionColumns"
    :selection="true"
    :params="params"
    :tableLoading="loading"
    :showOperation="true"
    @size-change="handleChange"
    @current-change="handleChange"
    @selection-change="handleSelectionChange"
  >
    <template #create_time="{ row }">
      {{ row.create_time ? new Date(row.create_time).toLocaleString() : '-' }}
    </template>
    <template #avatar="{ row }">
      <el-image v-if="row.avatar" :src="row.avatar" fit="fill" style="width: 50px; height: 50px" />
    </template>
    <template #active="{ row }">
      <el-tag :type="row.active ? 'success' : 'danger'">{{ row.active ? '正常' : '禁用' }}</el-tag>
    </template>
    <template #sex="{ row }">
      {{ row.sex == 1 ? '男' : '女' }}
    </template>
    <template #headerBtn>
      <el-button type="primary" icon="Plus" @click="handleAdd">添加</el-button>
      <el-popconfirm
        title="确认删除选中项吗？"
        @cancel="tableRef.clearSelection()"
        @confirm="handleDelete"
      >
        <template #reference>
          <el-button :disabled="ids.length === 0" type="danger" icon="Delete">删除</el-button>
        </template>
      </el-popconfirm>
    </template>
    <template #operation="{ row }">
      <el-button type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
    </template>
  </super-table>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPhotoListService,
  setCompanionService,
  getCompanionListService,
  deleteCompanionService,
} from '@/apis/index'
import { companionColumns } from '@/utils/data'

const isEdit = ref(false)
const visible = ref(false)
// 可以再before-close中调用clearSelection方法
const initForm = () => {
  form.value = {
    name: '',
    id: '',
    mobile: '',
    age: 18,
    sex: '',
    avatar: '',
    active: 1,
  }
}
const form = ref({
  name: '',
  id: '',
  mobile: '',
  age: 18,
  sex: '',
  avatar: '',
  active: 1,
})
const formRef = ref()
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  active: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const res = await setCompanionService(form.value)
    if (res.code === 10000) {
      ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
      visible.value = false
      getCompanionList()
      formRef.value.resetFields()
    } else {
      ElMessage.error(isEdit.value ? '编辑失败' : '添加失败')
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? '编辑失败' : '添加失败')
  } finally {
    loading.value = false
  }
}
const handleCancel = () => {
  visible.value = false
  initForm()
}

const avatarVisible = ref(false)
const avatarList = ref([])
const selectAvatar = ref('')
const avatarLoading = ref(true)
// 上传头像
const handleUploadAvatar = () => {
  // 上传头像逻辑
  avatarVisible.value = true
  getAvatarList()
}
// 取消选择头像
const handleCancelAvatar = () => {
  avatarVisible.value = false
  selectAvatar.value = ''
}
// 选择头像
const handleSelectAvatar = () => {
  console.log(selectAvatar.value)
  form.value.avatar = selectAvatar.value
  console.log(form.value.avatar)
  handleCancelAvatar()
}
// 获取头像列表
const getAvatarList = async () => {
  avatarLoading.value = true
  try {
    const res = await getPhotoListService({
      type: 1,
    })
    if (res.code === 10000) {
      avatarList.value = res.data
      avatarVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取头像列表失败')
  } finally {
    avatarLoading.value = false
  }
}
// 表格状态相关的数据
const tableData = ref([])
const total = ref(0)
const params = ref({
  pageSize: 10,
  pageNum: 1,
})
const tableRef = ref()
const loading = ref(false)
// 获取陪护师列表
const getCompanionList = async () => {
  loading.value = true
  try {
    const res = await getCompanionListService(params.value)
    if (res.code === 10000) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('获取陪护师列表失败')
  } finally {
    loading.value = false
  }
}
//添加操做
const handleAdd = () => {
  initForm()
  isEdit.value = false
  visible.value = true
}
// 删除操做
const handleDelete = async () => {
  // 如果没有选中任何数据，提示用户选择数据后删除
  if (ids.value.length === 0) {
    ElMessage.error('请选择要删除的陪护师')
    return
  }
  // 删除选中的数据
  try {
    console.log(JSON.stringify({ id: ids.value }))

    // return
    // id组成的数组
    const res = await deleteCompanionService({ id: selectedRows.value })
    if (res.code === 10000) {
      ElMessage.success('删除成功')
      getCompanionList()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  } finally {
    ids.value = []
    selectedRows.value = []
    tableRef.value.clearSelection()
  }
}
// 编辑操做
const handleEdit = (row: any) => {
  isEdit.value = true
  visible.value = true
  form.value = {
    ...row,
  }
}
// 选择的数据
const selectedRows = ref()
const ids = ref([])
// 选择数据
const handleSelectionChange = (val: any) => {
  selectedRows.value = val
  ids.value = val.map((item: any) => item.id)
}
// 分页数据切换了
const handleChange = async (val: any) => {
  getCompanionList()
}
onMounted(() => {
  getCompanionList()
})
</script>
<style scoped lang="scss">
.avatar-item {
  cursor: pointer;
  box-sizing: border-box;
  padding: 5px;
  transition: all 0.2s ease-in-out;
  &.active {
    transform: scale(1.05);
  }
}
</style>
