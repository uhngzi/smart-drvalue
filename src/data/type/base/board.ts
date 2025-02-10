// 기초정보 - 원판정보

export type boardType = {
  id?: string;
  brdW: number;
  brdH: number;
  brdType: string;
  brdDesc: string;
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
  }
}

export const boardReq = () => {
  return [
    { field: 'brdType', label: '유형' },
    { field: 'brdDesc', label: '설명' },
    { field: 'brdW', label: '폭' },
    { field: 'brdH', label: '높이' },
  ]
}