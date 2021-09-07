<template>
  <div class="app-container">
    <div>
      <el-select
        v-model="systemSelected"
        @change="getList"
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

      <el-button type="primary" size="medium" @click="getList" class="ml-3">
        搜索
      </el-button>
      <el-button type="primary" size="medium" @click="handleCreateAction">
        新增
      </el-button>
    </div>

    <el-table
      ref="dragTable"
      :data="tableList"
      row-key="id"
      border
      :default-expand-all="false"
      class="mt-3"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column prop="title" label="菜单名称" header-align="center">
        <template v-slot:default="{ row }">
          <i :class="row.icon"></i>
          {{ row.title }}
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="菜单KEY"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="path"
        label="菜单路径"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="actPeriod"
        label="阶段编号"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="detailKey"
        label="详情页KEY"
        header-align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="detailPath"
        label="详情页路径"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="detailPath"
        label="状态设置"
        align="center"
        width="140"
      >
        <template v-slot:default="{ row }">
          <el-switch
            v-model="row.status"
            @change="commitChange(row)"
            :active-value="0"
            :inactive-value="-1"
            inactive-text=""
            active-text="开启"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="actions" label="操作" width="250px" align="center">
        <template v-slot:default="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleInsertAction(row)"
          >
            插入
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdateAction(row)"
          >
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="formTitle"
      v-model="modalVisible"
      top="50px"
      :close-on-click-modal="false"
    >
      <el-form :model="formModel" label-width="120px">
        <el-form-item label="菜单类型">
          <el-select v-model="formModel.type" placeholder="选择系统">
            <el-option
              v-for="item in systemOptions"
              :key="item.id"
              :label="item.labelDefault"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单KEY">
          <el-input v-model.trim="formModel.code"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model.trim="formModel.path"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序">
          <el-input v-model="formModel.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="菜单父ID">
          <el-input
            v-model="formModel.parentId"
            placeholder="root节点为-1"
          ></el-input>
        </el-form-item>
        <el-form-item label="阶段编号">
          <el-input v-model="formModel.actPeriod"></el-input>
        </el-form-item>
        <el-form-item label="详情页KEY">
          <el-input v-model="formModel.detailKey"></el-input>
        </el-form-item>
        <el-form-item label="详情页路径">
          <el-input v-model="formModel.detailPath"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formModel.status"
            :active-value="0"
            :inactive-value="-1"
            inactive-text=""
            active-text="开启"
          ></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  fetchTree as getMenuList,
  addObj as addMenu,
  delObj as deleteMenu,
  putObj as updateMenu,
  getMyTree,
} from "@/api/menu";
import { getDictByCode } from "@/api/dict";

interface Menu {}

const formInit = {
  id: null,
  parentId: null,
  /** 菜单名称 */
  title: "",

  /** 菜单KEY */
  code: "",

  /** 菜单路径 */
  path: "",

  /** 菜单所属系统 */
  type: "",

  status: 0,

  actPeriod: 0,
  detailKey: "",
  detailPath: "",
};
export default defineComponent({
  name: "MenuManage",
  data() {
    return {
      tableList: [] as Menu[],
      search: "",
      formTitle: "菜单",
      formModel: {} as Menu,
      formAction: "create",
      modalVisible: false,
      systemSelected: "",
      systemOptions: [], // 来自数据字典
    };
  },
  created() {
    // 从数据字典获取所有的系统选项
    getDictByCode("authority_menu").then((res: any) => {
      this.systemOptions = res.data.rows;
    });
    this.getList();
  },
  methods: {
    getList() {
      const params = {
        system: this.systemSelected,
      };
      getMenuList(params).then((res: any) => {
        res.forEach((el: any) => {
          el.icon = "el-icon-folder-opened";
          if (el.children) {
            el.children.forEach((ele: any) => {
              ele.icon = "el-icon-s-unfold";
            });
          }
        });
        this.tableList = res;
      });
    },
    handleCreateAction() {
      this.formModel = { ...formInit };
      this.formModel.type = this.systemSelected;
      this.formTitle = "新增菜单";
      this.formAction = "create";
      this.modalVisible = true;
    },
    handleInsertAction(row: Menu) {
      this.formModel = { ...formInit };
      this.formModel.parentId = row.id;
      this.formModel.type = row.type;
      this.formModel.path = row.path;
      this.formTitle = "新增菜单";
      this.formAction = "create";
      this.modalVisible = true;
    },
    handleUpdateAction(row: Menu) {
      this.formModel = { ...row };
      this.formTitle = "修改菜单";
      this.formAction = "update";
      this.modalVisible = true;
    },
    handleCreate() {
      addMenu(this.formModel).then(() => {
        this.getList();
        this.modalVisible = false;
      });
    },
    handleUpdate() {
      updateMenu(this.formModel.id, this.formModel).then(() => {
        this.getList();
        this.modalVisible = false;
      });
    },
    commitChange(row: any) {
      updateMenu(row.id, row).then(() => {
        this.getList();
        this.$message.success("修改成功");
        this.modalVisible = false;
      });
    },
    handleDelete(row: Menu) {
      deleteMenu(row.id as string).then(() => {
        this.getList();
      });
    },
    handleOk() {
      if (this.formAction === "create") {
        this.handleCreate();
      } else {
        this.handleUpdate();
      }
    },
  },
});
</script>

<style lang="scss">
.sortable-ghost {
  opacity: 0.5;
  background: black;
}
</style>
