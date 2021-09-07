import { request } from "../utils/request";

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

export function getDepart(id) {
  return request({
    url: "/basic/admin/null/depart/" + id,
    method: "get",
  });
}

export function addDepart(data) {
  return request({
    url: "/basic/admin/null/depart",
    method: "post",
    data,
  });
}

export function updateDepart(id, data) {
  return request({
    url: "/basic/admin/null/depart/" + id,
    method: "put",
    data,
  });
}

export function deleteDepart(id) {
  return request({
    url: "/basic/admin/null/depart/" + id,
    method: "delete",
  });
}

export function getUsersByDepart(departId: string, name: string) {
  return request({
    url: "/basic/admin/null/depart/user",
    method: "get",
    params: {
      departId,
      name,
    },
  });
}

export function deleteUsersDepart(data) {
  return request({
    url: "/basic/admin/null/depart/user",
    method: "delete",
    params: data,
  });
}

export function addUsersDepart(data) {
  return request({
    url: "/basic/admin/null/depart/user",
    method: "post",
    params: data,
  });
}

export function bindingCard(data) {
  return request({
    url: "/basic/admin/null/user/editCard",
    method: "post",
    data,
  });
}
