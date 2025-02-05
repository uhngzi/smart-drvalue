import { apiGetResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"

/*
  *** API 사용 예시 ***
  115.68.221.100:3300/api/serv/baseinfo/v1/tenant/biz-partner/jsxcrud/many
  BASE URL                    /${type}/v1/${utype}${url}
  
  getAPI({
    type: 'baseinfo',
    utype: 'tenant/',     ** 생략 가능
    url: 'process/jsxcrud/many',  ** 맨앞에 / 생략
  },{
    limit: 1,
    page: 1,
    s_search: "id",
    s_type: "in",
    s_list: ['"1"'],
  })

  *** server 설명 ***
  type
    - 파일관리 | 권한 | 동기화 | 기초정보 | 메인서버
  utype
    - 로그인한 사용자
    - root와 tenant가 대표적이며 그 외는 생략하고 url에 적어주시면 됩니다.
  url
    - API 세부 URL
  
  *** params 사용 시 주의 ***
  s_list 사용 시 작은 따옴표 내에 큰 따옴표로 반드시 묶어줘야 합니다.
    예) ['"..내용.."']
*/

export const getAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1',
    utype?: 'root/' | 'tenant/',
    url: string,
  },
  params?: {
    limit?: number,
    page?: number,
    s_search?: string,
    s_type?: 'in' | 'or' | 'eq' | 'regex' | 'elemMatch' | 'ne' | 'nin' | 'all',
    s_list?: Array<string>
  }
): Promise<apiGetResponseType>  => {
  if(server.utype === 'tenant/') {
    const response = await instance.get(`${server.type}/v1/${server.utype??''}${server.url}`, {
      params: {
        limit: params?.limit ?? null,
        page: params?.page ?? null,
        s: params?.s_search?`{"${params?.s_search}": {"$${params?.s_type}": ${params?.s_list}}}`:null
      }
    });
    
    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  } else {
    const response = await instanceRoot.get(`${server.type}/v1/${server.utype??''}${server.url}`, {
      params: {
        limit: params?.limit ?? null,
        page: params?.page ?? null,
        s: params?.s_search?`{"${params?.s_search}": {"$${params?.s_type}": ${params?.s_list}}}`:null
      }
    });
    
    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  }
}