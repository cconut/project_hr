<template>
  <div class="container">
    <div class="app-container">
      <el-button
        class="btn-add"
        size="mini"
        type="primary"
        @click="showDialog = true"
        >添加权限</el-button
      >
      <el-table :data="list" row-key="id" default-expand-all>
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              size="mini"
              type="text"
              @click="showAddDialog(row.id, 2)"
              >添加</el-button
            >
            <el-button size="mini" type="text" @click="edit(row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="del(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-permission
      :showDialog.sync="showDialog"
      :pid="currentPid"
      :type="currentType"
      :currentId="currentId"
      ref="addPermission"
      @updatePermission="updatePermission"
    />
  </div>
</template>
<script>
import { getPermissonList, delPermission } from "@/api/permission";
import { transListToTreeData } from "@/utils";
import addPermission from "./components/add-permission.vue";
export default {
  components: { addPermission },
  name: "Permission",
  created() {
    this.getPermissonList();
  },
  data() {
    return {
      list: [],
      showDialog: false,
      currentPid: 0, // 当前选中的父级ID
      currentType: 2, // 当前要添加的权限类型
      currentId: null,
    };
  },
  methods: {
    async getPermissonList() {
      const result = transListToTreeData(await getPermissonList(), 0);
      //console.log(result);
      this.list = result;
    },
    updatePermission() {
      this.getPermissonList();
    },
    showAddDialog(pid, type) {
      this.currentPid = pid;
      this.currentType = type;
      this.showDialog = true;
      console.log(this.currentPid, this.currentType);
    },
    del(id) {
      this.$confirm("确定要删除该权限吗").then(async () => {
        await delPermission(id);
        this.$message.success("删除权限成功");
        this.getPermissonList();
      });
    },
    edit(id) {
      this.currentId = id;
      this.showDialog = true;
      //确保 ​​子组件已经接收到 currentId 这个 props​​，并且 ​​DOM 已经更新完成​​.
      //也可以在子组件当中通过watch监听变化
      this.$nextTick(() => {
        this.$refs.addPermission.getPermissionDetail();
      });
    },
  },
};
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>