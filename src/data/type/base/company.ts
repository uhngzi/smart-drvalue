// 기초정보 - 원판정보

export type companyType = {
  id?: string;
  companyName: string;
  companyKorAlias: string;
  companyEngName: string;
  businessRegNo: string;
  corpRegNo: string;
  bizCondition: string;
  bizType: string;
  ceoName: string;
  ceoPhone: string;
  ceoFax: string;
  ceoEmail: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  taxManagerName: string;
  taxManagerEmail: string;
  taxManagerPhone: string;
  signatureImageId: string | null;
  companyLogoId?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

export const setDataCompanyType = (data: any): companyType => {
  return {
    companyName: data.companyName,
    companyKorAlias: data.companyKorAlias,
    companyEngName: data.companyEngName,
    businessRegNo: data.businessRegNo,
    corpRegNo: data.corpRegNo,
    bizCondition: data.bizCondition,
    bizType: data.bizType,
    ceoName: data.ceoName,
    ceoPhone: data.ceoPhone,
    ceoFax: data.ceoFax,
    ceoEmail: data.ceoEmail,
    postalCode: data.postalCode,
    address: data.address,
    detailAddress: data.detailAddress,
    taxManagerName: data.taxManagerName,
    taxManagerEmail: data.taxManagerEmail,
    taxManagerPhone: data.taxManagerPhone,
    signatureImageId: data.signatureImageId,
    companyLogoId: data.companyLogoId,
  };
};

export const newDataCompanyType = (): companyType => {
  return {
    companyName: "",
    companyKorAlias: "",
    companyEngName: "",
    businessRegNo: "",
    corpRegNo: "",
    bizCondition: "",
    bizType: "",
    ceoName: "",
    ceoPhone: "",
    ceoFax: "",
    ceoEmail: "",
    postalCode: "",
    address: "",
    detailAddress: "",
    taxManagerName: "",
    taxManagerEmail: "",
    taxManagerPhone: "",
    signatureImageId: null,
  };
};
