import { baseURL, cookieName } from "./config";

import axios from "axios";
import cookie from "cookiejs";

// 브라우저 환경인지 체크
const isBrowser = typeof window !== 'undefined';

export const instanceRoot = axios.create({
  baseURL,
  headers: {
    // Authorization: isBrowser ? `bearer ${cookie.get(cookieName)}` : '',
  },
});

instanceRoot.interceptors.request.use(
  (config) => {
    // console.log(
    //   `%c${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    //   "color: pink"
    // );
    
    config.headers["Authorization"] = isBrowser ? `bearer ${cookie.get(cookieName)}` : '';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const instance = axios.create({
  baseURL,
  headers: {
    // Authorization: isBrowser ? `bearer ${cookie.get(cookieName)}` : '',
    'x-tenant-code': 'test2',
  },
});

instance.interceptors.request.use(
  (config) => {
    // console.log(
    //   `%c${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    //   "color: pink"
    // );
    
    config.headers["Authorization"] = isBrowser ? `bearer ${cookie.get(cookieName)}` : '';
    config.headers["x-tenant-code"] = 'test2';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
