import VPagination from "../components/VPagination.vue";
export default {
  install: (app, options) => {
    // Plugin code goes here
    app.component("Pagination", VPagination);
  },
};
