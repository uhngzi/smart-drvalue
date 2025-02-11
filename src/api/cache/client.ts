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
    s_search: "prtTypeEm",
    s_type: 'eq',
    s_list:[`"cs"`]
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
    s_search: "prtTypeEm",
    s_type: 'eq',
    s_list:[`"vndr"`]
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
    s_search: "prtTypeEm",
    s_type: 'eq',
    s_list:[`"sup"`]
  });

  return result;
};