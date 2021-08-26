<script setup lang="ts">
import { ref } from "vue";
interface MenuItem {
  id: number;
  parentId: number;
  actPeriod: number;
  title: string;
  path: string;
  children: Array;
}
const props = defineProps<{
  menu: MenuItem;
}>();

const iconSize = ref(20);

// 是否包含子菜单
function canRecurse(menu: MenuItem) {
  return Array.isArray(menu.children) && menu.children.length > 0;
}
</script>
<template>
  <el-sub-menu
    v-if="canRecurse(menu)"
    :index="menu.path"
    :show-timeout="0"
    :hide-timeout="0"
    popper-append-to-body
  >
    <template #title>
      <el-icon v-if="menu.parentId === -1" class="menu-icon" :size="iconSize">
        <ElSvgMenu />
      </el-icon>
      <el-icon v-else class="menu-icon" :size="iconSize">
        <ElSvgFolder />
      </el-icon>

      <span>{{ menu.title }}</span>
    </template>
    <VMenuItem
      v-for="subMenu in menu.children"
      :menu="subMenu"
      :key="subMenu.id"
    />
  </el-sub-menu>
  <a v-else :href="menu.path">
    <el-menu-item :index="menu.path">
      <el-icon class="menu-icon" :size="iconSize">
        <ElSvgHouse v-if="menu.path.includes('dashboard')" />
        <ElSvgDocument v-else />
      </el-icon>
      <template #title>{{ menu.title }}</template>
    </el-menu-item>
  </a>
</template>

<style lang="scss">
.menu-icon {
  margin-right: 8px;
}
</style>
