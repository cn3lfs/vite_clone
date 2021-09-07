import { request } from "../utils/request";

export function getDicts(typeId: string) {
  return request({
    url: "/basic/dict/dictValue/page",
    method: "get",
    params: {
      typeId,
    },
  });
}

export function getDictByCode(code) {
  return request({
    url: "/basic/dict/dictValue/type/" + code,
    method: "get",
  });
}
export function addDictValue(obj) {
  return request({
    url: "/basic/dict/dictValue",
    method: "post",
    data: obj,
  });
}

export function getDictValue(id) {
  return request({
    url: "/basic/dict/dictValue/" + id,
    method: "get",
  });
}

export function putDictValue(id, obj) {
  return request({
    url: "/basic/dict/dictValue/" + id,
    method: "put",
    data: obj,
  });
}

export function delDictValue(id) {
  return request({
    url: "/basic/dict/dictValue/" + id,
    method: "delete",
  });
}

export function getDictTree() {
  return request({
    url: "/basic/dict/dictType/tree",
    method: "get",
  });
}

export function addDictType(obj) {
  return request({
    url: "/basic/dict/dictType",
    method: "post",
    data: obj,
  });
}

export function getDictType(id) {
  return request({
    url: "/basic/dict/dictType/" + id,
    method: "get",
  });
}

export function delDictType(id) {
  return request({
    url: "/basic/dict/dictType/" + id,
    method: "delete",
  });
}

export function putDictType(id, obj) {
  return request({
    url: "/basic/dict/dictType/" + id,
    method: "put",
    data: obj,
  });
}
