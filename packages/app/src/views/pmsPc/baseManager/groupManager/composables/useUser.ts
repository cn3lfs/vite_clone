import { ref, reactive, watchEffect, Ref } from "vue";
import {
  // 角色下用户
  getMembers,
  addMember,
  delMember,
} from "@/api/group";
import { getUsers } from "@/api/user";
import { MessageConfirm, MessageSuccess, MessageError } from "@/utils/index";
import { Emitter } from "mitt";

export function useUser(emitter: Emitter<any>, props) {
  const dialogVisible = ref(false);
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

  const multipleSelection: Ref<any[]> = ref([]);

  function handleSelectionChange(val) {
    multipleSelection.value = val;
  }

  function handleConfirmUser() {
    const params = {
      groupId: props.getCurrentTreeNode().id,
      userIds: multipleSelection.value
        .map((item) => item.id)
        .filter((id) => {
          // 只保留当前部门下面不存在的id
          return props.tableData.findIndex((item) => item.id === id) === -1;
        })
        .join(","),
    };
    addMember(params).then(() => {
      MessageSuccess("保存成功");
      dialogVisible.value = false;
      props.handleSearch();
    });
  }

  function showDialog() {
    dialogVisible.value = true;
    getListUser();
  }

  emitter.on("user:showDialog", showDialog);

  return {
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
  };
}
