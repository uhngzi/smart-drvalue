import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"
import { RequestQueryBuilder } from "@nestjsx/crud-request";

/*
  *** API 사용 예시 ***
  115.68.221.100:3300/api/serv/baseinfo/v1/tenant/biz-partner/jsxcrud/many
  BASE URL                    /${type}/v1/${utype}${url}
  
  getAPI({
    type: 'baseinfo',
    utype: 'tenant/',             ** 생략 가능
    url: 'process/jsxcrud/many',  ** 맨앞에 / 생략
    header: true ,                ** 생략 가능
  },{
    limit: 1,
    page: 1,
    s_query: [{ key: id, oper: 'eq', value: 1 }, { key: }],
    sort: "created,ASC",
  })

  *** server 설명 ***
  type
    - 파일관리 | 권한 | 동기화 | 기초정보 | 메인서버
  utype
    - 로그인한 사용자
    - root와 tenant가 대표적이며 그 외는 생략하고 url에 적어주시면 됩니다.
  url
    - API 세부 URL
  header
    - API 내 tenant 헤더 미사용 여부
    - tenant 헤더를 사용하지 않을 경우 true로 보내주시면 됩니다.
  
  *** params 사용 시 주의 ***
  s_query 내 key는 검색할 키워드 (id, name 등)
  s_query 내 oper는 검색할 연산자
  s_query 내 value는 검색할 값 (id의 값, name의 값 등)

  s_query를 여러 개 사용할 때 s_totOper을 통해 or인지 and인지 보내주시면 됩니다. (기본값 and이므로 and일 경우 생략 가능)
    예시 1. id와 name을 검색하며 두 가지를 둘 다 만족해야 할 경우
      s_query : [{key: id, oper: eq, value: 1}, {key: name, oper: cont, value: "abc"}],
      s_totOper : "and",  (이 경우에는 생략 할 수 있음)
    예시 2. id와 name을 검색하며 두 가지 중 하나만 만족해도 될 경우
      s_query : [{key: id, oper: eq, value: 1}, {key: name, oper: cont, value: "abc"}],
      s_totOper : "or",
*/

export const getAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1' | 'core-d2' | 'utility',
    utype?: 'root/' | 'tenant/',
    url: string,
    header?: boolean,
  },
  params?: {
    limit?: number,
    page?: number,
    s_totOper?: "and" | "or",
    s_query?: {
      key:string,
      oper:'eq'|'ne'|'gt'|'lt'|'gte'|'lte'|'starts'|'ends'|'cont'|'excl'|'in'|'notin'|'between'|'isnull'|'notnull'|'eqL'|'neL'|'startsL'|'endsL'|'contL'|'exclL'|'inL'|'notinL'|'or'|'and',
      value:string
    }[],
    sort?: string,
    anykeys?: { [key: string]: any },
  }
): Promise<apiGetResponseType | apiAuthResponseType>  => {
  const squery = params?.s_query?.map((qr) => ({
    [qr.key] : { ['$'+qr.oper] : qr.value}
  }))
  console.log(squery, JSON.stringify({ ["$"+(params?.s_totOper ?? "and")] : squery }));

  if(server.header) {
    const response = await instanceRoot.get(`${server.type}/v1/${server.utype??''}${server.url}`, {
      params: {
        limit: params?.limit ?? null,
        page: params?.page ?? null,
        s: squery ? JSON.stringify({ ["$"+(params?.s_totOper ?? "and")] : squery }) : null,
        sort: params?.sort ?? "createdAt,DESC",
        ...(params?.anykeys || {}),
      }
    });
    console.log(`%cGET :: ${server.url}`, "color: red", response);
    
    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  } else {
    const response = await instance.get(`${server.type}/v1/${server.utype??''}${server.url}`, {
      params: {
        limit: params?.limit ?? null,
        page: params?.page ?? null,
        s: squery ? JSON.stringify({ ["$"+(params?.s_totOper ?? "and")] : squery }) : null,
        sort: params?.sort ?? "createdAt,DESC",
        ...(params?.anykeys || {}),
      }
    });
    console.log(`%cGET :: ${server.url}`, "color: red", response);
    
    const { data, resultCode } = response.data;
    return { data, resultCode, response };
  }
}