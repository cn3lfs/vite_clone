import axios from "axios";

const instance = axios.create({
  baseURL: "https://192.168.100.221/",
  timeout: 10000,
});

const AUTH_TOKEN = "Basic dnVlOnZ1ZQ==";

// Alter defaults after instance has been created
instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (localStorage.getItem("Authorization")) {
      config.headers["Authorization"] =
        "Bearer " + localStorage.getItem("Authorization");
    }
    if (localStorage.getItem("tenantCode")) {
      config.headers["tenantCode"] = localStorage.getItem("tenantCode");
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default instance;
