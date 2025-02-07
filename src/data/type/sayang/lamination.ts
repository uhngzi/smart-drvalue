import { LayerEm } from "../enum";

export type sayangLaminationRType = {
  id: string;
  lamNo: string;
  layerEm: LayerEm;
  lamThk: number
  lamRealThk: number;
  specDetail: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type sayangLaminationCUType = {
  lamNo: string;
  layerEm: LayerEm | null;
  lamThk: number;
  lamRealThk: number;
  specDetail: {
    data: Array<{
      index: number;
      specLamIdx: number;
    }>
  }
}

export const newDataSayangLaminationType = ():sayangLaminationCUType => {
  return {
    lamNo: '',
    layerEm: null,
    lamThk: 0,
    lamRealThk: 0,
    specDetail: {
      data: []
    }
  }
}