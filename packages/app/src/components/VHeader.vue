<script setup>
import { computed } from "vue";

const userName = computed(() => localStorage.getItem("userName"));
</script>

<template>
  <div class="md-v-header">
    <span class="v-header-title">{{ $route.meta && $route.meta.title }}</span>

    <div class="v-header-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link :to="{ path: '/home' }">首页</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link :to="{ path: '/login' }">退出登录</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.md-v-header {
  height: 60px;
  text-align: center;
  background: #57c7d4;
  position: relative;

  .v-header-title {
    color: #fff;
    line-height: 60px;
    font-size: 22px;
  }

  .v-header-right {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 60px;
    .el-dropdown-link {
      color: #fff;
      font-size: 22px;
    }
  }
}
</style>
