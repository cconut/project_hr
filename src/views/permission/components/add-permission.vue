<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <el-form
      ref="permissionForm"
      :model="permissionForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="权限名称" prop="name">
        <el-input
          size="mini"
          style="width: 90%"
          v-model="permissionForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input
          size="mini"
          style="width: 90%"
          v-model="permissionForm.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input
          size="mini"
          type="textarea"
          style="width: 90%"
          v-model="permissionForm.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="permissionForm.enVisible"
          active-value="1"
          inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" :span="13">
          <el-button size="mini" type="primary" @click="btnOk">确定</el-button>
          <el-button size="mini" @click="cancel">取消</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  addPermission,
  getPermissionDetail,
  updatePermission,
} from "@/api/permission";
export default {
  name: "addpermission",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    pid: {
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      default: 1,
    },
    currentId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      permissionForm: {
        name: "",
        code: "",
        description: "",
        type: "",
        pid: "",
        enVisible: "",
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    close() {
      this.permissionForm = {
        name: "",
        code: "",
        description: "",
        type: "",
        pid: "",
        enVisible: "",
      };
      this.$refs.permissionForm.resetFields();
      this.$emit("update:showDialog", false);
    },
    cancel() {
      this.close();
    },
    btnOk() {
      this.$refs.permissionForm.validate(async (isOk) => {
        if (isOk) {
          //type和pid设置一个默认值，如果未传值过来就使用默认值
          this.permissionForm.type = this.type;
          this.permissionForm.pid = this.pid;
          if (this.currentId) {
            await updatePermission(this.permissionForm);
            this.$message.success("修改权限成功");
            //编辑模式
          } else {
            //新增模式
            await addPermission(this.permissionForm);
            this.$message.success("添加权限成功");
          }
          this.$emit("updatePermission");
          this.close();
        }
      });
    },
    //这个方法由父组件调用
    async getPermissionDetail() {
      const result = await getPermissionDetail(this.currentId);
      this.permissionForm = result;
    },
  },
  computed: {
    showTitle() {
      return this.permissionForm.id ? "编辑权限" : "新增权限";
    },
  },
};
</script>