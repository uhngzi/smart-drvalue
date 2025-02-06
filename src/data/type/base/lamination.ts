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

export const newLaminationCUType  = ():laminationCUType => {
  return {
    lamDtlTypeEm: '',
    matCd: '',
    matThk: 0,
    copOut: '',
    copIn: '',
    lamDtlThk: 0,
    lamDtlRealThk: 0,
    useYn: true,
  }
}