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

  .md-v-left {
    width: 210px;
    height: 100vh;
    flex-shrink: 0;
  }

  .md-v-right {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
