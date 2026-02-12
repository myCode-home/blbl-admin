<template>
  <el-button type="primary" @click="visible = true">添加陪护师</el-button>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getPhotoListService, setCompanionService } from '@/apis/index'

const visible = ref(false)
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
      ElMessage.success('添加陪护师成功')
      visible.value = false
      formRef.value.resetFields()
    } else {
      ElMessage.error(res.message || '添加陪护师失败')
    }
  } catch (error) {
    ElMessage.error('添加陪护师失败')
  } finally {
  }
}
const handleCancel = () => {
  visible.value = false
  formRef.value.resetFields()
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
