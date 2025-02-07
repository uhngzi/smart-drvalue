// 기초정보 - 원판정보

export type boardRType = {
  id: string;
  brdW: number;
  brdH: number;
  brdType: string;
  brdDesc: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type boardCUType = {
  brdW: number;
  brdH: number;
  brdType: string;
  brdDesc: string;
}

export const newDataBoardType = ():boardCUType => {
  return {
    brdW: 0,
    brdH: 0,
    brdType: '',
    brdDesc: '',
  }
}