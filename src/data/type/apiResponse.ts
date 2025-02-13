export type apiGetResponseType = {
  data: {
    data: any;
    count?: number;
    total?: number;
    page?: number;
    pageCount?: number;
  }
  resultCode: string;
  response: any;
}

export type apiAuthResponseType = {
  data: any;
  resultCode: string;
  response: any;
}

export type apiPatchResponseType = {
  data: {
    data: any;
    message: string;
    status?: number;
    resultCode?: string;
    path?: string;
    timestamp?: Date;
    requestUser?: any;
    entity?: any;
  }
  resultCode?: string;
  response?: any;
}

export type apiDeleteResponseType = {
  data: {
    data: any;
    status?: number;
    resultCode?: string;
    message: string;
    timestamp?: Date;
    path?: string;
    requestUser?: any;
  }
  resultCode?: string;
  response?: any;
}