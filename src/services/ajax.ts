import axios from "axios";
import { message } from 'antd'

export type ResType = {
  errno: number;
  data?: ResDataType;
  msg?: string;
};

export type ResDataType = {
  [key: string]: any;
};

const instance = axios.create({
  timeout: 10 * 1000,
});

instance.interceptors.response.use((res) => {
  const resData = (res.data || {}) as ResType;
  const { errno, data, msg } = resData;
  if (errno !== 0) {
    // 错误提示
    if (msg) {
        message.error(msg)
    }
    throw new Error(msg)
  }

  return data as any;
});

export default instance;
