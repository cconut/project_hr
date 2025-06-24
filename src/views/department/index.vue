<template>
  <div class="container">
    <div class="app-container">
      <!-- 使用作用域插槽，这里的el-tree是子组件，父组件是我的整个index.vue -->
      <el-tree
        :data="depts"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
      >
        <!-- 节点结构 -->
        <template v-slot="{ data }">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            style="width: 100%; height: 40px"
          >
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4"></el-col>
            <span class="tree-manager">{{ data.managerName }}</span>
            <el-dropdown @command="operateDept($event, data.id)">
              <span class="el-dropdown-link">
                下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层 -->
    <!-- 加上.sync表示会接收子组件的事件  update:showDialog,传过来的值会赋值给我这个showDialog属性 不用写@自定义事件了-->
    <!-- ref 可以获取自定义组件的实例对象 -->
    <add-dept
      :showDialog.sync="showDialog"
      :currentNodeId="currentNodeId"
      @updateDepartment="updateDepartment"
      ref="addDept"
    />
  </div>
</template>

<script>
import { getDepartment, delDepartment } from "@/api/department";
import { transListToTreeData } from "@/utils/index";
import AddDept from "./components/add-dept.vue";
export default {
  name: "Department",
  components: {
    AddDept,
  },
  data() {
    return {
      currentNodeId: null, //存储当前点击的id
      showDialog: false,
      depts: [],
      defaultProps: {
        label: "name", //设置显示内容的字段名
        children: "children", //设置子节点的字段名
      },
    };
  },
  methods: {
    async getDep() {
      const result = await getDepartment();
      this.depts = transListToTreeData(result, 0);
    },
    operateDept(type, id) {
      //添加子部门
      if (type === "add") {
        this.showDialog = true;
        this.currentNodeId = id;
      } else if (type === "edit") {
        //编辑部门
        this.showDialog = true;
        this.currentNodeId = id;
        //要在子组件中获取数据
        //父组件调用子组件的方法来获取数据
        // props数据的更新是异步的,而this.$refs.addDept.getDepartmentDetail()是同步的，所以需要套一个$nextTick
        this.$nextTick(() => {
          // 给子组件设置一个ref属性，这样就得到了子组件的实例vcthis.$refs.addDept
          this.$refs.addDept.getDepartmentDetail();
        });
      } else {
        //删除部门
        this.$confirm("您确定要删除该部门码").then(async () => {
          await delDepartment(id);
          this.$message.success("删除部门成功");
          this.getDep();
        });
      }
    },
    updateDepartment() {
      this.getDep();
    },
  },
  created() {
    this.getDep();
  },
};
</script>

<style>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 30px;
}
</style>