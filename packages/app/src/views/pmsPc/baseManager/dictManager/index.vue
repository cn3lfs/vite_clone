<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import {
  getDicts,
  getDictTree,
  // 字典key
  addDictType,
  getDictType,
  putDictType,
  delDictType,
  // 字典值
  addDictValue,
  getDictValue,
  delDictValue,
  putDictValue,
} from "@/api/dict";
import { MessageConfirm, MessageSuccess, MessageError } from "@/utils/index";

const filterText = ref("");
const currentTreeNode = ref({});
const mainTreeData = ref([]);
const mainTreeFormRef = ref(null);
const defaultProps = {
  children: "children",
  label: "label",
};

const mainTreeRef = ref(null);

function getTreeNodeData(data) {
  currentTreeNode.value = data;
  name.value = "";
  handleSearch();
}

function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

watchEffect(() => {
  if (mainTreeRef.value) {
    mainTreeRef.value.filter(filterText.value);
  }
});

function getMainTree() {
  getDictTree().then((data) => {
    mainTreeData.value = data;
  });
}

getMainTree();

const dialogVisibleDepart = ref(false);
const mainTreeForm = ref({});
const mainTreeFormRules = {
  code: [
    {
      required: true,
      message: "请输入编码",
      trigger: "blur",
    },
    {
      min: 1,
      max: 20,
      message: "长度在 1 到 20 个字符",
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: "请输入目录名",
      trigger: "blur",
    },
    {
      min: 1,
      max: 20,
      message: "长度在 1 到 20 个字符",
      trigger: "blur",
    },
  ],
};
const departAction = ref("create");
function onInit() {
  mainTreeForm.value = {
    parentId: -1,
    name: "根节点需修改",
    code: new Date().getTime() + "_tmp",
  };

  addDictType(mainTreeForm.value).then(() => {
    getMainTree();
    dialogVisibleDepart.value = false;
  });
}
function onEdit(node, data) {
  departAction.value = "update";
  dialogVisibleDepart.value = true;
  getDictType(data.id).then((response) => {
    mainTreeForm.value = response.data;
  });
}
function onAppend(node, data) {
  departAction.value = "create";
  dialogVisibleDepart.value = true;
  mainTreeForm.value = {
    parentId: data.id,
    name: "子节点",
    code: new Date().getTime() + "_tmp",
  };
}
function onRemove(node, data) {
  MessageConfirm("此操作将永久删除, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delDictType(data.id).then(() => {
      MessageSuccess("删除成功");
      getMainTree();
    });
  });
}
function handleConfirmDepart() {
  if (departAction.value === "create") {
    addDictType(mainTreeForm.value).then(() => {
      getMainTree();
      dialogVisibleDepart.value = false;
    });
  }
  if (departAction.value === "update") {
    putDictType(currentTreeNode.value.id, mainTreeForm.value).then(() => {
      getMainTree();
      dialogVisibleDepart.value = false;
    });
  }
}

const tableData = ref([]);
const dialogVisible = ref(false);
const name = ref("");

function handleSearch() {
  getDicts(currentTreeNode.value.id).then((res) => {
    tableData.value = res.data.rows;
  });
}

const aDictValue = {
  id: null,
  orderNum: 1,
  code: "",
  value: "",
  labelDefault: "",
  labelEnUs: "",
  labelZhCh: "",
  parentId: null,
  typeId: null,
  remark: "",
};
const dictTypeForm = ref({
  ...aDictValue,
});
const dictTypeFormRules = {
  code: [
    {
      required: true,
      message: "请输入编码",
      trigger: "blur",
    },
    {
      min: 1,
      max: 100,
      message: "长度在 1 到 100 个字符",
      trigger: "blur",
    },
  ],
  labelDefault: [
    {
      required: true,
      message: "请输入字典值名称",
      trigger: "blur",
    },
  ],
};
const dictAction = ref("create");
function handleConfirmDict() {
  // 拼接
  dictTypeForm.value.code =
    currentTreeNode.value.code + "_" + dictTypeForm.value.value;
  dictTypeForm.value.labelZhCh = dictTypeForm.value.labelDefault;
  dictTypeForm.value.labelEnUs = dictTypeForm.value.value;
  if (dictAction.value === "create") {
    addDictValue(dictTypeForm.value).then(() => {
      handleSearch();
      dialogVisible.value = false;
    });
  }
  if (dictAction.value === "update") {
    putDictValue(dictTypeForm.value.id, dictTypeForm.value).then(() => {
      handleSearch();
      dialogVisible.value = false;
    });
  }
}
function handleAddDict() {
  dictAction.value = "create";
  dictTypeForm.value = { ...aDictValue };
  dictTypeForm.value.typeId = currentTreeNode.value.id;
  dialogVisible.value = true;
}
function handleUpdateDict(row) {
  dictAction.value = "update";
  dictTypeForm.value = { ...row };
  dialogVisible.value = true;
}
function handleDeleteDict(row) {
  MessageConfirm("此操作将永久删除, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    delDictValue(row.id).then(() => {
      MessageSuccess("删除成功");
      handleSearch();
    });
  });
}
</script>

<template>
  <div class="depart-container">
    <div class="depart-left">
      <el-card class="box-card">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <span>字典KEY</span>
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
      <el-card class="box-card">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <span class="align-middle">字典值</span>
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
              prop="code"
              label="编码"
              width="220px"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="labelDefault"
              label="名称"
              width="150px"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="orderNum"
              label="排序"
              width="80px"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="remark"
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
                  @click="handleUpdateDict(row)"
                  type="text"
                  size="small"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
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
    </div>

    <el-dialog
      title="字典值"
      top="50px"
      v-model="dialogVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dictTypeForm"
        :rules="dictTypeFormRules"
        label-width="100px"
      >
        <el-form-item label="编码" prop="code">
          <el-input v-model="dictTypeForm.value">
            <template #prepend>{{ currentTreeNode.code + "_" }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="labelDefault">
          <el-input v-model="dictTypeForm.labelDefault"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="dictTypeForm.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="dictTypeForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmDict">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="字典KEY"
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
