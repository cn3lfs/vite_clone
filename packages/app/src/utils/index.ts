import moment from "dayjs";

export const formatDate = (value: string | number | null | Date): string => {
  if (!value) return "";
  return moment(value).format("YYYY-MM-DD");
};

export const formatDateTime = (value: any): string => {
  //处理时间戳     返回实例   2019-11-29 15:46:09
  if (!value) return "";
  return moment(value).format("YYYY-MM-DD HH:mm:ss");
};

export * from "./element";
