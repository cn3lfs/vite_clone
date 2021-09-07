import { request } from "../utils/request";

export function getGroupTree() {
  return request({
    url: "/basic/admin/null/group/tree",
    method: "get",
  });
}

export function addGroup(obj) {
  return request({
    url: "/basic/admin/null/group",
    method: "post",
    data: obj,
  });
}

export function getGroup(id) {
  return request({
    url: "/basic/admin/null/group/" + id,
    method: "get",
  });
}

export function putGroup(id, obj) {
  return request({
    url: "/basic/admin/null/group/" + id,
    method: "put",
    data: obj,
  });
}

export function delGroup(id) {
  return request({
    url: "/basic/admin/null/group/" + id,
    method: "delete",
  });
}

export function getMembers(groupId, name) {
  return request({
    url: "/basic/admin/null/group/member",
    method: "get",
    params: {
      groupId,
      name,
    },
  });
}

export function addMember(data) {
  return request({
    url: "/basic/admin/null/group/member",
    method: "post",
    params: data,
  });
}

export function delMember(data) {
  return request({
    url: "/basic/admin/null/group/member",
    method: "delete",
    params: data,
  });
}
