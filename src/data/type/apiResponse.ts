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
    status: number;
    resultCode: string;
    message: string;
    path: string;
    timestamp: Date;
    requestUser: any;
  }
  resultCode: string;
  response: any;
}