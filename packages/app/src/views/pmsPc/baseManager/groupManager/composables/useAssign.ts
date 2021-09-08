import { ref, reactive, watchEffect, Ref, nextTick } from "vue";
import { MessageConfirm, MessageSuccess, MessageError } from "@/utils/index";

import {
  fetchAuthorizeTree,
  modifyMenuAuthority,
  getMenuAuthority,
} from "@/api/assign";
import { getDictByCode } from "@/api/dict";
import { Emitter } from "mitt";

export function useAssign(emitter: Emitter<any>, props) {
  // 菜单下的系统
  const system = ref("");
  const systemOptions: Ref<any[]> = ref([]);
  function getSystemOptions() {
    getDictByCode("authority_menu").then((response) => {
      systemOptions.value = response.data.rows;
    });
  }

  const mainTreeRef: Ref<any> = ref(null);
  const defaultProps = {
    children: "children",
    label: "title",
  };

  const mainTreeData: Ref<any[]> = ref([]);
  function getMainTree() {
    fetchAuthorizeTree(system.value).then((data) => {
      mainTreeData.value = data;
      initAuthoritys();
    });
  }
  function initAuthoritys() {
    getMenuAuthority({
      id: props.currentTreeNode.id,
      system: system.value,
    }).then((res) => {
      const result = res.data.map((item) => item.id);
      mainTreeRef.value.setCheckedKeys(result);
    });
  }

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
  }

  const dialogVisible = ref(false);

  function getAllChildrenIds(ids, data) {
    if (data.children) {
      for (let i = 0; i < data.children.length; i++) {
        ids.push(data.children[i].id);
        const child = data.children[i];
        getAllChildrenIds(ids, child);
      }
    } else {
      return;
    }
  }

  function selectChildren(data) {
    const nodes = mainTreeRef.value.getCheckedNodes();
    const ids: any[] = [];
    ids.push(data.id);
    for (let i = 0; i < nodes.length; i++) {
      ids.push(nodes[i].id);
    }
    getAllChildrenIds(ids, data);
    mainTreeRef.value.setCheckedKeys(ids);
  }
  function unSelectChildren(data) {
    const ids: any[] = [];
    ids.push(data.id);
    getAllChildrenIds(ids, data);
    for (let i = 0; i < ids.length; i++) {
      mainTreeRef.value.setChecked(ids[i], false);
    }
  }

  function handleConfirmAssign() {
    dialogVisible.value = false;
    const nodes = mainTreeRef.value.getCheckedNodes();
    const ids: any[] = [];
    for (let i = 0; i < nodes.length; i++) {
      ids.push(nodes[i].id);
    }
    modifyMenuAuthority(props.currentTreeNode.id, {
      menuTrees: ids.join(),
      system: system.value,
    }).then(() => {
      MessageSuccess("菜单权限保存成功");
    });
  }

  function showDialog() {
    dialogVisible.value = true;
    getMainTree();
    getSystemOptions();
  }

  emitter.on("assign:showDialog", showDialog);

  return {
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
  };
}
