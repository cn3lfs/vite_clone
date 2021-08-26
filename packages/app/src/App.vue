<script setup lang="ts">
import { watchEffect } from "vue";
import VLayout from "@/components/VLayout.vue";
import VLayoutEmpty from "@/components/VLayoutEmpty.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const EMPTY_LAYOUT_LIST = ["Login"];
function getLayout() {
  if (EMPTY_LAYOUT_LIST.includes(route.name)) {
    return VLayoutEmpty;
  } else {
    return VLayout;
  }
}

watchEffect(() => {});
</script>

<template>
  <component :is="getLayout()" />
</template>
