export type boardRType = {
  id: string;
  brdW: number;
  brdH: number;
  brdType: string;
  brdDesc: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type boardCUType = {
  brdW: number;
  brdH: number;
  brdType: string;
  brdDesc: string;
}