import { ref, reactive, watchEffect, Ref, nextTick } from "vue";
import {
  // 角色组
  getGroupTree,
  addGroup,
  getGroup,
  putGroup,
  delGroup,
} from "@/api/group";
import { MessageConfirm, MessageSuccess, MessageError } from "@/utils/index";
import { Emitter } from "mitt";

export function useGroup(emitter: Emitter<any>) {
  const mainTreeRef: Ref<any> = ref(null);
  const defaultProps = {
    children: "children",
    label: "label",
  };

  const mainTreeData: Ref<any[]> = ref([]);
  function getMainTree() {
    getGroupTree().then((data) => {
      mainTreeData.value = data;
    });
  }

  getMainTree();

  const filterText = ref("");
  function filterNode(value, data) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }
  watchEffect(() => {
    if (mainTreeRef.value) {
      mainTreeRef.value.filter(filterText.value);
    }
  });

  const currentTreeNode: Ref<any> = ref({});
  function getTreeNodeData(data) {
    currentTreeNode.value = data;
    // 等当前节点更新完毕再执行搜索
    nextTick(() => {
      // 依赖 useMember的name和handleSearch
      emitter.emit("member:handleSearch");
    });
  }

  const dialogVisibleDepart = ref(false);

  const mainTreeFormRef: Ref<any> = ref(null);
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

    addGroup(mainTreeForm.value).then(() => {
      getMainTree();
      dialogVisibleDepart.value = false;
    });
  }
  // 分配权限
  function onAssign(node, data) {
    emitter.emit("assign:showDialog");
  }
  function onEdit(node, data) {
    departAction.value = "update";
    dialogVisibleDepart.value = true;
    getGroup(data.id).then((response) => {
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
      delGroup(data.id).then(() => {
        MessageSuccess("删除成功");
        getMainTree();
      });
    });
  }
  function handleConfirmDepart() {
    if (departAction.value === "create") {
      addGroup(mainTreeForm.value).then(() => {
        getMainTree();
        dialogVisibleDepart.value = false;
      });
    }
    if (departAction.value === "update") {
      putGroup(currentTreeNode.value.id, mainTreeForm.value).then(() => {
        getMainTree();
        dialogVisibleDepart.value = false;
      });
    }
  }

  return {
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
    onAssign,
    onEdit,
    onAppend,
    onRemove,
    // 弹窗确认
    handleConfirmDepart,
  };
}
