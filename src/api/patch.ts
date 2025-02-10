import { apiPatchResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"

export const patchAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1',
    utype?: 'root/' | 'tenant/',
    url: string,
    jsx: 'jsxcrud' | 'default',
    etc?: boolean,
  },
  id: string,
  body?: any,
): Promise<apiPatchResponseType>  => {
  if(server.utype === 'tenant/') {
    if(server.etc) {
      try {
        const response = await instance.patch(`${server.type}/v1/${server.utype??''}${server.url}`, body);
        console.log('PATCH RESPONSE : ', response);
        
        const { data, resultCode } = response.data;
        console.log(data, resultCode, response);
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: '패치 중 에러' } };
      }
    } else {
      try {
        const response = await instance.patch(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/update/${id}`, body);
        console.log('PATCH RESPONSE : ', response);
        
        const { data, resultCode } = response.data;
        console.log(data, resultCode, response);
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: '패치 중 에러' } };
      }
    }
  } else {
    try {
      const response = await instanceRoot.patch(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/update/${id}`, body);
      console.log('PATCH RESPONSE : ', response);
      
      const { data, resultCode } = response.data;
      console.log(data, resultCode, response);
      return { data, resultCode, response };
    } catch (e) {
      console.log(e);
      return { data: { data: null, message: '패치 중 에러' } };
    }
  }
}