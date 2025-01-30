export type laminationRType = {
  id: string;
  lamDtlTypeEm: string;
  matCd: string;
  matThk: number;
  copOut: string;
  copIn: string;
  lamDtlThk: number;
  lamDtlRealThk: number;
  useYn: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export type laminationCUType = {
  lamDtlTypeEm: string;
  matCd: string;
  matThk: number;
  copOut: string;
  copIn: string;
  lamDtlThk: number;
  lamDtlRealThk: number;
  useYn: boolean;
}