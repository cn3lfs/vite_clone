<script setup lang="ts">
import { ref, reactive, watchEffect, Ref, nextTick } from "vue";
import { MessageConfirm, MessageSuccess, MessageError } from "@/utils/index";

import { useEmitter } from "@/utils/useEmitter";

import {
  fetchAuthorizeTree,
  modifyMenuAuthority,
  getMenuAuthority,
} from "@/api/assign";
import { getDictByCode } from "@/api/dict";
import { useAssign } from "./composables/useAssign";

const props = defineProps({
  currentTreeNode: Object,
});

const emitter = useEmitter();

const {
  // 菜单下的系统
  system,
  systemOptions,
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
  // 弹窗
  dialogVisible,
  // 设置菜单权限
  selectChildren,
  unSelectChildren,
  handleConfirmAssign,
} = useAssign(emitter, props);
</script>

<template>
  <el-dialog
    title="用户"
    top="50px"
    v-model="dialogVisible"
    width="700px"
    :close-on-click-modal="false"
  >
    <div class="assign-menu">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="选择系统">
          <el-select
            v-model="system"
            @change="getMainTree"
            placeholder="选择系统"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in systemOptions"
              :key="item.id"
              :label="item.labelDefault"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleConfirmAssign" type="primary">
            保存
          </el-button>
        </el-form-item>
      </el-form>
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
        class="filter-tree menu-tree"
        check-strictly
        show-checkbox
        node-key="id"
        highlight-current
        default-expand-all
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
              <el-tooltip
                class="item"
                effect="dark"
                content="选中当前节点和所有下级节点"
                placement="top-start"
              >
                <el-button
                  size="mini"
                  type="text"
                  @click="selectChildren(data)"
                >
                  <i class="el-icon-circle-check"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="取消选中当前节点和所有下级节点"
                placement="top-start"
              >
                <el-button
                  size="mini"
                  type="text"
                  @click="unSelectChildren(data)"
                >
                  <i class="el-icon-circle-close"></i>
                </el-button>
              </el-tooltip>
              <span></span>
            </span>
          </div>
        </template>
      </el-tree>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.assign-menu {
  height: 700px;
  overflow: auto;
}
.menu-tree {
  .el-icon-circle-check:before {
    font-size: 16px;
  }
  .el-icon-circle-close:before {
    font-size: 16px;
  }
  .el-tree-node__content {
    height: 30px;
  }
  .el-tree-node__content > label.el-checkbox {
    margin-top: 6px;
  }
}
</style>
