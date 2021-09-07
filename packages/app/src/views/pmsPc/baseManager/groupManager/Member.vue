<script setup lang="ts">
import User from "./User.vue";
import { useMember } from "./composables/useMember";
import { useGroup } from "./composables/useGroup";
import { useEmitter } from "@/utils/useEmitter";

const props = defineProps({
  currentTreeNode: Object,
});

const emitter = useEmitter();

const {
  /**
   * 外部表格:
   */
  // 搜索
  name,
  // 表格数据
  tableData,
  handleSearch,
  // 表格CRUD
  handleAddDict,
  handleDeleteDict,
  // 接口
  getCurrentTreeNode,
} = useMember(emitter, props);
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <span class="align-middle">用户管理</span>
      </div>
    </template>
    <div class="user-container">
      <el-input
        @keyup.enter="handleSearch"
        v-model="name"
        clearable
        style="width: 200px"
        placeholder="名称"
      ></el-input>
      <el-button
        class="ms-2"
        @click="handleSearch"
        size="medium"
        type="primary"
      >
        搜索
      </el-button>
      <el-button @click="handleAddDict" size="medium" type="primary">
        添加
      </el-button>
      <el-table
        class="mt-3"
        :data="tableData"
        border
        highlight-current-row
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
        }"
      >
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
        <el-table-column
          align="center"
          prop="description"
          label="操作"
          width="100px"
        >
          <template #default="{ row }">
            <el-button
              @click="handleDeleteDict(row)"
              size="small"
              type="text"
              style="color: red"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>

  <User
    :getCurrentTreeNode="getCurrentTreeNode"
    :tableData="tableData"
    :handleSearch="handleSearch"
  />
</template>

<style lang="scss">
.user-container {
  max-height: 700px;
  overflow-y: auto;
}
</style>
