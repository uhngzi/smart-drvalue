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