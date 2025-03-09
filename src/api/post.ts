import { apiPatchResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"

export const postAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1' | 'core-d2' | 'utility',
    utype?: 'root/' | 'tenant/',
    url: string,
    jsx: 'jsxcrud' | 'default',
    etc?: boolean,
    header?: boolean,
  },
  body?: any,
): Promise<apiPatchResponseType>  => {
  if(server.utype === 'root/' && server.header) {
    try {
      const response = await instanceRoot.post(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/create`, body);
      console.log(`%cPOST :: ${server.url}`, "color: red", response);
      
      const { data, resultCode } = response.data;
      return { data, resultCode, response };
    } catch (e) {
      console.log(e);
      return { data: { data: null, message: '포스트 중 에러' } };
    }
  } else {
    if(server.etc) {
      try {
        const response = await instance.post(`${server.type}/v1/${server.utype??''}${server.url}`, body);
        console.log(`%cPOST :: ${server.url}`, "color: red", response);
        
        const { data, resultCode } = response.data;
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: '포스트 중 에러' } };
      }
    } else {
      try {
        const response = await instance.post(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/create`, body);
        console.log(`%cPOST :: ${server.url}`, "color: red", response);
        
        const { data, resultCode } = response.data;
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: '포스트 중 에러' } };
      }
    }
  }
}