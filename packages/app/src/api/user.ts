import { request } from "@/util/umiRequest";

export const login = (params) => {
  return request({
    url: "/basic/oauth/token",
    method: "post",
    params,
  });
};

export const getCurrentUserInfo = () => {
  return request({
    url: "/basic/admin/madest/user/front/info",
    method: "get",
  });
};

export const getMenus = () => {
  return request({
    url: "/basic/admin/menu/getMyTree",
    method: "get",
  });
};
