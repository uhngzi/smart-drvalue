import dayjs from "dayjs";
import { salesEstimateProductType, salesEstimateType, salesOrderCUType, salesOrderProcuctCUType } from "./order";
import { HotGrade } from "../enum";
import { User, useUser } from "@/data/context/UserContext";
import { selectType } from "../componentStyles";

// 영업 - 고객발주 내 고객 발주만 등록 시 신규 발주 값 변환
export const changeOrderMainNew = (formData:salesOrderCUType, me:User | null):salesOrderCUType => {
  const jsonData = {
    ...formData,
    hotGrade: formData.hotGrade ?? HotGrade.NORMAL,
    orderDt: formData.orderDt ?? dayjs().format('YYYY-MM-DD'),
    orderName: formData.orderName,
    orderRepDt: new Date(),
    empId: me?.id ?? "1",
  } as salesOrderCUType;

  return jsonData;
}

// 영업 - 고객발주 내 신규 발주 값 변환
export const changeOrderNew = (formData:salesOrderCUType, newProducts:salesOrderProcuctCUType[], me:User | null):salesOrderCUType => {
  const jsonData = {
    ...formData,
    hotGrade: formData.hotGrade ?? HotGrade.NORMAL,
    orderDt: formData.orderDt ?? dayjs().format('YYYY-MM-DD'),
    orderName: formData.orderName,
    orderRepDt: new Date(),
    empId: me?.id ?? "1",
    products: newProducts.map((product:salesOrderProcuctCUType) => ({
      customPartnerManagerId: formData.partnerManagerId,
      currPrdInfo: product.currPrdInfo,
      modelId: product.modelId,
      modelStatus: product.modelStatus,
      orderDt: formData.orderDt ?? dayjs().format('YYYY-MM-DD'),
      // orderNo: index.toString(),
      orderTit: product.orderTit,
      prtOrderNo: product.prtOrderNo,
      orderPrdRemark: product.orderPrdRemark,
      orderPrdCnt: Number(product.orderPrdCnt),
      orderPrdUnitPrice: Number(product.orderPrdUnitPrice),
      orderPrdPrice: Number(product.orderPrdPrice),
      orderPrdDueReqDt: product.orderPrdDueReqDt,
      orderPrdDueDt: product.orderPrdDueDt,
      orderPrdHotGrade: formData.hotGrade ?? HotGrade.NORMAL,
    }))
  } as salesOrderCUType;

  return jsonData;
}

// 영업 - 고객발주 내 수정 시 값 변환
export const changeOrderEdit = (formData:salesOrderCUType, newProducts:salesOrderProcuctCUType[], me:User | null) => {
  const jsonData = {
    order: {
      id: formData.id,
      partnerId: formData.partnerId,
      partnerManagerId: formData.partnerManagerId,
      orderName: formData.orderName,
      totalOrderPrice: formData.totalOrderPrice,
      orderDt: formData.orderDt ?? dayjs().format('YYYY-MM-DD'),
      orderRepDt: formData.orderRepDt,
      orderTxt: formData.orderTxt,
      empId: me?.id ?? "1",
      hotGrade: formData.hotGrade ?? HotGrade.NORMAL,
      files: formData.files,
    },
    products: {
      create: newProducts.filter(f=>f.id?.includes('new')).map((prd:salesOrderProcuctCUType, index:number) => ({
        currPrdInfo: prd.currPrdInfo,
        modelId: prd.modelId,
        modelStatus: prd.modelStatus,
        orderDt: formData.orderDt ?? dayjs().format('YYYY-MM-DD'),
        // orderNo: index.toString(),
        orderTit: prd.orderTit,
        prtOrderNo: prd.prtOrderNo,
        orderPrdRemark: prd.orderPrdRemark,
        orderPrdCnt: prd.orderPrdCnt,
        orderPrdUnitPrice: prd.orderPrdUnitPrice,
        orderPrdPrice: prd.orderPrdPrice,
        orderPrdDueReqDt: prd.orderPrdDueReqDt,
        orderPrdDueDt: prd.orderPrdDueDt,
        orderPrdHotGrade: formData.hotGrade ?? HotGrade.NORMAL,
      })),
      update: newProducts.filter(f=>!f.id?.includes('new')).map((prd:salesOrderProcuctCUType, index:number) => ({
        id: prd.id,
        currPrdInfo: prd.currPrdInfo,
        modelId: prd.modelId,
        modelStatus: prd.modelStatus,
        orderDt: formData.orderDt ?? dayjs().format('YYYY-MM-DD'),
        // orderNo: index.toString(),
        orderTit: prd.orderTit,
        prtOrderNo: prd.prtOrderNo,
        orderPrdRemark: prd.orderPrdRemark,
        orderPrdCnt: prd.orderPrdCnt,
        orderPrdUnitPrice: prd.orderPrdUnitPrice,
        orderPrdPrice: prd.orderPrdPrice,
        orderPrdDueReqDt: prd.orderPrdDueReqDt,
        orderPrdDueDt: prd.orderPrdDueDt,
        orderPrdHotGrade: formData.hotGrade ?? HotGrade.NORMAL,
      }))
    }
  };

  return jsonData;
}

// 영업 - 견적 내 수정 삭제 시 값 반환
export const changeEstimateNewEdit = (
  meId: string,
  prtId: string,
  prtMngId: string,
  formData: salesEstimateType | null,
  fileIdList: string[],
  products: salesEstimateProductType[],
  metarialSelectList: selectType[],
  unitSelectList: selectType[],
) => {
  return {
    partnerId: prtId,
    partnerManagerId: prtMngId,
    estimateNm: formData?.estimateNm,
    totalEstimatePrice: formData?.totalEstimatePrice,
    estimateDt: formData?.estimateDt ? dayjs(formData.estimateDt).format("YYYY-MM-DD") : dayjs(),
    estimateTxt: formData?.estimateTxt,
    empId: meId,
    hotGrade: formData?.hotGrade ? formData.hotGrade : HotGrade.NORMAL,
    files: fileIdList,
    products: products.map((item) => ({
      id: item.id?.includes("new") ? undefined : item.id,
      currPrdInfo: "",
      tempPrdInfo: "",
      selected: item.selected,
      modelTypeEm: item.modelTypeEm,
      layerEm: item.layerEm,
      modelStatus: item.modelStatus,
      estimateModelNm: item.estimateModelNm,
      array: item.array,
      sizeH: item.sizeH,
      sizeW: item.sizeW,
      thickness: item.thickness,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      calculatedUnitPrice: item.calculatedUnitPrice,
      surfaceTreatment: item.surfaceTreatment,
      cost: item.cost,
      calculatedCost: item.calculatedCost,
      remark: item.remark,
      textureIdx: item.texture?.id ?? metarialSelectList?.[0]?.value,
      quantityUnitIdx: item.quantityUnit?.id ?? unitSelectList?.[0].value,
      modelId: item.model?.id,
      specialSpecifications: item.specialSpecifications?.map((item) => ({
        idx: item.id
      })),
      model: undefined,
      texture: undefined,
      quantityUnit: undefined,
      autoCalculatedCost: undefined,
      autoCalculatedUnitPrice: undefined,
    })),
  }
}