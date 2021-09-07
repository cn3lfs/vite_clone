<script setup lang="ts">
import { useUser } from "./composables/useUser";
import { useEmitter } from "@/utils/useEmitter";

const props = defineProps({
  getCurrentTreeNode: Function,
  tableData: Array,
  handleSearch: Function,
});

const emitter = useEmitter();

const {
  /**
   * 弹窗:
   */
  dialogVisible,
  // 搜索
  formInline,
  // 表格数据
  total,
  tableDataUser,
  getListUser,
  // 多选
  multipleSelection,
  handleSelectionChange,
  // 确认
  handleConfirmUser,
} = useUser(emitter, props);
</script>

<template>
  <el-dialog
    title="用户"
    top="50px"
    v-model="dialogVisible"
    width="1000px"
    :close-on-click-modal="false"
  >
    <div>
      <el-input
        @keyup.enter="getListUser"
        v-model="formInline.name"
        clearable
        style="width: 200px"
        placeholder="账户"
      ></el-input>
      <el-button class="ms-3" @click="getListUser" size="medium" type="primary">
        搜索
      </el-button>
      <el-table
        class="mt-3"
        :data="tableDataUser"
        border
        highlight-current-row
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
        }"
        max-height="600"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="姓名"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="账户"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="sex"
          label="性别"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="备注"
        ></el-table-column>
      </el-table>

      <Pagination
        :total="total"
        v-model:currentPage="formInline.page"
        v-model:pageSize="formInline.limit"
        @pagination="getListUser"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUser">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.user-container {
  max-height: 700px;
  overflow-y: auto;
}
</style>
