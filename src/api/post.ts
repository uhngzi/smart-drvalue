// import { instance } from "./lib/axios"

// export const postAPI = async (
//   //서버의 종류
//   type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1',
//   //서비스 종류
//   service: 'root' | 'tenant' | 'etc',
//   //API 주소
//   url: string,
//   //JSX 여부
//   jsx: boolean,
//   body?: any,
// ): Promise<{ data: { entity: any } | null; resultCode: string; response: any }> => {
//   if(jsx) {
//     const response = await instance.post(`${type}/v1/${service}/${url}/jsxcrud/create`, body);

//     const { data, resultCode } = response.data;
//     return { data, resultCode, response };
//   } else {
//     const response = await instance.post(`${type}/v1/${service}/${url}/default/create`, body);

//     const { data, resultCode } = response.data;
//     return { data, resultCode, response };
//   }
// }
import { apiPatchResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"

export const postAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1',
    utype?: 'root/' | 'tenant/',
    url: string,
    jsx: 'jsxcrud' | 'default',
    etc?: boolean,
  },
  body?: any,
): Promise<apiPatchResponseType>  => {
  if(server.utype === 'tenant/') {
    if(server.etc) {
      const response = await instance.post(`${server.type}/v1/${server.utype??''}${server.url}`, body);
      console.log('POST RESPONSE : ', response);
      
      const { data, resultCode } = response.data;
      return { data, resultCode, response };
    } else {
      const response = await instance.post(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/create`, body);
      console.log('POST RESPONSE : ', response);
      
      const { data, resultCode } = response.data;
      return { data, resultCode, response };
    }
  } else {
    const response = await instanceRoot.post(`${server.type}/v1/${server.utype??''}${server.url}/${server.jsx}/create`, body);
    console.log('POST RESPONSE : ', response);
    
    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  }
}