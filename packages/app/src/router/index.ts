import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import VNotFound from "../components/VNotFound.vue";
import { addMiddleWare } from "./middleware";

// 不使用 VLayout 布局
const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
];

// 使用 VLayout 布局
const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    alias: "/home",
    component: Home,
    meta: {
      title: "主页",
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      title: "关于",
    },
  },
  // will match everything and put it under `$route.params.pathMatch`
  { path: "/:pathMatch(.*)*", name: "NotFound", component: VNotFound },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes.concat(asyncRoutes),
});

addMiddleWare(router);

export default router;
