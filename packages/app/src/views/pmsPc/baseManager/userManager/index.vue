<script setup lang="ts">
import { ref, reactive } from "vue";
import DepartSelector from "./DepartSelector.vue";
import { formatDate } from "@/utils";
import { getLodop } from "@/utils/print/LodopFuncs";
import { printSetUp } from "@/utils/print/user";

import {
  getUsers,
  addUsers,
  updateUsers,
  deleteUsers,
  editPassword,
  bindingCard,
} from "@/api/user";
import { ElMessage, ElMessageBox } from "element-plus";

const formInline = reactive({
  page: 1,
  limit: 10,
  name: "",
  departmentKey: "",
});

const tableData = ref([]);
const total = ref(0);

function handleSearch() {
  getUsers(formInline).then((res) => {
    tableData.value = res.data.rows.map((item) => {
      item.departmentInfo = JSON.parse(item.departId);
      item.departName = item.departmentInfo.name;
      item.departId = item.departmentInfo.id;
      return item;
    });
    total.value = res.data.total;
  });
}

const cardFlag = ref(false);
const cardData = reactive({
  id: "",
  card: "",
});

function openCard(row) {
  cardFlag.value = true;
  cardData.id = row.id;
  cardData.card = row.card;
}
function okCard() {
  bindingCard(cardData).then(() => {
    cardFlag.value = false;
    ElMessage.success("绑卡成功!!");
    handleSearch();
  });
}
function print(row) {
  const LODOP = getLodop();
  printSetUp(LODOP, row, row.departName);
  LODOP.PRINT();
}

const dialogVisible = ref(false);
const aForm = {
  id: "",
  username: "",
  name: "",
  password: "",
  departName: "",
  sex: "",
  birthday: "",
  address: "",
  mobilePhone: "",
  email: "",
  description: "",
  departId: "",
};
const form = ref({
  ...aForm,
});
const formRef = ref(null);
const rules = {
  name: [
    {
      required: true,
      message: "请输入用户",
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message: "长度在 2 到 20 个字符",
      trigger: "blur",
    },
  ],
  username: [
    {
      required: true,
      message: "请输入账户",
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message: "长度在 2 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      max: 20,
      message: "长度在 6 到 20 个字符",
      trigger: "blur",
    },
  ],
  departName: [
    {
      required: true,
      message: "请选择部门",
      trigger: "blur",
    },
  ],
};
const action = ref("create");

function handleAdd() {
  dialogVisible.value = true;
  action.value = "create";
  form.value = { ...aForm };
}
function handleUpdate(row) {
  dialogVisible.value = true;
  action.value = "update";
  form.value = row;
}
function handleDelete(row) {
  ElMessageBox.confirm("此操作将永久删除, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteUsers(row.id).then(() => {
        handleSearch();
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function handleConfirm() {
  formRef.value.validate((valid) => {
    if (valid) {
      if (action.value === "create") {
        addUsers(form.value).then(() => {
          handleSearch();
          dialogVisible.value = false;
        });
      }
      if (action.value === "update") {
        updateUsers(form.value.id, form.value).then(() => {
          handleSearch();
          dialogVisible.value = false;
        });
      }
    } else {
      return;
    }
  });
}
const formatSex = (sex: number) => {
  if (sex === 0) return "男";
  if (sex === 1) return "女";
  return "";
};

const DepartSelectorRef = ref(null);
// flag: 1 搜索中的部门
// flag: 2 弹窗中的部门
const flag = ref(1);

function handleDepartSelect(data) {
  if (flag.value === 1) {
    formInline.departmentKey = data.id;
    formInline.departName = data.label;
    handleSearch();
  } else if (flag.value === 2) {
    form.value.departId = data.id;
    form.value.departName = data.label;
  }
}

function showDepartSelect(num) {
  flag.value = num;
  DepartSelectorRef.value.handleShow();
}

function handleClear() {
  formInline.name = "";
  formInline.departmentKey = "";
  formInline.departName = "";

  handleSearch();
}

const dialogFormVisiblePass = ref(false);

function handleUpdatePass(row) {
  form.value = row;
  dialogFormVisiblePass.value = true;
}
function updatePassword() {
  if (form.value.newPassword1 !== form.value.newPassword2) {
    ElMessage.error("两次密码不一致");
    return;
  }
  if (form.value.newPassword1 && form.value.newPassword1.length < 6) {
    ElMessage.error("密码不得少于6位");
    return;
  }
  if (form.value.newPassword1) {
    form.value.password = form.value.newPassword1;
    editPassword(form.value).then(() => {
      dialogFormVisiblePass.value = false;
      handleSearch();
      ElMessage.success("修改密码成功");
    });
  }
}

handleSearch();
</script>

<template>
  <div>
    <div class="search-header">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        size="medium"
      >
        <el-form-item label="姓名/账户:">
          <el-input v-model="formInline.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门:">
          <el-input v-model="formInline.departName" readonly>
            <template #append>
              <el-button
                icon="el-icon-search"
                @click="showDepartSelect(1)"
              ></el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="handleClear">清空</el-button>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table class="mt-2" :data="tableData" border highlight-current-row>
      <el-table-column
        align="center"
        label="姓名"
        prop="name"
        width="150"
      ></el-table-column>
      <el-table-column
        align="center"
        label="账户"
        prop="username"
        width="150"
      ></el-table-column>
      <el-table-column
        align="center"
        label="性别"
        prop="sex"
        width="70"
      ></el-table-column>
      <el-table-column align="center" label="身份" width="110">
        <template v-slot:default="scope">
          <el-tag
            :type="scope.row.isSuperAdmin === '0' ? 'primary' : 'warning'"
            close-transition
          >
            <span v-if="scope.row.isSuperAdmin === '0'">普通身份</span>
            <span v-else-if="scope.row.isSuperAdmin === '1'">超级管理员</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="部门"
        prop="departName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="电话"
        prop="mobilePhone"
      ></el-table-column>
      <el-table-column
        align="center"
        label="卡号"
        prop="card"
      ></el-table-column>
      <el-table-column
        align="center"
        label="编辑人"
        prop="editor"
      ></el-table-column>
      <el-table-column align="center" label="编辑时间" width="120">
        <template v-slot:default="scope">
          <span>{{ formatDate(scope.row.editTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="350px">
        <template v-slot:default="{ row, $index }">
          <el-button size="small" type="primary" @click="openCard(row)">
            绑卡
          </el-button>
          <el-button size="small" type="primary" @click="print(row.id, $index)">
            打印
          </el-button>
          <el-button @click="handleUpdatePass(row)" size="small" type="primary">
            密码
          </el-button>
          <el-button @click="handleUpdate(row)" size="small" type="success">
            编辑
          </el-button>
          <el-button @click="handleDelete(row)" size="small" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:currentPage="formInline.page"
      v-model:pageSize="formInline.limit"
      @pagination="handleSearch"
    />

    <el-dialog
      title="用户"
      v-model="dialogVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="账户" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账户"
            :disabled="action === 'update'"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入姓名"
            :disabled="action === 'update'"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="action === 'create'"
          label="密码"
          placeholder="请输入密码"
          prop="password"
        >
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <div class="row row-cols-2">
          <div class="col">
            <el-form-item
              label="部门"
              placeholder="请选择部门"
              prop="departName"
            >
              <el-input v-model="form.departName" readonly type="text">
                <template #append>
                  <el-button
                    icon="el-icon-search"
                    @click="showDepartSelect(2)"
                  ></el-button>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="性别">
              <el-select v-model="form.sex" class="w-100">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="生日">
              <el-input v-model="form.birthday"></el-input>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="地址">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="电话">
              <el-input v-model="form.mobilePhone"></el-input>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item label="邮箱">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="描述">
          <el-input
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model="form.description"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="修改密码"
      v-model="dialogFormVisiblePass"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="新的密码" placeholder="请输入密码">
          <el-input v-model="form.newPassword1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" placeholder="请再输入一遍密码">
          <el-input v-model="form.newPassword2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisiblePass = false">取 消</el-button>
        <el-button @click="updatePassword" type="primary">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="绑卡" v-model="cardFlag" width="500px">
      <div class="d-flex align-items-center">
        <label style="width: 100px">卡号：</label>
        <el-input v-model="cardData.card"></el-input>
      </div>
      <template #footer>
        <el-button @click="cardFlag = false">取 消</el-button>
        <el-button type="primary" @click="okCard">确 定</el-button>
      </template>
    </el-dialog>

    <DepartSelector
      ref="DepartSelectorRef"
      @depart-select="handleDepartSelect"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-header .el-form-item {
  margin-bottom: 0;
}
</style>
