<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <el-form label-width="120px" ref="addDept" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          size="mini"
          placeholder="2-10个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          size="mini"
          placeholder="2-10个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select
          style="width: 80%"
          size="mini"
          placeholder="请选择负责人"
          v-model="formData.managerId"
        >
          <!-- label表示在选项里显示的字段，value是v-model绑定的值 -->
          <el-option
            v-for="manager in managerList"
            :key="manager.id"
            :label="manager.username"
            :value="manager.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          type="textarea"
          :rows="4"
          size="mini"
          placeholder="1-100个字符"
          v-model="formData.introduce"
        />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="btnOK"
              >确认</el-button
            >
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  getDepartment,
  getManagerList,
  addDeparment,
  getDepartmentDetail,
  updateDepartment,
} from "@/api/department";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    //新增子部门的时候，需要先得到父部门的id，才能添加
    //传过来的父部门id
    currentNodeId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      managerList: [],
      formData: {
        code: "", //部门编码
        introduce: "", //部门介绍
        managerId: "", //部门负责人id
        name: "", //部门名称
        pid: "", //父级部门的id
      },
      rules: {
        code: [
          {
            required: true,
            message: "部门编码不能为空",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "部门编码的长度为2-10个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: async (rule, value, callback) => {
              let result = await getDepartment();

              //判断是否是编辑模式,通过是否有id来判断
              if (this.formData.id) {
                result = result.filter((item) => item.id !== this.formData.id);
              }
              if (result.some((item) => item.code === value)) {
                callback(new Error("部门中已经有该编码了"));
              } else {
                callback();
              }
            },
          },
        ],
        introduce: [
          {
            required: true,
            message: "部门介绍不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 100,
            message: "部门介绍的长度为1-100个字符",
            trigger: "blur",
          },
        ],
        managerId: [
          {
            required: true,
            message: "部门负责人不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "部门名称不能为空",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "部门名称的长度为2-10个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: async (rule, value, callback) => {
              let result = await getDepartment();

              //判断是否是编辑模式,通过是否有id来判断
              if (this.formData.id) {
                result = result.filter((item) => item.id !== this.formData.id);
              }

              if (result.some((item) => item.name === value)) {
                callback(new Error("部门中已经有该名称了"));
              } else {
                callback();
              }
            },
          },
        ],
      },
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  methods: {
    close() {
      this.formData = {
        code: "", //部门编码
        introduce: "", //部门介绍
        managerId: "", //部门负责人id
        name: "", //部门名称
        pid: "", //父级部门的id
      };
      //重置表单
      this.$refs.addDept.resetFields();
      //修改父组件的值，子传父
      this.$emit("update:showDialog", false);
    },
    async getManagerL() {
      this.managerList = await getManagerList();
    },
    btnOK() {
      this.$refs.addDept.validate(async (isOk) => {
        if (isOk) {
          //通过formData中的id来判断是什么场景
          if (this.formData.id) {
            //修改
            await updateDepartment(this.formData);
            this.$message.success("更新部门成功");
          } else {
            //新增
            await addDeparment({ ...this.formData, pid: this.currentNodeId });
            this.$message.success("新增部门成功");
          }
          //通知父组件更新
          this.$emit("updateDepartment");
          this.close();
        }
      });
    },
    //获取组织的详情，这个方法由父组件调用
    async getDepartmentDetail() {
      const result = await getDepartmentDetail(this.currentNodeId);
      this.formData = result;
    },
  },
  created() {
    this.getManagerL();
  },
};
</script>