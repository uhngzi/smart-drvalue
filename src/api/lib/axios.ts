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
    /**
     * @TODO 추후에 프로덕션 환경에서 해당 코드를 삭제하고, 각 사용자별 테넌트 코드를 가져오는 별도의 로직이 필요
     */
    'x-tenant-code': isBrowser ? `${cookie.get('x-custom-tenant-code') || 'gpntest-sebuk-ver'}` : 'test2',
  },
});

instance.interceptors.request.use(
  (config) => {
    // console.log(
    //   `%c${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    //   "color: pink"
    // );
    
    config.headers["Authorization"] = isBrowser ? `bearer ${cookie.get(cookieName)}` : '';
    /**
     * @TODO 추후에 프로덕션 환경에서 해당 코드를 삭제하고, 각 사용자별 테넌트 코드를 가져오는 별도의 로직이 필요
     */
    config.headers["x-tenant-code"] = isBrowser ? `${cookie.get('x-custom-tenant-code') || 'gpntest-sebuk-ver'}` : 'test2';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
