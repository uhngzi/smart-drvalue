export enum HotGrade {
  SUPER_URGENT = "super_urgent",
  URGENT = "urgent",
  NORMAL = "normal",
  HOLD = "hold"
}

export enum ModelStatus {
  NEW = "new",
  REPEAT = "repeat",
  MODIFY = "modify"
}

export enum LayerEm {
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  L4 = "L4",
  L5 = "L5",
  L6 = "L6",
  L7 = "L7",
  L8 = "L8",
  L9 = "L9",
  L10 = "L10",
  L11 = "L11",
  L12 = "L12",
  L13 = "L13",
  L14 = "L14",
  L15 = "L15",
  L16 = "L16",
  L17 = "L17",
  L18 = "L18",
  L19 = "L19",
  L20 = "L20"
}

export enum ModelTypeEm {
  SAMPLE = "sample",
  PRODUCTION = "production"
}

export enum SalesOrderStatus {
  MODEL_REG_WAITING = 'model_reg_waiting', // 대기
  MODEL_REG_REGISTERING = 'model_reg_registering', // 등록중
  MODEL_REG_COMPLETED = 'model_reg_completed', // 완료
  MODEL_REG_DISCARDED = 'model_reg_discarded', // 폐기
}

export enum PrtTypeEm {
  CS = 'cs',
  VNDR = 'vndr',
  SUP = 'sup',
  BOTH = 'both',
}

export enum LamDtlTypeEm {
  CF = 'cf',
  PP = 'pp',
  CCL = 'ccl',
}

export enum OffdayTypeEm {
  HOLIDAY = 'holiday',
  COMPANY = 'company',
  SPECIAL = 'special',
  OTHER = 'other' 
}