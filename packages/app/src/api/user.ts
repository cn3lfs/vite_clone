import { request } from "@/util/umiRequest";

export const login = (params) => {
  return request("/basic/oauth/token", {
    method: "post",
    params,
  });
};
