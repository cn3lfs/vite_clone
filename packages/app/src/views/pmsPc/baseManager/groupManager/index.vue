<script setup lang="ts">
import Member from "./Member.vue";
import { useGroup } from "./composables/useGroup";
import { useEmitter } from "@/utils/useEmitter";
const emitter = useEmitter();

const {
  /**
   * 树
   * */
  mainTreeRef,
  // 配置
  defaultProps,
  // 数据
  mainTreeData,
  getMainTree,
  // 过滤
  filterText,
  filterNode,
  // 当前节点
  currentTreeNode,
  getTreeNodeData,

  /**
   * 弹窗
   * */
  dialogVisibleDepart,
  // 表单
  mainTreeFormRef,
  mainTreeForm,
  mainTreeFormRules,
  // CRUD
  departAction,
  onInit,
  onEdit,
  onAppend,
  onRemove,
  // 弹窗确认
  handleConfirmDepart,
} = useGroup(emitter);
</script>

<template>
  <div class="depart-container">
    <div class="depart-left">
      <el-card class="box-card">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <span>业务角色</span>
            <el-button
              class="button"
              size="medium"
              type="primary"
              @click="onInit"
            >
              添加根节点
            </el-button>
          </div>
        </template>
        <div class="depart-select">
          <el-input
            v-model="filterText"
            clearable
            placeholder="输入关键字进行过滤"
          ></el-input>
          <el-tree
            ref="mainTreeRef"
            :data="mainTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="getTreeNodeData"
            class="filter-tree"
            node-key="id"
            default-expand-all
            highlight-current
          >
            <template #default="{ node, data }">
              <div
                class="
                  d-flex
                  align-items-center
                  justify-content-between
                  flex-grow-1
                  pe-3
                "
              >
                <span>
                  <span>{{ node.label }}</span>
                </span>
                <span>
                  <el-button type="text" @click="onEdit(node, data)">
                    <i class="el-icon-edit" />
                  </el-button>
                  <el-button type="text" @click="onAppend(node, data)">
                    <i class="el-icon-circle-plus-outline" />
                  </el-button>
                  <el-button type="text" @click="onRemove(node, data)">
                    <i class="el-icon-delete" />
                  </el-button>
                  <span></span>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </el-card>
    </div>
    <div class="depart-right ms-3">
      <Member :currentTreeNode="currentTreeNode" />
    </div>

    <el-dialog
      title="业务角色"
      top="150px"
      v-model="dialogVisibleDepart"
      width="1000px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          ref="mainTreeFormRef"
          :model="mainTreeForm"
          :rules="mainTreeFormRules"
          status-icon
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="编码" prop="code">
            <el-input v-model="mainTreeForm.code"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="mainTreeForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="mainTreeForm.description"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleDepart = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmDepart">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.depart-container {
  display: flex;

  .el-card__header {
    padding: 10px 15px;
    height: 60px;
  }

  .depart-left {
    flex: 1 0 400px;
    width: 400px;

    .depart-select {
      height: 700px;
      overflow-y: auto;
    }
  }

  .depart-right {
    flex: 1 1 700px;
    width: 700px;

    .user-container {
      max-height: 700px;
      overflow-y: auto;
    }
  }
}
</style>
