import { HotGrade, ModelStatus, PrtTypeEm, SalesOrderStatus } from "../enum";

export type salesOrderRType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  orderNm: string;
  orderDt: Date;
  orderRepDt: Date;
  orderTxt: string;
  isDiscard: boolean;
  hotGrade: HotGrade,
  emp: {
    id: string;
    name: string;
    userId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  },
  products: Array<{
    id: string;
    currPrdInfo: string;
    glbStatus: {
      id: string;
      salesOrderStatus: SalesOrderStatus;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
    },
    modelStatus: ModelStatus;
    orderDt: Date;
    orderNo: string;
    orderTit: string;
    prtOrderNo: string;
    orderPrdRemark: string;
    orderPrdCnt: number;
    orderPrdUnitPrice: number;
    orderPrdPrice: number;
    orderPrdDueReqDt: Date;
    orderPrdDueDt: Date;
    orderPrdHotGrade: HotGrade;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }>,
  prtInfo: {
    id: string;
    prt: {
      id: string;
      prtTypeEm: PrtTypeEm;
      prtNm: string;
      prtRegCd: number;
      prtSnm: string;
      prtEngNm: string;
      prtEngSnm: string;
      prtRegNo: string;
      prtCorpRegNo: string;
      prtBizType: string;
      prtBizCate: string;
      prtAddr: string;
      prtAddrDtl: string;
      prtZip: string;
      prtCeo: string;
      prtTel: string;
      prtFax: string;
      prtEmail: string;
      emp: {
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        id: string;
        name: string;
        userId: string;
        status: string;
        lastLoginAt: Date;
      };
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
    },
    mng: {
      id: string;
      prtMngNm: string;
      prtMngDeptNm: string;
      prtMngTeamNm: string;
      prtMngTel: string;
      prtMngMobile: string;
      prtMngFax: string;
      prtMngEmail: string;
      createdAt: Date;
      updatedAt: Date | null;
      deletedAt: Date | null;
    }
  }
}

//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date;
//   partner: cuRType;
//   partnerManager: cuMngRType;
//   orderNm: string;
//   orderDt: Date;
//   orderRepDt: Date;
//   orderTxt: string;
//   emp: {
//     id: string;
//     name: string;
//     userId: string;
//     status: string;
//     detail: {
//       id: string
//       createdAt: Date;
//       updatedAt: Date;
//       deletedAt: Date;
//       dept: {
//         id: string;
//         deptNm: string;
//         useYn: boolean;
//         createdAt: Date;
//         updatedAt: Date;
//         deletedAt: Date;
//       },
//       team: {
//         id: string;
//         teamNm: string;
//         useYn: boolean;
//         createdAt: Date;
//         updatedAt: Date;
//         deletedAt: Date;
//       },
//       empType: string;
//       empIdnum: string;
//       empTit: string;
//       empRank: string;
//       empStDt: Date;
//       empTrnsDt: Date;
//       empRemarks: string;
//       empEdDt: Date;
//       empSts: string;
//       empStsDt: Date;
//       empPayType: string;
//       empPay: number;
//       empPayAppDt: Date;
//       empPayTypeAppDt: Date;
//       secomCardno: string;
//     },
//     createdAt: Date;
//     updatedAt: Date;
//     deletedAt: Date;
//   },
//   files: Array<any>;
//   sales: Array<any>;
// }

export type salesOrderCUType = {
  partnerId: string;
  partnerManagerId?: string;
  orderName: string;
  orderDt: Date | null;
  orderRepDt: Date | null;
  orderTxt: string;
  empId: string;
  hotGrade: HotGrade | '';
  files?: Array<string>;
  products?: Array<{
      customPartnerManagerId?: string;
      currPrdInfo?: {
        id: string;
        name: string;
      },
      modelId?: string;
      modelStatus: ModelStatus | '';
      orderDt: Date;
      orderNo: string;
      orderTit: string;
      prtOrderNo?: string;
      orderPrdRemark?: string;
      orderPrdCnt: number;
      orderPrdUnitPrice: number;
      orderPrdPrice: number;
      orderPrdDueReqDt?: Date;
      orderPrdDueDt?: Date;
      orderPrdHotGrade: HotGrade;
  }>
}

export const newDatasalesOrderCUType = ():salesOrderCUType => {
  return {
    partnerId: '',
    partnerManagerId: '',
    orderName: '',
    orderDt: null,
    orderRepDt: null,
    orderTxt: '',
    empId: '',
    hotGrade: '',
    files: [],
    products: [],
  }
}