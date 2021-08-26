<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import VMenuItem from "./VMenuItem.vue";
import { getMenus } from "../api/user";
function handleOpen(key, keyPath) {
  console.log(key);
}
function handleClose(key, keyPath) {
  console.log(key);
}

const route = useRoute();

const menuList = ref([]);
const defaultActive = computed(() => {
  return import.meta.env.BASE_URL + "#" + route.path;
});

const isCollapse = ref(false);

getMenus().then((res) => {
  menuList.value = res;
});
</script>
<template>
  <div class="md-v-menu">
    <el-scrollbar>
      <el-menu
        :collapse="isCollapse"
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <VMenuItem v-for="menu in menuList" :key="menu.id" :menu="menu" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss">
.md-v-menu {
  width: 100%;
  height: 100%;
  background: #304156;
}
</style>
