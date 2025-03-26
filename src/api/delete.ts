import { apiDeleteResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"

export const deleteAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1' | 'core-d2' | 'core-d3',
    utype?: 'root/' | 'tenant/',
    url: string,
    jsx: 'jsxcrud' | 'default',
    etc?: boolean,
  },
  id: string,
): Promise<apiDeleteResponseType>  => {
  if(server.utype === 'tenant/') {
    if(server.etc) {
      try {
        const response = await instance.delete(`${server.type}/v1/${server.utype??''}${server.url}/${id}`);
        console.log(`%cDELETE :: ${server.url}`, "color: red", response);
        
        const { data, resultCode } = response.data;
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: 'DELETE 중 에러' } };
      }
    } else {
      try {
        const response = await instance.delete(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/delete/${id}`);
        console.log(`%cDELETE :: ${server.url}`, "color: red", response);
        
        const { data, resultCode } = response.data;
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: 'DELETE 중 에러' } };
      }
    }
  } else {
    try {
      const response = await instanceRoot.patch(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/delete/${id}`);
        console.log(`%cDELETE :: ${server.url}`, "color: red", response);
      
      const { data, resultCode } = response.data;
      return { data, resultCode, response };
    } catch (e) {
      console.log(e);
      return { data: { data: null, message: 'DELETE 중 에러' } };
    }
  }
}