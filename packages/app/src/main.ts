import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 配置 element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./assets/style.scss";
// 注册 icons
import ElSvg from "./plugin/ElSvg";
// 配置mitt
import mitt from "mitt";
const emitter = mitt();

const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(ElSvg);

app.use(router);
app.use(store);
app.mount("#app");
