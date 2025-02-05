import { getAPI } from "@/api/get";

export const getClientCsAPI = async (
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

export const getClientVndrAPI = async (
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

export const getClientSupAPI = async (
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