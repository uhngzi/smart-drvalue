export type materialType = {
  id: string | undefined;
  mtNm: string;
  mtEnm: string;
  unitType: string;
  materialGroup: {
    id: string;
    mtGrpNm?: string;
    odNum?: number;
    useYn?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };
  materialSuppliers?: {id:string} | string[]
  useYn: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type materialCUType =  {
  id?: string;
  materialGroup: {
    id: string | null;
  };
  mtNm: string;
  mtEnm: string;
  unitType: string;
  useYn: boolean;
}

export const setMaterialCUType = (data: any):materialCUType => {
  return {
    id: data.id,
    materialGroup: {
      id: data.materialGroup.id,
    },
    mtNm: data.mtNm,
    mtEnm: data.mtEnm,
    unitType: data.unitType,
    useYn: data.useYn,
  }
}

export const newMaterialCUType  = ():materialCUType => {
  return {
    materialGroup: {
      id: '',
    },
    mtNm: '',
    mtEnm: '',
    unitType: '',
    useYn: true,
  }
}

export type materialGroupType = {
  id: string;
  mtGrpNm: string;
  ordNo: number;
  useYn: boolean;
  material: materialType[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type materialGroupCUType = {
  mtGrpNm: string;
  odNum: number;
  useYn: boolean;
}

export const setMtGroupCUType = (data: any):materialGroupCUType => {
  return {
    mtGrpNm: data.mtGrpNm,
    odNum: data.odNum,
    useYn: data.useYn,
  }
}

export const newMtGroupCUType = ():materialGroupCUType => {
  return {
    mtGrpNm: '',
    odNum: 0,
    useYn: true,
  }
}