import { instance } from "./lib/axios"

export const postAPI = async (
  //서버의 종류
  type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1',
  //서비스 종류
  service: 'root' | 'tenant' | 'etc',
  //API 주소
  url: string,
  //JSX 여부
  jsx: boolean,
  body?: any,
): Promise<{ data: { entity: any } | null; resultCode: string; response: any }> => {
  if(jsx) {
    const response = await instance.post(`${type}/v1/${service}/${url}/jsxcrud/create`, body);

    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  } else {
    const response = await instance.post(`${type}/v1/${service}/${url}/default/create`, body);

    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  }
}