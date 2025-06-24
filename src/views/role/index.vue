<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showDialog = true"
          >添加角色</el-button
        >
      </div>
      <!-- 表格 -->

      <el-table :data="list">
        <el-table-column label="角色" align="center" width="200px" prop="name">
          <template v-slot="{ row }">
            <el-input
              v-if="row.isEdit"
              size="mini"
              v-model="row.editRow.name"
            ></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" width="200px" prop="state">
          <template v-slot="{ row }">
            <el-switch
              v-if="row.isEdit"
              v-model="row.editRow.state"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <span v-else>{{
              row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description">
          <template v-slot="{ row }">
            <el-input
              v-if="row.isEdit"
              type="textarea"
              v-model="row.editRow.description"
              size="mini"
            ></el-input>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center"
          ><template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button type="primary" size="mini" @click="btnEditOk(row)"
                >确定</el-button
              >
              <el-button size="mini" @click="editCancel(row)">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button type="text" size="mini" @click="btnPermission(row.id)"
                >分配权限</el-button
              >
              <el-button type="text" size="mini" @click="edit(row)"
                >编辑</el-button
              >
              <el-popconfirm
                title="你确定要删除吗"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button
                  type="text"
                  size="mini"
                  slot="reference"
                  style="margin-left: 10px"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end" style="height: 60px" align="middle">
        <el-pagination
          layout="prev, pager, next"
          :total="pageParams.total"
          :current-page="pageParams.page"
          :page-size="pageParams.pagesize"
          @current-change="changePage"
        >
        </el-pagination>
      </el-row>
    </div>
    <!-- 新增角色弹层 -->
    <el-dialog
      :visible.sync="showDialog"
      title="新增角色"
      width="500px"
      @close="btnCancel"
    >
      <el-form
        label-width="120px"
        :rules="rules"
        :model="roleForm"
        ref="roleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input size="mini" style="width: 300px" v-model="roleForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch
            size="mini"
            v-model="roleForm.state"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            size="mini"
            style="width: 300px"
            type="textarea"
            :rows="3"
            v-model="roleForm.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="13">
              <el-button size="mini" type="primary" @click="btnOK"
                >确定</el-button
              >
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分配权限弹层 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <el-tree
        node-key="id"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
        :default-checked-keys="permIds"
        ref="permTree"
        check-strictly="true"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnPermissionOK"
            >确定</el-button
          >
          <el-button size="mini" @click="showPermissionDialog = false"
            >取消</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoleList,
  addRole,
  updateRole,
  delRole,
  getRoleDetail,
} from "@/api/role";
import { getPermissonList } from "@/api/permission";
import { transListToTreeData } from "@/utils";
import { assignPerm } from "@/api/role";
export default {
  name: "Role",
  created() {
    this.getRoleList();
  },
  data() {
    return {
      list: [],
      showDialog: false,
      pageParams: {
        page: 1, //当前页码
        pagesize: 5, //一页多少条
        total: 0, //总共几条数据
      },
      roleForm: {
        name: "",
        description: "",
        state: 0,
      },
      rules: {
        name: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "描述不能为空",
            trigger: "blur",
          },
        ],
      },
      showPermissionDialog: false,
      permissionData: [],
      currentId: null,
      //所拥有权限的id
      permIds: [],
    };
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams);
      this.list = rows;
      this.pageParams.total = total;
      //针对每一行数据添加一个编辑标记isEdit
      this.list.forEach((item) => {
        this.$set(item, "isEdit", false);
        //缓存数据
        this.$set(item, "editRow", {
          name: item.name,
          description: item.description,
          state: item.state,
        });
      });
    },
    btnOK() {
      this.$refs.roleForm.validate(async (isOK) => {
        if (isOK) {
          await addRole(this.roleForm);
          this.$message.success("新增角色成功");
          this.getRoleList();
          this.btnCancel();
        }
      });
    },
    btnCancel() {
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },
    edit(row) {
      //console.log(row);
      row.isEdit = true;
      //更新缓存数据
      row.editRow.name = row.name;
      row.editRow.state = row.state;
      row.editRow.description = row.description;
    },
    //切换分页时请求新数据
    changePage(newPage) {
      this.pageParams.page = newPage;
      this.getRoleList();
    },
    async btnEditOk(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id });
        this.$message.success("更新角色成功");
        //这里没有去重新调用接口，而是直接更新之前获取到的数据进行修改
        Object.assign(row, {
          ...row.editRow,
          isEdit: false,
        });
      } else {
        this.$message.warning("角色和描述不能为空");
      }
    },
    editCancel(row) {
      row.editRow.name = row.name;
      row.editRow.state = row.state;
      row.editRow.description = row.description;
      row.isEdit = false;
    },
    async confirmDel(id) {
      await delRole();
      this.$message.success("删除角色成功");
      //删除的如果是最后一个
      if (this.list.length === 1) {
        this.pageParams.page--;
      }
      this.getRoleList();
    },
    async btnPermission(id) {
      this.currentId = id;
      this.permissionData = transListToTreeData(await getPermissonList(), 0);
      const { permIds } = await getRoleDetail(id);
      //console.log(permIds);
      this.permIds = permIds;
      this.showPermissionDialog = true;
    },
    async btnPermissionOK() {
      await assignPerm({
        id: this.currentId,
        permIds: this.$refs.permTree.getCheckedKeys(),
      });
      this.$message.success("分配权限成功");
      this.showPermissionDialog = false;
    },
  },
};
</script>
<style  scoped>
.role-operate {
  padding: 10px;
}
</style>

