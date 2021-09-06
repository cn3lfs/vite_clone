<script setup lang="ts">
import VMenu from "./VMenu.vue";
import VHeader from "./VHeader.vue";
import VMain from "./VMain.vue";
</script>

<template>
  <div class="md-v-container">
    <div class="md-v-left">
      <VMenu />
    </div>
    <div class="md-v-right">
      <VHeader />
      <VMain>
        <router-view></router-view>
      </VMain>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.md-v-container {
  display: flex;
  height: 100vh;

  .md-v-left {
    width: 210px;
    height: 100%;
    flex: 0 0 210px;
  }

  .md-v-right {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
  }
}
</style>
