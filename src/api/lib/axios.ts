import { baseURL, cookieName } from "./config";

import axios from "axios";
import cookie from "cookiejs";

// 브라우저 환경인지 체크
const isBrowser = typeof window !== "undefined";
const port = isBrowser ? window.location.port : ""; // 현재 포트

export const instanceRoot = axios.create({
  baseURL,
  headers: {},
});
instanceRoot.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = isBrowser
      ? `bearer ${cookie.get(cookieName)}`
      : "";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 이전 테스트 개발 헤더 : test, test2 (현재 프로세스 변경으로인해 작동 안 됨)
// GPN 테스트 개발 헤더 : gpntest-dev
// GPN 테스트 사용자 헤더 : gpntest-sebuk-ver
// 신양 테스트 헤더 : shinyang-test

export const instance = axios.create({
  baseURL,
  headers: {
    // Authorization: isBrowser ? `bearer ${cookie.get(cookieName)}` : '',
    /**
     * @TODO 추후에 프로덕션 환경에서 해당 코드를 삭제하고, 각 사용자별 테넌트 코드를 가져오는 별도의 로직이 필요
     */
    "x-tenant-code": isBrowser
      ? port === "90"
        ? cookie.get("dev-code") //|| "shinyang-test"
        : port === "3000"
        ? "shinyang-dev"
        : // "gpntest-dev"
          cookie.get("x-custom-tenant-code") || "gpntest-sebuk-ver"
      : "gpntest-sebuk-ver",
  },
});

instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = isBrowser
      ? `bearer ${cookie.get(cookieName)}`
      : "";
    /**
     * @TODO 추후에 프로덕션 환경에서 해당 코드를 삭제하고, 각 사용자별 테넌트 코드를 가져오는 별도의 로직이 필요
     */
    config.headers["x-tenant-code"] = isBrowser
      ? port === "90"
        ? cookie.get("dev-code") || "shinyang-test"
        : port === "3000"
        ? "shinyang-dev"
        : // "gpntest-dev"
          cookie.get("x-custom-tenant-code") || "gpntest-sebuk-ver"
      : "gpntest-sebuk-ver";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
