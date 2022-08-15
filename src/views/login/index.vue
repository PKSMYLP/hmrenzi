<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" label-position="left" :model="loginForm" :rules="rules">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <!-- 手机号input -->
      <el-form-item prop="mobile">
        <span class="svg-container el-icon-user-solid" />
        <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <!-- 密码input -->
      <el-form-item prop="password">
        <span class="svg-container ">
          <!-- 使用封装的组件加载图标 -->
          <svg-icon icon-class="password" />
        </span>
        <el-input ref="pwdIpt" v-model="loginForm.password" placeholder="请输入密码" :type="passwordType" />
        <span class="svg-container ">
          <!-- 使用封装的组件加载图标 -->
          <svg-icon :icon-class="`${passwordType==='password'?'eye':'eye-open'}`" @click="pwdChange" />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button type="primary" class="loginBtn" :loading="loading" style="width:100%;margin-bottom:30px;" @click="login">登录</el-button>
      <!-- 提示 -->
      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validatorMobile = (rule, value, callback) => {
      if (validMobile(value)) {
        return callback()
      }
      return callback(new Error('手机号码格式不正确'))
    }
    return {
      passwordType: 'password',
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loading: false,
      // 校验规则
      rules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          // { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
          //   message: '手机号码格式不正确' }
          { validator: validatorMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码' },
          {	min: 6, max: 16, message: '密码的长度在6-16位之间 ', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 密码框
    pwdChange() {
      // 切换图标
      // 切换input的类型
      this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
      // 点击时输入框聚焦 ref  数据先更新 但视图更新是异步所以要使用延迟
      this.$nextTick(() => {
        this.$refs.pwdIpt.focus()
      })
    },
    // 提交
    async login() {
      try {
        await this.$refs.loginForm.validate() // validate()的形参不写回调函数 默认返回的是promise
        // 表单数据验证通过后 loading 设置true 加载中 防止多次点击发送请求
        this.loading = true
        await this.$store.dispatch('user/login', this.loginForm)
        // 页面跳转
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      } finally {
        // 结束后加载中结束
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff
  }

}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#68b0fe;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background-image: url('~@/assets/common/login.jpg');
  background-position:  center;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
}
}
</style>
