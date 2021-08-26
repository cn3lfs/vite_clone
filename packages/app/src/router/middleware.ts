import { Router } from "vue-router";

export function addMiddleWare(router: Router) {
  const isAuthenticated = localStorage.getItem("Authorization") !== null;
  router.beforeEach((to, from, next) => {
    if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
    else next();
  });

  router.afterEach((to, from, failure) => {
    if (!failure) sendToAnalytics(to.fullPath);
  });
}

function sendToAnalytics(path: string) {
  //
}
