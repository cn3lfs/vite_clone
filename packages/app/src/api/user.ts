import { request } from "@/utils/request";

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

export const getUsers = (params) => {
  return request({
    url: "/basic/admin/null/user/page",
    method: "get",
    params,
  });
};
export const addUsers = (data) => {
  return request({
    url: `/basic/admin/null/user`,
    method: "post",
    data,
  });
};
export const updateUsers = (id: string, data) => {
  return request({
    url: `/basic/admin/null/user/${id}`,
    method: "put",
    data,
  });
};
export const editPassword = (data) => {
  return request({
    url: `/basic/admin/null/user/editPassword`,
    method: "post",
    data,
  });
};
export const deleteUsers = (id: string) => {
  return request({
    url: `/basic/admin/null/user/${id}`,
    method: "delete",
  });
};

export function getDeparts() {
  return request({
    url: "/basic/admin/null/depart/tree",
    method: "get",
  });
}

export function bindingCard(data) {
  return request({
    url: "/basic/admin/null/user/editCard",
    method: "post",
    data,
  });
}
