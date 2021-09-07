import { ref, reactive, watchEffect, Ref } from "vue";
import {
  // 角色下用户
  getMembers,
  addMember,
  delMember,
} from "@/api/group";
import { MessageConfirm, MessageSuccess, MessageError } from "@/utils/index";
import { Emitter } from "mitt";

export function useMember(emitter: Emitter<any>, props) {
  const name = ref("");
  const tableData: Ref<any[]> = ref([]);
  function getCurrentTreeNode() {
    return props.currentTreeNode;
  }

  function handleSearch() {
    getMembers(getCurrentTreeNode().id, name.value).then((res) => {
      tableData.value = res.data.rows;
    });
  }

  function handleAddDict() {
    if (!getCurrentTreeNode().id) {
      MessageError("请先选择部门!!");
      return;
    }
    // 依赖于useUser的dialogVisible和getListUser
    emitter.emit("user:showDialog");
    handleSearch();
  }

  function handleDeleteDict(row) {
    MessageConfirm("此操作将永久删除, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      const params = {
        groupId: getCurrentTreeNode().id,
        userId: row.id,
      };
      delMember(params).then(() => {
        MessageSuccess("删除成功");
        handleSearch();
      });
    });
  }

  emitter.on("member:handleSearch", () => {
    name.value = "";
    handleSearch();
  });

  return {
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
  };
}
