import * as icons from "@element-plus/icons";

// 注册element plus的 svg icons, 每个icon都必须加上 ElSvg
// 例如 Edit icon, 则为 ElSvgEdit
export default {
  install: (app, options) => {
    // Plugin code goes here
    Object.keys(icons).forEach((key) => {
      app.component("ElSvg" + key, icons[key]);
    });
  },
};
