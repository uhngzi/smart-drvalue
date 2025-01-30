import { apiGetResponseType } from "@/data/type/apiResponse";
import { instance } from "./lib/axios"

/*
  *** params 예시 ***
  {
    limit: 1,
    page: 1,
    s_search: "id",
    s_type: "in",
    s_list: ['"1"'],
  }

  *** 주의 ***
  s 사용 시 작은 따옴표 내에 큰 따옴표로 묶어줘야 합니다.
  예시 : ['"..내용.."']
*/

export const getAPI = async (
  //서버의 종류
  type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1',
  //서비스 종류
  service: 'root' | 'tenant' | 'etc',
  //API 주소
  url: string,
  params?: {
    limit?: number,
    page?: number,
    s_search?: string,
    s_type?: 'in' | 'or' | 'eq' | 'regex' | 'elemMatch' | 'ne' | 'nin' | 'all',
    s_list?: Array<string>
  }
): Promise<apiGetResponseType>  => {
  if(service === 'etc') {
    const response = await instance.get(`${type}/v1/${url}`, {
      params: {
        limit: params?.limit ?? null,
        page: params?.page ?? null,
        s: params?.s_search?`{"${params?.s_search}": {"$${params?.s_type}": ${params?.s_list}}}`:null
      }
    });
    
    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  } else {
    const response = await instance.get(`${type}/v1/${service}/${url}`, {
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