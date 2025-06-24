<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <!-- @input,只要内容发生变化就会触发 -->
        <el-input
          style="margin-bottom: 10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          v-model="queryParams.keyword"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
        ></el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button
            size="mini"
            type="primary"
            @click="$router.push('/employee/detail')"
            >添加员工</el-button
          >
          <el-button size="mini" @click="showExcelDialog = true"
            >excel导入</el-button
          >
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column align="center" label="头像" prop="staffPhoto">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30">
              </el-avatar>
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="username" />
          <el-table-column
            label="手机号"
            sortable
            prop="mobile"
            width="120px"
          />
          <el-table-column
            label="工号"
            sortable
            prop="workNumber"
            width="120px"
          />
          <el-table-column label="聘用形式" prop="formIfEmployment">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column
            label="入职时间"
            sortable
            prop="timeOfEntry"
            width="120px"
          />
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button
                size="mini"
                type="text"
                @click="$router.push(`/employee/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button size="mini" type="text" @click="btnRole(row.id)"
                >角色</el-button
              >
              <el-popconfirm
                title="确定删除该员工吗"
                @onConfirm="confirmDel(row.id)"
              >
                <!-- slot="reference"设置触发确认框弹出的源元素 -->
                <el-button
                  size="mini"
                  type="text"
                  slot="reference"
                  style="margin-left: 15px"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <import-excel
      :showExcelDialog.sync="showExcelDialog"
      @uploadSuccess="getEmployeeList"
    />
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <el-checkbox-group v-model="roleIds">
        <!-- 要存储的属性是list.id,所以在label中存储的是id -->
        <el-checkbox
          v-for="list in roleList"
          :key="list.key"
          :label="list.id"
          >{{ list.name }}</el-checkbox
        >
      </el-checkbox-group>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnRoleOk"
            >确定</el-button
          >
          <el-button size="mini" @click="showRoleDialog = false"
            >取消</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from "@/api/department";
import {
  getEmployeeList,
  exportEmployee,
  delEmployee,
  getEmployeeDetail,
} from "@/api/employee";
import { transListToTreeData } from "@/utils";
import { getEnableRoleList, assignRole } from "@/api/role";
import FileSaver from "file-saver";
import importExcel from "./components/import-excel.vue";

export default {
  components: { importExcel },
  name: "Employee",
  data() {
    return {
      depts: [],
      list: [],
      defaultProps: {
        label: "name",
        children: "children",
      },
      queryParams: {
        departmentId: null,
        page: 1,
        pageSize: 10,
        keyword: "",
      },
      total: 0,
      showExcelDialog: false,
      //控制角色弹层
      showRoleDialog: false,
      //接收角色列表
      roleList: [],
      //存储选中的id值
      roleIds: [],
      //记录当前用户的id
      currentUserId: null,
    };
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment();
      this.depts = transListToTreeData(result, 0);
      this.queryParams.departmentId = this.depts[0].id;
      //设置选中节点
      //树组件的渲染是异步的 等到更新完毕
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId);
      });
      this.getEmployeeList();
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id;
      //切换部门的时候，需要将页码改为1
      this.queryParams.page = 1;
      this.getEmployeeList();
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams);
      this.list = rows;
      this.total = total;
    },
    changePage(newPage) {
      this.queryParams.page = newPage;
      this.getEmployeeList();
    },
    changeValue() {
      //防抖，在单位事件内只执行一次
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.queryParams.page = 1;
        this.getEmployeeList();
      }, 500);
    },
    //导出员工excel
    async exportEmployee() {
      const result = await exportEmployee();
      //console.log(result);
      //FileSaver.saveAs(blob对象,文件名称)
      //下载文件
      FileSaver.saveAs(result, "员工信息表.xlsx");
    },
    async confirmDel(id) {
      await delEmployee(id);
      if (this.list.length === 1 && this.queryParams.page > 1)
        this.queryParams.page--;
      this.getEmployeeList();
      this.$message.success("删除员工成功");
    },
    async btnRole(id) {
      this.currentUserId = id;
      this.roleList = await getEnableRoleList();
      const { roleIds } = await getEmployeeDetail(id);
      this.roleIds = roleIds;
      //获取成功之后再弹层
      this.showRoleDialog = true;
    },
    async btnRoleOk() {
      await assignRole({ id: this.currentUserId, roleIds: this.roleIds });
      this.$message.success("分配用户角色成功");
      this.showRoleDialog = false;
    },
  },
  created() {
    this.getDepartment();
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    //占据剩余空间
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>