<script setup lang="ts">
const props = defineProps({
  showPagination: {
    type: Boolean,
    default: true,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50, 100],
  },
  pagination: {
    type: Object,
    default: () => {
      return {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      };
    },
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits<{
  (e: "pagination", data: any): void;
  (e: "update:currentPage", data: number): void;
  (e: "update:pageSize", data: number): void;
}>();

const handleSizeChange = (val: number) => {
  emit("update:pageSize", val);
  const pagination = {
    pageSize: props.pageSize,
    currentPage: props.currentPage,
    total: props.total,
  };
  emit("pagination", pagination);
};
const handleCurrentChange = (val: number) => {
  emit("update:currentPage", val);
  const pagination = {
    pageSize: props.pageSize,
    currentPage: props.currentPage,
    total: props.total,
  };
  emit("pagination", pagination);
};
</script>

<template>
  <div class="pagination-container">
    <el-pagination
      v-if="showPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="custom-pagination"
    ></el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.pagination-container {
  padding: 10px;
}

.pagination-container.hidden {
  display: none;
}
</style>
