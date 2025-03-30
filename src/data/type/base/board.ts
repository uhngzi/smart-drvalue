// 기초정보 - 원판정보

export type boardType = {
  id?: string;
  brdW?: number;
  brdH?: number;
  brdType?: string;
  brdDesc?: string;
  brdExtraInfo?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export const newDataBoardType = ():boardType => {
  return {
    brdW: 0,
    brdH: 0,
    brdType: '',
    brdDesc: '',
    brdExtraInfo: '',
  }
}
export const setDataBoardType = (data: any):boardType => {
  return {
    id: data.id,
    brdW: data.brdW,
    brdH: data.brdH,
    brdType: data.brdType,
    brdDesc: data.brdDesc,
    brdExtraInfo: data.brdExtraInfo,
  }
}

export const boardReq = () => {
  return [
    { field: 'brdType', label: '원판유형' },
    { field: 'brdDesc', label: '원판명' },
    { field: 'brdW', label: '가로' },
    { field: 'brdH', label: '세로' },
  ]
}

export type BoardGroupType = {
  id?: string;
  brdGrpName?: string
  brdGrpDesc?: string
  brdGrpExtraInfo?: string
  ordNo?: number
  useYn?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  boards?: boardType[];
}

export const newBoardGroupType = ():BoardGroupType => {
  return {
    id: '',
    brdGrpName: '',
    brdGrpDesc: '',
    brdGrpExtraInfo: '',
    ordNo: 0,
    useYn: false,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  }
}

export const setBoardGroupType = (data: any):BoardGroupType => {
  return {
    id: data.id,
    brdGrpName: data.brdGrpName,
    brdGrpDesc: data.brdGrpDesc,
    brdGrpExtraInfo: data.brdGrpExtraInfo,
    ordNo: data.ordNo,
    useYn: data.useYn,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  }
}