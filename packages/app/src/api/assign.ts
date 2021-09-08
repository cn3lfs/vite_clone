import { request } from "../utils/request";

export function modifyMenuAuthority(id, data) {
  return request({
    url: "/basic/admin/null/group/" + id + "/authority/menu",
    method: "post",
    params: data,
  });
}

export function getMenuAuthority(params) {
  return request({
    url: "/basic/admin/null/group/authority/menu",
    method: "get",
    params,
  });
}

export function fetchAuthorizeTree(system: string) {
  return request({
    url: "/basic/admin/null/group/menu/authorize/list",
    method: "get",
    params: {
      system,
    },
  });
}
