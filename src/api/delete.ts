import { apiDeleteResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"

export const deleteAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1',
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
        console.log('DELETE RESPONSE : ', response);
        
        const { data, resultCode } = response.data;
        console.log(data, resultCode, response);
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: 'DELETE 중 에러' } };
      }
    } else {
      try {
        const response = await instance.delete(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/delete/${id}`);
        console.log('DELETE RESPONSE : ', response);
        
        const { data, resultCode } = response.data;
        console.log(data, resultCode, response);
        return { data, resultCode, response };
      } catch (e) {
        console.log(e);
        return { data: { data: null, message: 'DELETE 중 에러' } };
      }
    }
  } else {
    try {
      const response = await instanceRoot.patch(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/delete/${id}`);
      console.log('DELETE RESPONSE : ', response);
      
      const { data, resultCode } = response.data;
      console.log(data, resultCode, response);
      return { data, resultCode, response };
    } catch (e) {
      console.log(e);
      return { data: { data: null, message: 'DELETE 중 에러' } };
    }
  }
}