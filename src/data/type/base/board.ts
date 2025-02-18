// 기초정보 - 원판정보

export type boardType = {
  id?: string;
  brdW: number;
  brdH: number;
  brdType: string;
  brdDesc: string;
  brdExtraInfo: string;
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

export const boardReq = () => {
  return [
    { field: 'brdType', label: '원판유형' },
    { field: 'brdDesc', label: '원판명' },
    { field: 'brdW', label: '가로' },
    { field: 'brdH', label: '세로' },
  ]
}