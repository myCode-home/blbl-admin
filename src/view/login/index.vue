<template>
  <el-row class="main" justify="center">
    <el-col :span="8">
      <el-card class="login-box">
        <img :src="loginHead" class="loginimg" />
        <el-link type="primary" class="register-link" @click="handelRegister">
          {{ !isLoginRegister ? '去注册' : '去登录' }}
        </el-link>
        <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="auto"
          class="login-form"
          :hide-required-asterisk="false"
        >
          <el-form-item prop="username">
            <el-input
              v-model="ruleForm.username"
              type="text"
              prefix-icon="user"
              placeholder="请输入用户名"
              value="17393987803"
            />
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              v-model="ruleForm.passWord"
              type="passWord"
              prefix-icon="Lock"
              placeholder="请输入密码"
              value="admin23"
            />
          </el-form-item>
          <el-form-item class="check-item" :class="{ show: isLoginRegister }" prop="check">
            <el-input
              v-model="ruleForm.check"
              type="text"
              prefix-icon="Lock"
              placeholder="请输入确认验证码"
            >
              <template #append>
                <el-button type="primary" @click="sendCheckCode" :disabled="checkBtn.disabled">{{
                  checkBtn.text
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="submit-item" :class="{ show: !isLoginRegister }">
            <el-button
              :loading="btnStatus.loading"
              :disabled="btnStatus.disabled"
              type="primary"
              @click="submitForm(ruleFormRef)"
            >
              {{ !isLoginRegister ? '登录' : '注册' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getCheckCodeService, useAuthenticationService, useLoginService } from '@/apis/login'

// false为登录，true为注册
const isLoginRegister = ref(false)
const router = useRouter()
const loginHead = '../../../public/images/login-head.png'

const ruleForm = ref({
  username: '',
  passWord: '',
  check: '',
})
const initForm = () => {
  ruleForm.value.passWord = ''
  ruleForm.value.check = ''
}
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[6]|17[0-8]|18[0-9]|19[8,9])\d{8}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  passWord: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '请输入4-16位密码', trigger: 'blur' },
  ],
  check: [{ validator: validateCheckCode, trigger: 'blur' }],
})
// 自定义校验验证码的函数
function validateCheckCode(rule: any, value: any, callback: any) {
  if (!isLoginRegister.value) {
    callback()
    return
  }
  if (value === '') {
    callback(new Error('输入验证码'))
  } else if (value.length !== 4) {
    callback(new Error('输入正确的4位验证码'))
  } else {
    callback()
  }
}

// btn 的状态
const btnStatus = reactive({
  loading: false,
  disabled: false,
})

// 登录注册表单提交
const ruleFormRef = ref()
// 判断是注册还是登录提交表单
const submitForm = async (form: any) => {
  form.validate(async (valid: boolean) => {
    btnStatus.loading = true
    btnStatus.disabled = true
    if (valid) {
      // 如果是注册的按钮
      if (isLoginRegister.value) {
        try {
          const res = await useAuthenticationService({
            userName: ruleForm.value.username,
            passWord: ruleForm.value.passWord,
            validCode: ruleForm.value.check,
          })
          if (res.data.code === 10000) {
            ElMessage.success('注册成功！！！')
            initForm()
            handelRegister()
            return
          }
          ElMessage.error(res.data.message.msg)
        } catch (error: any) {
          ElMessage.error(error.message)
        } finally {
          btnStatus.loading = false
          btnStatus.disabled = false
        }
      } else {
        try {
          const res = await useLoginService({
            userName: ruleForm.value.username,
            passWord: ruleForm.value.passWord,
            // userName: '17393987803',
            // passWord: 'admin23',
          })
          console.log(res, '登录接口返回数据')
          if (res.code === 10000) {
            ElMessage.success('登录成功！！！')
            router.push('/')
            useUserStore().setToken(res.data.token)
            useUserStore().setUserInfo(res.data.userInfo)
            console.log(useUserStore().userInfo, 'userInfo', res.data.userInfo)
            return
          }
          ElMessage.error(res.data.message)
        } catch (error: any) {
          ElMessage.error(error.message)
        } finally {
          btnStatus.loading = false
          btnStatus.disabled = false
        }
      }
    } else {
      ElMessage.error('校验不通过')
      btnStatus.loading = false
      btnStatus.disabled = false
    }
  })
}
// 切换登录注册
const handelRegister = () => {
  isLoginRegister.value = !isLoginRegister.value
}
// 验证码发送相关的数据
const checkBtn = reactive({
  text: '获取验证码',
  disabled: false,
  timer: 60,
})

// 验证码发送相关的函数
let checkCodeTimer: any = null
const sendCheckCode = async () => {
  if (checkBtn.disabled) {
    return
  }
  try {
    const res = await getCheckCodeService({ tel: ruleForm.value.username })
    console.log(res)
    if (res.data.code !== 10000) {
      return ElMessage.error(res.data.message.msg)
    }
    ElMessage.success('验证码发送成功！！！')
    checkBtn.text = `${checkBtn.timer}秒后重新获取`
    checkCodeTimer = setInterval(() => {
      checkBtn.timer--
      if (checkBtn.timer <= 0) {
        clearInterval(checkCodeTimer)
        checkBtn.disabled = false
        checkBtn.text = '获取验证码'
        checkBtn.timer = 60
      } else {
        checkBtn.text = `${checkBtn.timer}秒后重新获取`
      }
      checkBtn.disabled = true
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  background-color: skyblue;
  justify-content: center;
  align-items: center;
  .login-box {
    position: relative;
    min-width: 400px;
    max-width: 480px;
    min-height: 400px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    &.show {
      transform: translateY(0);
    }
    .loginimg {
      width: 100%;
    }
    .register-link {
      position: absolute;
      top: 35%;
      right: 10px;
      margin-top: 20px;
      text-align: right;
      z-index: 100;
    }
    .login-form {
      position: relative;
      margin-top: 20px;
      .check-item {
        position: absolute;
        display: none;
        transition: transform 0.18s ease-in-out;
        transform: translateY(-10px);
        width: 100%;
        &.show {
          display: block;
          transform: translateY(0);
        }
      }
      .submit-item {
        margin-top: 20px;
        margin-left: 30%;
        text-align: center;
        transform: translateY(40px);
        transition: transform 0.2s ease-in-out;
        &.show {
          transform: translateY(20px);
        }
        button {
          width: 100%;
        }
      }
    }
  }
}
</style>
