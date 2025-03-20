export type materialType = {
  id: string;
  mtNm: string;
  mtEnm: string;
  unitType: string;
  materialGroup: {
    id: string;
    mtGrpNm: string;
    odNum: number;
    useYn: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
  useYn: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type materialCUType =  {
  materialGroup: {
    id: string;
  };
  mtNm: string;
  mtEnm: string;
  unitType: string;
  useYn: boolean;
}

export const setMaterialCUType = (data: any):materialCUType => {
  return {
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
  odNum: number;
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