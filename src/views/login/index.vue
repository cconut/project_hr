<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card"> </el-card>
      <!-- 登录表单 -->
      <el-form :model="loginForm" :rules="loginRules" ref="form">
        <el-form-item prop="mobile">
          <el-input
            placeholder="请输入手机号"
            v-model="loginForm.mobile"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="isAgree">
          <el-checkbox v-model="loginForm.isAgree">
            用户平台使用协议
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 350px" @click="login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        mobile: process.env.NODE_ENV === "development" ? "13800000002" : "",
        password: process.env.NODE_ENV === "development" ? "hm#qd@23!" : "",
        isAgree: process.env.NODE_ENV === "development",
      },
      loginRules: {
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          //手机号格式校验
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          //密码格式校验
          {
            min: 6,
            max: 16,
            message: "密码长度应为6-16位之间",
            trigger: "blur",
          },
        ],
        isAgree: [
          {
            validator: (rule, value, callback) => {
              //rule 校验规则 value 校验的值 callback 函数
              value ? callback() : callback(new Error("您必须勾选用户协议"));
            },
          },
        ],
      },
    };
  },
  methods: {
    login() {
      // validate是 el-form组件自带的方法，用于触发表单的验证
      //里面的回调函数可以是async的，处理异步
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // vuex中的action返回的是一个promise，所以要异步
          await this.$store.dispatch("user/login", this.loginForm);
          this.$router.push("/");
        }
      });
    },
  },
};
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color: #606266;
    }
  }
}
</style>
