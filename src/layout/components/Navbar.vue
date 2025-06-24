<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像和用户名称 -->
          <img v-if="avatar" :src="avatar" class="user-avatar" />
          <span class="username" v-else>{{ name?.charAt(0) }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- 阻止默认事件 -->
          <a target="_blank" @click.prevent="updataPassword">
            <el-dropdown-item>修改密码 </el-dropdown-item>
          </a>
          <!-- native是事件的修饰符 -->
          <!-- el-dropdown-item是没有点击事件的，想要注册原生事件就加上native -->
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- sync可以接收子组件传过来的事件和值 -->
    <el-dialog
      title="修改密码"
      :visible.sync="showDialog"
      width="500px"
      @close="btnCancel"
    >
      <el-form
        label-width="120px"
        ref="passForm"
        :model="passForm"
        :rules="rules"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            show-password
            type="text"
            size="samll"
            v-model="passForm.oldPassword"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            show-password
            type="text"
            size="samll"
            v-model="passForm.newPassword"
          />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input
            show-password
            type="text"
            size="samll"
            v-model="passForm.confirmPassword"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="btnOK"
            >确认修改</el-button
          >
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { updatePassword } from "@/api/user";
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      showDialog: false,
      passForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "旧密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 16,
            message: "密码长度应为6-16位之间",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 16,
            message: "密码长度应为6-16位之间",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "重复密码不能为空",
            trigger: "blur",
          },
          {
            trigger: "blur",
            // 自定义校验 不使用箭头函数的话，this就是该组件实例vc
            validator: (rule, value, callback) => {
              if (this.passForm.newPassword === value) {
                callback();
              } else {
                callback(new Error("重复密码和新密码不一致"));
              }
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
    updataPassword() {
      this.showDialog = true;
    },
    btnOK() {
      this.$refs.passForm.validate(async (isOK) => {
        if (isOK) {
          //调用接口
          await updatePassword(this.passForm);
          this.$message.success("修改密码成功");
          //重置表单
          this.btnCancel();
        }
      });
    },
    btnCancel() {
      this.$refs.passForm.resetFields();
      this.showDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .name {
          margin-right: 10px;
          font-size: 16px;
        }
        .username {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be;
          color: white;
          border-radius: 50%;
          margin-right: 4px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-setting {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
