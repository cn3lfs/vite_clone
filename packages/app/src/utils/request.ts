import { extend, RequestOptionsWithoutResponse } from "umi-request";
import router from "../router";
import { ElMessage } from "element-plus";
const AUTH_TOKEN = "Basic dnVlOnZ1ZQ==";

const errorHandler = function (error) {
  const codeMap = {
    "021": "An error has occurred",
    "022": "It’s a big mistake,",
    // ....
  };
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 400) {
      const data = error.response.data;
      const msg = data?.message || data?.notifyMessage;
      if (msg) {
        ElMessage.error(msg);
      }
    }
    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.setItem("Authorization", "");
      router.push({ path: "/login" });
    }
    if (error.response.status === 500) {
      ElMessage.error(error.data.message);
    }

    // console.log(error.response.status);
    // console.log(error.response.headers);
    // console.log(error.data);
    // console.log(error.request);
    // console.log(codeMap[error.data.status]);
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
    console.log(error.message);
  }

  throw error; // If throw. The error will continue to be thrown.

  // return {some: 'data'}; If return, return the value as a return. If you don't write it is equivalent to return undefined, you can judge whether the response has a value when processing the result.
  // return {some: 'data'};
};

export const umiRequest = extend({
  prefix: "http://192.168.100.221",
  timeout: 10000,
  errorHandler,
});

// Same as the last one
umiRequest.interceptors.request.use(
  (url, options) => {
    if (!options.headers) {
      options.headers = {};
    }

    // Do something before request is sent

    if (url.includes("/basic/oauth/token")) {
      // 登录接口
      options.headers["Authorization"] = AUTH_TOKEN;
    } else {
      if (localStorage.getItem("Authorization")) {
        options.headers["Authorization"] =
          "Bearer " + localStorage.getItem("Authorization");
      }
    }

    if (localStorage.getItem("tenantCode")) {
      options.headers["tenantCode"] = localStorage.getItem("tenantCode");
    }
    return {
      url,
      options: { ...options, interceptors: true },
    };
  },
  { global: true }
);

// handling error in response interceptor
umiRequest.interceptors.response.use(async (response) => {
  const codeMaps = {
    502: "网关错误。",
    503: "服务不可用，服务器暂时过载或维护。",
    504: "网关超时。",
  };
  if (response.status in codeMaps) {
    ElMessage.error(codeMaps[response.status]);
  } else if (response.status === 200) {
    const data = await response.clone().json();
    const msg = data?.message || data?.notifyMessage;
    if (msg) {
      if (data.code !== "0001") {
        ElMessage.success(msg);
      } else {
        ElMessage.error(msg);
      }
    }
  }
  return response;
});

// 兼容axios
export const request = (config): Promise<any> => {
  return umiRequest(config.url, config);
};

export default request;
