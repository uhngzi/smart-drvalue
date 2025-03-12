import { getAPI } from "@/api/get";

export const getPrtAPI = async (
  pagination?:{size:number, current:number},
) => {
  const result = await getAPI({
    type: 'baseinfo', 
    utype: 'tenant/',
    url: 'biz-partner/jsxcrud/many'
  },{
    limit: pagination?.size || 0,
    page: pagination?.current || 0,
  });

  return result;
};

export const getPrtCsAPI = async (
  pagination?:{size:number, current:number},
) => {
  const result = await getAPI({
    type: 'baseinfo', 
    utype: 'tenant/',
    url: 'biz-partner/jsxcrud/many'
  },{
    limit: pagination?.size || 0,
    page: pagination?.current || 0,
    s_query: [{key: "prtTypeEm", oper: "eq", value: "cs"}]
  });

  return result;
};

export const getPrtVndrAPI = async (
  pagination?:{size:number, current:number},
) => {
  const result = await getAPI({
    type: 'baseinfo', 
    utype: 'tenant/',
    url: 'biz-partner/jsxcrud/many'
  },{
    limit: pagination?.size || 0,
    page: pagination?.current || 0,
    s_query: [{key: "prtTypeEm", oper: "eq", value: "vndr"}]
  });

  return result;
};

export const getPrtSupAPI = async (
  pagination?:{size:number, current:number},
) => {
  const result = await getAPI({
    type: 'baseinfo', 
    utype: 'tenant/',
    url: 'biz-partner/jsxcrud/many'
  },{
    limit: pagination?.size || 0,
    page: pagination?.current || 0,
    s_query: [{key: "prtTypeEm", oper: "eq", value: "sup"}]
  });

  return result;
};