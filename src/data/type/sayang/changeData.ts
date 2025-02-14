import { useBase } from "@/data/context/BaseContext";
import { orderModelType } from "./models";

// 사양 - 모델 등록 대기 내 임시 저장 값 변환
export const changeModelAddTemp = (tempData:orderModelType | null) => {
  const jsonData = {
    currPrdInfo: tempData?.currPrdInfo,
    tempPrdInfo: {
      ...tempData?.tempPrdInfo,
      ...tempData?.editModel,
      partner: tempData?.prtInfo?.prt?.id,
      prdNm: tempData?.model?.prdNm,
      mnfNm: tempData?.model?.mnfNm,
    },
    partnerId: tempData?.prtInfo?.prt?.id,
    partnerManagerId: tempData?.prtInfo?.mng?.id,
    order: { id: tempData?.order?.id },
    model: { ...tempData?.model },
    modelStatus: tempData?.modelStatus,
    orderDt: tempData?.orderDt,
    orderTit: tempData?.orderTit,
    prtOrderNo: tempData?.prtOrderNo,
    orderPrdRemark: tempData?.orderPrdRemark,
    orderPrdCnt: tempData?.orderPrdCnt,
    orderPrdUnitPrice: tempData?.orderPrdUnitPrice,
    orderPrdPrice: tempData?.orderPrdPrice,
    orderPrdDueReqDt: tempData?.orderPrdDueReqDt,
    orderPrdDueDt: tempData?.orderPrdDueDt,
    orderPrdHotGrade: tempData?.orderPrdHotGrade
  }

  return jsonData;
}

// 사양 - 모델 등록 대기에서 확정 저장 시 모델이 새로 생성되는 값 변환
export const changeModelAddNewModel = (tempData:orderModelType) => {
  const {
    boardSelectList,
    metarialSelectList,
    surfaceSelectList,
    smPrintSelectList,
    smColorSelectList,
    smTypeSelectList,
    mkPrintSelectList,
    mkColorSelectList,
    mkTypeSelectList,
    outSelectList,
  } = useBase();

  const jsonData = {
    inactiveYn: false,
    partner: { id: tempData?.prtInfo?.prt?.id },
    prdNm: tempData?.model?.prdNm,
    board: { id: tempData?.model?.board?.id ?? boardSelectList?.[0]?.value },
    mnfNm: tempData?.model?.mnfNm,
    fpNo: tempData?.editModel?.fpNo ?? tempData?.tempPrdInfo?.fpNo,
    drgNo: tempData?.editModel?.drgNo ?? tempData?.tempPrdInfo?.drgNo,
    thk: tempData?.editModel?.thk ?? tempData?.tempPrdInfo?.thk,
    prdRevNo: tempData?.editModel?.prdRevNo ?? tempData?.tempPrdInfo?.prdRevNo,
    layerEm: tempData?.editModel?.layerEm ?? tempData?.tempPrdInfo?.layerEm ?? "L1",
    modelTypeEm: tempData?.editModel?.modelTypeEm ?? tempData?.tempPrdInfo?.modelTypeEm ?? "sample",
    copOut: tempData?.editModel?.copOut ?? tempData?.tempPrdInfo?.copOut,
    copIn: tempData?.editModel?.copOut ?? tempData?.tempPrdInfo?.copIn,
    material: { id: tempData?.editModel?.material?.id  ?? tempData?.tempPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value },
    surface: { id: tempData?.editModel?.surface?.id  ?? tempData?.tempPrdInfo?.surface?.id ?? surfaceSelectList?.[0]?.value },
    smPrint: { id: tempData?.editModel?.smPrint?.id  ?? tempData?.tempPrdInfo?.smPrint?.id ?? smPrintSelectList?.[0]?.value },
    smColor: { id: tempData?.editModel?.smColor?.id  ?? tempData?.tempPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value },
    smType: { id: tempData?.editModel?.smType?.id  ?? tempData?.tempPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value },
    mkPrint: { id: tempData?.editModel?.mkPrint?.id  ?? tempData?.tempPrdInfo?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value },
    mkColor: { id: tempData?.editModel?.mkColor?.id  ?? tempData?.tempPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value },
    mkType: { id: tempData?.editModel?.mkType?.id  ?? tempData?.tempPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value },
    spPrint: { id: tempData?.editModel?.spPrint?.id  ?? tempData?.tempPrdInfo?.spPrint?.id },
    spType: { id: tempData?.editModel?.spType?.id  ?? tempData?.tempPrdInfo?.spType?.id },
    aprType: { id: tempData?.editModel?.aprType?.id  ?? tempData?.tempPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value },
    vcutYn: tempData?.editModel?.vcutYn ?? tempData?.tempPrdInfo?.vcutYn ?? false,
    vcutType: { id: tempData?.editModel?.vcutType?.id ?? tempData?.tempPrdInfo?.vcutType?.id },
    unit: { id: tempData?.editModel?.unit?.id ?? tempData?.tempPrdInfo?.unit?.id },
    pcsW: tempData?.editModel?.pcsW ?? tempData?.tempPrdInfo?.pcsW,
    pcsL: tempData?.editModel?.pcsL ?? tempData?.tempPrdInfo?.pcsL,
    kitW: tempData?.editModel?.kitW ?? tempData?.tempPrdInfo?.kitW,
    kitL: tempData?.editModel?.kitL ?? tempData?.tempPrdInfo?.kitL,
    pnlW: tempData?.editModel?.pnlW ?? tempData?.tempPrdInfo?.pnlW,
    pnlL: tempData?.editModel?.pnlL ?? tempData?.tempPrdInfo?.pnlL,
    ykitW: tempData?.editModel?.ykitW ?? tempData?.tempPrdInfo?.ykitW,
    ykitL: tempData?.editModel?.ykitL ?? tempData?.tempPrdInfo?.ykitL,
    ypnlW: tempData?.editModel?.ypnlW ?? tempData?.tempPrdInfo?.ypnlW,
    ypnlL: tempData?.editModel?.ypnlL ?? tempData?.tempPrdInfo?.ypnlL,
    kitPcs: tempData?.editModel?.kitPcs ?? tempData?.tempPrdInfo?.kitPcs,
    pnlKit: tempData?.editModel?.pnlKit ?? tempData?.tempPrdInfo?.pnlKit,
    sthPnl: tempData?.editModel?.sthPnl ?? tempData?.tempPrdInfo?.sthPnl,
    sthPcs: tempData?.editModel?.sthPcs ?? tempData?.tempPrdInfo?.sthPcs,
    pltThk: tempData?.editModel?.pltThk ?? tempData?.tempPrdInfo?.pltThk,
    pltAlph: tempData?.editModel?.pltAlph ?? tempData?.tempPrdInfo?.pltAlph,
    spPltNi: tempData?.editModel?.spPltNi ?? tempData?.tempPrdInfo?.spPltNi,
    spPltNiAlph: tempData?.editModel?.spPltNiAlph ?? tempData?.tempPrdInfo?.spPltNiAlph,
    spPltAu: tempData?.editModel?.spPltAu ?? tempData?.tempPrdInfo?.spPltAu,
    spPltAuAlph: tempData?.editModel?.spPltAuAlph ?? tempData?.tempPrdInfo?.spPltAuAlph,
    pinCnt: tempData?.editModel?.pinCnt ?? tempData?.tempPrdInfo?.pinCnt,
  }

  return jsonData;
}