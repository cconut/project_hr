<!-- 在 Vue 中，v-model 在组件上的使用会被扩展为 value 的 prop 和 input 事件的组合 -->
<template>
  <el-cascader
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    :value="value"
    @change="changeValue"
  >
  </el-cascader>
</template>
<script>
import { getDepartment } from "@/api/department";
import { transListToTreeData } from "@/utils";
export default {
  props: {
    //存储的是部门的id
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      treeData: [], // 赋值给 级联组件的options
      props: {
        label: "name", // 要展示的字段
        value: "id", // 要存储的字段
      },
    };
  },
  created() {
    this.getDepartment();
  },
  methods: {
    async getDepartment() {
      this.treeData = transListToTreeData(await getDepartment(), 0); // 将组织架构的数据 转化树形赋值给treeData
    },
    changeValue(list) {
      //取到数组的最后一位
      if (list.length > 0) {
        this.$emit("input", list[list.length - 1]);
      } else {
        this.$emit("input", null);
      }
    },
  },
};
</script>