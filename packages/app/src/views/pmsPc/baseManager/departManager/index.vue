<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import {
  getDeparts,
  getUsersByDepart,
  deleteUsersDepart,
  addUsersDepart,
  getUsers,
  getDepart,
  addDepart,
  updateDepart,
  deleteDepart,
  getDictValue,
} from "@/api/user";
import { MessageConfirm, MessageSuccess, MessageError } from "@/utils/index";

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
  getDeparts().then((data) => {
    mainTreeData.value = data;
  });
}

getMainTree();

const departTypeOptions = ref([]);

function getDepartType() {
  getDictValue("org_depart").then((response) => {
    departTypeOptions.value = response.data.rows;
  });
}

getDepartType();

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

  addDepart(mainTreeForm.value).then(() => {
    getMainTree();
    dialogVisibleDepart.value = false;
  });
}
function onEdit(node, data) {
  departAction.value = "update";
  dialogVisibleDepart.value = true;
  getDepart(data.id).then((response) => {
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
    deleteDepart(data.id).then(() => {
      MessageSuccess("删除成功");
      getMainTree();
    });
  });
}
function handleConfirmDepart() {
  if (departAction.value === "create") {
    addDepart(mainTreeForm.value).then(() => {
      getMainTree();
      dialogVisibleDepart.value = false;
    });
  }
  if (departAction.value === "update") {
    updateDepart(currentTreeNode.value.id, mainTreeForm.value).then(() => {
      getMainTree();
      dialogVisibleDepart.value = false;
    });
  }
}

const tableData = ref([]);
const dialogVisible = ref(false);
const name = ref("");

function handleSearch() {
  getUsersByDepart(currentTreeNode.value.id, name.value).then((res) => {
    tableData.value = res.data.rows;
  });
}
function handleAdd() {
  if (!currentTreeNode.value.id) {
    MessageError("请先选择部门!!");
    return;
  }
  dialogVisible.value = true;
  getListUser();
}

function handleDelete(row) {
  MessageConfirm("此操作将永久删除, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    const params = { departId: currentTreeNode.value.id, userId: row.id };
    deleteUsersDepart(params).then(() => {
      MessageSuccess("删除成功");
      handleSearch();
    });
  });
}

const formInline = reactive({
  page: 1,
  limit: 10,
  name: "",
  departmentKey: "",
});
const total = ref(0);

const tableDataUser = ref([]);

function getListUser() {
  getUsers(formInline).then((res) => {
    tableDataUser.value = res.data.rows.map((item) => {
      item.departmentInfo = JSON.parse(item.departId);
      item.departName = item.departmentInfo.name;
      item.departId = item.departmentInfo.id;
      return item;
    });
    total.value = res.data.total;
  });
}

const multipleSelection = ref([]);

function handleSelectionChange(val) {
  multipleSelection.value = val;
}

function handleAddUser() {
  const params = {
    departId: currentTreeNode.value.id,
    userIds: multipleSelection.value
      .map((item) => item.id)
      .filter((id) => {
        // 只保留当前部门下面不存在的id
        return tableData.value.findIndex((item) => item.id === id) === -1;
      })
      .join(","),
  };
  addUsersDepart(params).then(() => {
    MessageSuccess("保存成功");
    dialogVisible.value = false;
    handleSearch();
  });
}
</script>

<template>
  <div class="depart-container">
    <div class="depart-left">
      <el-card class="box-card">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <span>组织架构</span>
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
            <span class="align-middle">用户管理</span>
          </div>
        </template>
        <div class="user-container">
          <el-input
            @keyup.enter="handleSearch"
            v-model="name"
            clearable
            style="width: 200px"
            placeholder="账户"
          ></el-input>
          <el-button
            class="ms-2"
            @click="handleSearch"
            size="medium"
            type="primary"
          >
            搜索
          </el-button>
          <el-button @click="handleAdd" size="medium" type="primary">
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
                  @click="handleDelete(row)"
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
        <el-button
          class="ms-3"
          @click="getListUser"
          size="medium"
          type="primary"
        >
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
          <el-button type="primary" @click="handleAddUser">添加</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="部门"
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
            <el-input
              v-model="mainTreeForm.code"
              placeholder="请输入编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门名" prop="name">
            <el-input
              v-model="mainTreeForm.name"
              placeholder="请输入部门名"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门类型">
            <el-select
              v-model="mainTreeForm.type"
              class="filter-item"
              placeholder="请选择部门类型"
            >
              <el-option
                v-for="item in departTypeOptions"
                :key="item.id"
                :label="item.labelDefault"
                :value="item.value"
              ></el-option>
            </el-select>
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
