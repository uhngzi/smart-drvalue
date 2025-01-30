import { cuMngRType, cuRType } from "../base/cu";

export type salesOrderRType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  partner: cuRType;
  partnerManager: cuMngRType;
  orderNm: string;
  orderDt: Date;
  orderRepDt: Date;
  orderTxt: string;
  emp: {
    id: string;
    name: string;
    userId: string;
    status: string;
    detail: {
      id: string
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
      dept: {
        id: string;
        deptNm: string;
        useYn: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
      },
      team: {
        id: string;
        teamNm: string;
        useYn: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
      },
      empType: string;
      empIdnum: string;
      empTit: string;
      empRank: string;
      empStDt: Date;
      empTrnsDt: Date;
      empRemarks: string;
      empEdDt: Date;
      empSts: string;
      empStsDt: Date;
      empPayType: string;
      empPay: number;
      empPayAppDt: Date;
      empPayTypeAppDt: Date;
      secomCardno: string;
    },
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  },
  files: Array<any>;
  sales: Array<any>;
}

export type salesOrderCUType = {
  partnerId: string;
  partnerManagerId: string;
  orderName: string;
  orderDt: Date;
  orderRepDt: Date;
  orderTxt: string;
  empId: string;
  files: Array<string>;
}