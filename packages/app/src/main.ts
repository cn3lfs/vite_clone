import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 配置 element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 配置 bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});

app.use(router);
app.use(store);
app.mount("#app");
