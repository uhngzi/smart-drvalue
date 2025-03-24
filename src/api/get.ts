import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { instance, instanceRoot } from "./lib/axios"

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
    s_query: [{ key: id, oper: 'eq', value: 1 }],
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
  
  *** params 설명 ***
    - 연산자가 하나일 경우에는 객체 형태의 배열로 보냄
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
    - 연산자가 두 개 이상일 경우에는 아예 구성된 조건 객체를 보냄
      예시 1. id와 name의 검색을 두 가지를 둘 다 만족을 하거나 age와 local의 검색을 두 가지를 둘 다 만족을 할 경우
      s_query : { "$or": [
        { "$and": [
            { "id": { "$eq": 1 }},
            { "name": { "$cont": "abc" }}
          ]
        },  // id, name이 한 묶음
        { "$and": [
            { "age": { "$eq": 1 }},
            { "local": { "$startsL": "D" }}
          ]
        }   // age, local이 한 묶음
      ]}  // (id, name) or (age, local)
        ** 사용 시 주의 : $, "를 꼭 넣어줘야 함
        ** 객체 내 키를 가져오기 위해서는 .을 이용 (예시 : partner.id)
*/

// 조건 연산자 타입 정의
type ConditionOperator =
  'eq'       // Equal: 필드의 값이 주어진 값과 정확하게 일치하는지 확인
| 'ne'       // Not Equal: 필드의 값이 주어진 값과 일치하지 않는지 확인
| 'gt'       // Greater Than: 필드의 값이 주어진 값보다 큰지 확인
| 'lt'       // Less Than: 필드의 값이 주어진 값보다 작은지 확인
| 'gte'      // Greater Than or Equal: 필드의 값이 주어진 값보다 크거나 같은지 확인
| 'lte'      // Less Than or Equal: 필드의 값이 주어진 값보다 작거나 같은지 확인
| 'starts'   // Starts With: 문자열 필드가 주어진 값으로 시작하는지 확인 (대소문자 구분)
| 'ends'     // Ends With: 문자열 필드가 주어진 값으로 끝나는지 확인 (대소문자 구분)
| 'cont'     // Contains: 문자열 필드에 주어진 값이 포함되어 있는지 확인
| 'excl'     // Excludes: 문자열 필드에 주어진 값이 포함되어 있지 않은지 확인
| 'in'       // In: 필드의 값이 제공된 값 목록 중 하나와 일치하는지 확인
| 'notin'    // Not In: 필드의 값이 제공된 값 목록에 포함되지 않는지 확인
| 'between'  // Between: 필드의 값이 두 값 사이에 있는지 확인
| 'isnull'   // Is Null: 필드의 값이 null인지 확인
| 'notnull'  // Not Null: 필드의 값이 null이 아닌지 확인
| 'eqL'      // Equal (Localized): 대소문자 무시 또는 로컬 비교하여 일치하는지 확인
| 'neL'      // Not Equal (Localized): 대소문자 무시 또는 로컬 비교하여 일치하지 않는지 확인
| 'startsL'  // Starts With (Localized): 대소문자 무시 또는 로컬 비교하여 시작하는지 확인
| 'endsL'    // Ends With (Localized): 대소문자 무시 또는 로컬 비교하여 끝나는지 확인
| 'contL'    // Contains (Localized): 대소문자 무시 또는 로컬 비교하여 포함되는지 확인
| 'exclL'    // Excludes (Localized): 대소문자 무시 또는 로컬 비교하여 포함되지 않는지 확인
| 'inL'      // In (Localized): 대소문자 무시 또는 로컬 비교하여 목록 내 일치 여부 확인
| 'notinL';  // Not In (Localized): 대소문자 무시 또는 로컬 비교하여 목록 내 미일치 여부 확인

// 간단한 단일 조건에 대한 타입
export interface QueryCondition {
  key: string;
  oper: ConditionOperator | 'or' | 'and';
  value: string | number;
}

// 필드 조건: 필드명에 해당하는 조건 객체 (예: { "prdNm": { "$cont": "DSF" } })
export interface FieldQuery {
  [field: string]: {
    [K in `$${ConditionOperator}`]?: string;
  }
}

// 논리 연산자를 통한 중첩 조건 타입
export interface LogicalQuery {
  $and?: Array<LogicalQuery | FieldQuery>;
  $or?: Array<LogicalQuery | FieldQuery>;
}

// s_query에 허용할 수 있는 타입: 단순 조건 배열 또는 이미 구성된 조건 객체
export type SQueryType = QueryCondition[] | LogicalQuery | FieldQuery;

export const getAPI = async (
  server: {
    type: 'file-mng' | 'auth' | 'sync' | 'baseinfo' | 'core-d1' | 'core-d2' | 'core-d3' | 'utility';
    utype?: 'root/' | 'tenant/';
    url: string;
    header?: boolean;
  },
  params?: {
    limit?: number;
    page?: number;
    s_totOper?: "and" | "or";
    s_query?: SQueryType;
    sort?: string;
    anykeys?: { [key: string]: unknown };
  }
): Promise<apiGetResponseType | apiAuthResponseType> => {
  let sParam: string | null = null;

  if (params?.s_query) {
    if (Array.isArray(params.s_query)) {
      // 단순 조건 배열인 경우 각 조건을 변환하여 s_totOper로 감쌉니다.
      const squery = params.s_query.map((qr) => ({
        [qr.key]: { ['$' + qr.oper]: qr.value }
      }));
      sParam = JSON.stringify({ ["$" + (params?.s_totOper ?? "and")]: squery });
    } else {
      // 이미 구성된 조건 객체인 경우 그대로 JSON 문자열로 변환합니다.
      sParam = JSON.stringify(params.s_query);
    }
  }

  const config = {
    params: {
      limit: params?.limit ?? null,
      page: params?.page ?? null,
      s: sParam,
      sort: params?.sort ?? "createdAt,DESC",
      ...(params?.anykeys || {}),
    }
  };

  let response;
  if (server.header) {
    response = await instanceRoot.get(
      `${server.type}/v1/${server.utype ?? ''}${server.url}`,
      config
    );
    console.log(`%cGET :: ${server.url}`, "color: red", response);
  } else {
    response = await instance.get(
      `${server.type}/v1/${server.utype ?? ''}${server.url}`,
      config
    );
    console.log(`%cGET :: ${server.url}`, "color: red", response);
  }

  const { data, resultCode } = response.data;
  return { data, resultCode, response };
}