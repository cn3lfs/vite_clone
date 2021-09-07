import request from "../utils/request";

export function getMyTree() {
  return request({
    url: `/basic/admin/menu/getMyTree`,
    method: "get",
  });
}

export function fetchTree(params) {
  return request({
    url: `/basic/admin/menu/tree`,
    method: "get",
    params,
  });
}

export function fetchAll() {
  return request({
    url: "/basic/admin/menu/all",
    method: "get",
  });
}
export function addObj(obj) {
  return request({
    url: "/basic/admin/menu",
    method: "post",
    data: obj,
  });
}

export function getObj(id) {
  return request({
    url: "/basic/admin/menu/" + id,
    method: "get",
  });
}

export function delObj(id) {
  return request({
    url: "/basic/admin/menu/" + id,
    method: "delete",
  });
}

export function putObj(id, obj) {
  return request({
    url: "/basic/admin/menu/" + id,
    method: "put",
    data: obj,
  });
}
