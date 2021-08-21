<script>
import { concatArray } from "common";
export default {
  setup() {
    return {
      array: concatArray(),
    };
  },
};
</script>
<template>
  <h1>{{ array }}</h1>
</template>
