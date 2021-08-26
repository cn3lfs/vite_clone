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
import "./assets/style.scss";
// 注册 icons
import ElSvg from "./plugin/ElSvg";

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(ElSvg);

app.use(router);
app.use(store);
app.mount("#app");
