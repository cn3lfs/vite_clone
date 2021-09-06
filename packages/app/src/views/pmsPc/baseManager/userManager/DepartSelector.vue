<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { getDeparts } from "@/api/user";

const emit = defineEmits<{
  (e: "depart-select", data: any): void;
}>();

const filterText = ref("");
const currentTreeNode = ref({});
const mainTreeData = ref([]);

const defaultProps = {
  children: "children",
  label: "label",
};

const mainTreeRef = ref(null);

function getTreeNodeData(data) {
  currentTreeNode.value = data;
}

function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

const dialogVisible = ref(false);

function handleConfirm() {
  emit("depart-select", currentTreeNode.value);
  dialogVisible.value = false;
}
function handleShow() {
  dialogVisible.value = true;
}

watchEffect(() => {
  if (mainTreeRef.value) {
    mainTreeRef.value.filter(filterText.value);
  }
});

getDeparts().then((data) => {
  mainTreeData.value = data;
});

defineExpose({
  handleShow,
});
</script>

<template>
  <div>
    <el-dialog
      title="用户"
      top="50px"
      v-model="dialogVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
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
        ></el-tree>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.depart-select {
  height: 700px;
  overflow: auto;
}
</style>
