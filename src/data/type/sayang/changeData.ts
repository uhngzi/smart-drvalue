import { modelsMatchRType, modelsType, orderModelType, salesModelsType } from "./models";
import { selectType } from "../componentStyles";
import { specModelType, specPrdGroupPrcs, specType } from "./sample";
import { salesOrderProcuctCUType } from "../sales/order";

// 사양 - 모델 등록 대기 내 임시 저장 값 변환
export const changeModelAddTemp = (tempData:orderModelType | null) => {
  const jsonData = {
    currPrdInfo: tempData?.currPrdInfo,
    tempPrdInfo: {
      ...tempData?.tempPrdInfo,
      partner: tempData?.prtInfo?.prt?.id,
      prdNm: tempData?.model?.prdNm,
      mnfNm: tempData?.model?.mnfNm,
      ...tempData?.editModel,
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
export const changeModelAddNewModel = (
  tempData:orderModelType, 
  boardSelectList: selectType[],
  metarialSelectList: selectType[],
  surfaceSelectList: selectType[],
  outSelectList: selectType[],
  smPrintSelectList: selectType[],
  smColorSelectList: selectType[],
  smTypeSelectList: selectType[],
  mkPrintSelectList: selectType[],
  mkColorSelectList: selectType[],
  mkTypeSelectList: selectType[],
  unitSelectList: selectType[],
) => {
  let jsonData = {
    inactiveYn: false,
    partner: { id: tempData?.prtInfo?.prt?.id },
    prdNm: tempData?.model?.prdNm ?? tempData?.orderTit,
    board: { id: tempData?.model?.board?.id ?? tempData.currPrdInfo.board?.id ??  boardSelectList?.[0]?.value },
    mnfNm: tempData?.editModel?.mnfNm ?? tempData?.model?.mnfNm ?? tempData.currPrdInfo?.mnfNm,
    drgNo: tempData?.editModel?.drgNo ?? tempData?.tempPrdInfo?.drgNo ?? tempData.currPrdInfo?.drgNo,
    thk: tempData?.editModel?.thk ?? tempData?.tempPrdInfo?.thk ?? tempData.currPrdInfo?.thk,
    prdRevNo: tempData?.editModel?.prdRevNo ?? tempData?.tempPrdInfo?.prdRevNo ?? tempData.currPrdInfo?.prdRevNo,
    layerEm: tempData?.editModel?.layerEm ?? tempData?.tempPrdInfo?.layerEm ?? tempData.currPrdInfo?.layerEm ?? "L1",
    modelTypeEm: tempData?.editModel?.modelTypeEm ?? tempData?.tempPrdInfo?.modelTypeEm ?? tempData.currPrdInfo?.modelTypeEm ?? "sample",
    copOut: tempData?.editModel?.copOut ?? tempData?.tempPrdInfo?.copOut ?? tempData.currPrdInfo?.copOut,
    copIn: tempData?.editModel?.copOut ?? tempData?.tempPrdInfo?.copIn ?? tempData.currPrdInfo?.copIn,
    material: { id: tempData?.editModel?.material?.id  ?? tempData?.tempPrdInfo?.material?.id ?? tempData.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value },
    surface: { id: tempData?.editModel?.surface?.id  ?? tempData?.tempPrdInfo?.surface?.id ?? tempData.currPrdInfo?.surface?.id ?? surfaceSelectList?.[0]?.value },
    smPrint: { id: tempData?.editModel?.smPrint?.id  ?? tempData?.tempPrdInfo?.smPrint?.id ?? tempData.currPrdInfo?.smPrint?.id ?? smPrintSelectList?.[0]?.value },
    smColor: { id: tempData?.editModel?.smColor?.id  ?? tempData?.tempPrdInfo?.smColor?.id ?? tempData.currPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value },
    smType: { id: tempData?.editModel?.smType?.id  ?? tempData?.tempPrdInfo?.smType?.id ?? tempData.currPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value },
    mkPrint: { id: tempData?.editModel?.mkPrint?.id  ?? tempData?.tempPrdInfo?.mkPrint?.id ?? tempData.currPrdInfo?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value },
    mkColor: { id: tempData?.editModel?.mkColor?.id  ?? tempData?.tempPrdInfo?.mkColor?.id ?? tempData.currPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value },
    mkType: { id: tempData?.editModel?.mkType?.id  ?? tempData?.tempPrdInfo?.mkType?.id ?? tempData.currPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value },
    spPrint: { id: tempData?.editModel?.spPrint?.id  ?? tempData?.tempPrdInfo?.spPrint?.id ?? tempData.currPrdInfo?.spPrint?.id },
    spType: { id: tempData?.editModel?.spType?.id  ?? tempData?.tempPrdInfo?.spType?.id ?? tempData.currPrdInfo?.spType?.id },
    aprType: { id: tempData?.editModel?.aprType?.id  ?? tempData?.tempPrdInfo?.aprType?.id ?? tempData.currPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value },
    vcutYn: tempData?.editModel?.vcutYn ?? tempData?.tempPrdInfo?.vcutYn ?? tempData.currPrdInfo?.vcutYn ?? false,
    vcutType: { id: tempData?.editModel?.vcutType?.id ?? tempData?.tempPrdInfo?.vcutType?.id ?? tempData.currPrdInfo?.vcutType?.id },
    vcutText: tempData?.editModel?.vcutText ?? tempData?.tempPrdInfo?.vcutText ?? tempData.currPrdInfo?.vcutText,
    unit: { id: tempData?.editModel?.unit?.id ?? tempData?.tempPrdInfo?.unit?.id ?? tempData.currPrdInfo?.unit?.id ?? unitSelectList?.[0]?.value },
    pcsW: tempData?.editModel?.pcsW ?? tempData?.tempPrdInfo?.pcsW ?? tempData.currPrdInfo?.pcsW,
    pcsL: tempData?.editModel?.pcsL ?? tempData?.tempPrdInfo?.pcsL ?? tempData.currPrdInfo?.pcsL,
    kitW: tempData?.editModel?.kitW ?? tempData?.tempPrdInfo?.kitW ?? tempData.currPrdInfo?.kitW,
    kitL: tempData?.editModel?.kitL ?? tempData?.tempPrdInfo?.kitL ?? tempData.currPrdInfo?.kitL,
    pnlW: tempData?.editModel?.pnlW ?? tempData?.tempPrdInfo?.pnlW ?? tempData.currPrdInfo?.pnlW,
    pnlL: tempData?.editModel?.pnlL ?? tempData?.tempPrdInfo?.pnlL ?? tempData.currPrdInfo?.pnlL,
    ykitW: tempData?.editModel?.ykitW ?? tempData?.tempPrdInfo?.ykitW ?? tempData.currPrdInfo?.ykitW,
    ykitL: tempData?.editModel?.ykitL ?? tempData?.tempPrdInfo?.ykitL ?? tempData.currPrdInfo?.ykitL,
    ypnlW: tempData?.editModel?.ypnlW ?? tempData?.tempPrdInfo?.ypnlW ?? tempData.currPrdInfo?.ypnlW ?? 0,
    ypnlL: tempData?.editModel?.ypnlL ?? tempData?.tempPrdInfo?.ypnlL ?? tempData.currPrdInfo?.ypnlL ?? 0,
    kitPcs: tempData?.editModel?.kitPcs ?? tempData?.tempPrdInfo?.kitPcs ?? tempData.currPrdInfo?.kitPcs,
    pnlKit: tempData?.editModel?.pnlKit ?? tempData?.tempPrdInfo?.pnlKit ?? tempData.currPrdInfo?.pnlKit,
    sthPnl: tempData?.editModel?.sthPnl ?? tempData?.tempPrdInfo?.sthPnl ?? tempData.currPrdInfo?.sthPnl,
    sthPcs: tempData?.editModel?.sthPcs ?? tempData?.tempPrdInfo?.sthPcs ?? tempData.currPrdInfo?.sthPcs,
    pltThk: tempData?.editModel?.pltThk ?? tempData?.tempPrdInfo?.pltThk ?? tempData.currPrdInfo?.pltThk ?? 25,
    pltAlph: tempData?.editModel?.pltAlph ?? tempData?.tempPrdInfo?.pltAlph ?? tempData.currPrdInfo?.pltAlph ?? 0,
    spPltNi: tempData?.editModel?.spPltNi ?? tempData?.tempPrdInfo?.spPltNi ?? tempData.currPrdInfo?.spPltNi ?? 4,
    spPltNiAlph: tempData?.editModel?.spPltNiAlph ?? tempData?.tempPrdInfo?.spPltNiAlph ?? tempData.currPrdInfo?.spPltNiAlph,
    spPltAu: tempData?.editModel?.spPltAu ?? tempData?.tempPrdInfo?.spPltAu ?? tempData.currPrdInfo?.spPltAu ?? 0.03,
    spPltAuAlph: tempData?.editModel?.spPltAuAlph ?? tempData?.tempPrdInfo?.spPltAuAlph ?? tempData.currPrdInfo?.spPltAuAlph,
    // spPltOsp: tempData?.editModel?.spPltOsp ?? tempData?.tempPrdInfo?.spPltOsp ?? tempData.currPrdInfo?.spPltOsp ?? 0.2,
    pinCnt: tempData?.editModel?.pinCnt ?? tempData?.tempPrdInfo?.pinCnt ?? tempData.currPrdInfo?.pinCnt ?? 0,
  }

  return jsonData;
}

// 사양 - 사양 등록 임시저장에서 값 변환
export const changeSayangTemp = (
  type:"new"|"re",  // 신규인지 재등록인지 판단
  data:modelsMatchRType | specType,
  arrChk?: boolean,
  datas?: modelsMatchRType[],
) => {
  let jsonData = {}
  if(type === "new") {
    const model = (data as modelsMatchRType).tempModel;
    jsonData = {
      specDetail: {},
      models: arrChk ? 
      datas?.map((item:modelsMatchRType) => ({
        glbStatusId: item?.model?.glbStatus?.id ?? (data as modelsMatchRType).glbStatus?.id,
        modelMatchId: item?.id,
        prdNm: item?.tempModel?.prdNm,
        prdRevNo: item?.tempModel?.prdRevNo,
        layerEm: item?.tempModel?.layerEm,
        modelTypeEm: item?.tempModel?.modelTypeEm,
        thk: item?.tempModel?.thk,
        mnfNm: item?.tempModel?.mnfNm,
        copOut: item?.tempModel?.copOut,
        copIn: item?.tempModel?.copIn,
        vcutYn: item?.tempModel?.vcutYn,
        board: item?.tempModel?.board,
        material: item?.tempModel?.material,
        surface: item?.tempModel?.surface,
        smPrint: item?.tempModel?.smPrint,
        smColor: item?.tempModel?.smColor,
        smType: item?.tempModel?.smType,
        mkPrint: item?.tempModel?.mkPrint,
        mkColor: item?.tempModel?.mkColor,
        mkType: item?.tempModel?.mkType,
        spPrint: item?.tempModel?.spPrint,
        spType: item?.tempModel?.spType,
        aprType: item?.tempModel?.aprType,
        vcutType: item?.tempModel?.vcutType,
        vcutText: item?.tempModel?.vcutText,
        // fpNo: item?.tempModel?.fpNo,
        drgNo: item?.tempModel?.drgNo,
        unit: item?.tempModel?.unit,
        pcsW: item?.tempModel?.pcsW,
        pcsL: item?.tempModel?.pcsL,
        kitW: item?.tempModel?.kitW,
        kitL: item?.tempModel?.kitL,
        pnlW: item?.tempModel?.pnlW,
        pnlL: item?.tempModel?.pnlL,
        ykitW: item?.tempModel?.ykitW,
        ykitL: item?.tempModel?.ykitL,
        ypnlW: item?.tempModel?.ypnlW,
        ypnlL: item?.tempModel?.ypnlL,
        kitPcs: item?.tempModel?.kitPcs,
        pnlKit: item?.tempModel?.pnlKit,
        sthPnl: item?.tempModel?.sthPnl,
        sthPcs: item?.tempModel?.sthPcs,
        pltThk: item?.tempModel?.pltThk,
        pltAlph: item?.tempModel?.pltAlph,
        spPltNi: item?.tempModel?.spPltNi,
        spPltNiAlph: item?.tempModel?.spPltNiAlph,
        spPltAu: item?.tempModel?.spPltAu,
        spPltAuAlph: item?.tempModel?.spPltAuAlph,
        pinCnt: item?.tempModel?.pinCnt,
        ulTxt1: item?.tempModel?.ulTxt1,
        ulTxt2: item?.tempModel?.ulTxt2,
        ulCd1: { id: item?.tempModel?.ulCd1?.id },
        ulCd2: { id: item?.tempModel?.ulCd2?.id },
        specLine: item?.tempModel?.specLine,
        specSpace: item?.tempModel?.specSpace,
        specDr: item?.tempModel?.specDr,
        specPad: item?.tempModel?.specPad,
      })) as specModelType[]
      :
      [
        {
          glbStatusId: model?.glbStatus?.id ?? (data as modelsMatchRType).glbStatus?.id,
          modelMatchId: data.id,
          prdNm: model?.prdNm,
          prdRevNo: model?.prdRevNo,
          layerEm: model?.layerEm,
          modelTypeEm: model?.modelTypeEm,
          thk: model?.thk,
          mnfNm: model?.mnfNm,
          copOut: model?.copOut,
          copIn: model?.copIn,
          vcutYn: model?.vcutYn,
          board: model?.board,
          material: model?.material,
          surface: model?.surface,
          smPrint: model?.smPrint,
          smColor: model?.smColor,
          smType: model?.smType,
          mkPrint: model?.mkPrint,
          mkColor: model?.mkColor,
          mkType: model?.mkType,
          spPrint: model?.spPrint,
          spType: model?.spType,
          aprType: model?.aprType,
          vcutType: model?.vcutType,
          vcutText: model?.vcutText,
          // fpNo: model?.fpNo,
          drgNo: model?.drgNo,
          unit: model?.unit,
          pcsW: model?.pcsW,
          pcsL: model?.pcsL,
          kitW: model?.kitW,
          kitL: model?.kitL,
          pnlW: model?.pnlW,
          pnlL: model?.pnlL,
          ykitW: model?.ykitW,
          ykitL: model?.ykitL,
          ypnlW: model?.ypnlW,
          ypnlL: model?.ypnlL,
          kitPcs: model?.kitPcs,
          pnlKit: model?.pnlKit,
          sthPnl: model?.sthPnl,
          sthPcs: model?.sthPcs,
          pltThk: model?.pltThk,
          pltAlph: model?.pltAlph,
          spPltNi: model?.spPltNi,
          spPltNiAlph: model?.spPltNiAlph,
          spPltAu: model?.spPltAu,
          spPltAuAlph: model?.spPltAuAlph,
          pinCnt: model?.pinCnt,
          ulTxt1: model?.ulTxt1,
          ulTxt2: model?.ulTxt2,
          ulCd1: { id: model?.ulCd1?.id },
          ulCd2: { id: model?.ulCd2?.id },
          specLine: model?.specLine,
          specSpace: model?.specSpace,
          specDr: model?.specDr,
          specPad: model?.specPad,
        } as specModelType
      ]
    } as specType
  } else {
    const specData = data as specType;
    const modelsData = (data as specType).specModels;
    jsonData = {
      specId: specData.id,
      specDetail: {
        specLamination: { id: specData.specLamination?.id },
        board: { id: specData.board?.id },
        brdArrYldRate: specData.brdArrYldRate,
        wksizeW: specData.wksizeW,
        wksizeH: specData.wksizeH,
        stdW: specData.stdW,
        stdH: specData.stdH,
        brdArrStorageKey: specData.brdArrStorageKey,
        cutCnt: specData.cutCnt,
        jYn: specData.jYn,
        prcNotice: specData.prcNotice,
        camNotice: specData.camNotice,
        kitGapX: specData.kitGapX,
        kitGapY: specData.kitGapY,
        couponYn: specData.couponYn,
      },
      models: (modelsData ?? []).map((model:specModelType) => ({
        id: model.id,
        glbStatusId: model.glbStatus?.id,
        modelMatchId: model.modelMatch?.id ?? model.matchId,
        prdNm: model.prdNm,
        prdRevNo: model.prdRevNo,
        layerEm: model.layerEm,
        modelTypeEm: model.modelTypeEm,
        thk: model.thk,
        mnfNm: model.mnfNm,
        copOut: model.copOut,
        copIn: model.copIn,
        vcutYn: model.vcutYn,
        board: model.board,
        material: model.material,
        surface: model.surface,
        smPrint: model.smPrint,
        smColor: model.smColor,
        smType: model.smType,
        mkPrint: model.mkPrint,
        mkColor: model.mkColor,
        mkType: model.mkType,
        spPrint: model.spPrint,
        spType: model.spType,
        aprType: model.aprType,
        vcutType: model.vcutType,
        vcutText: model.vcutText,
        // fpNo: model.fpNo,
        drgNo: model.drgNo,
        unit: model.unit,
        pcsW: model.pcsW,
        pcsL: model.pcsL,
        kitW: model.kitW,
        kitL: model.kitL,
        pnlW: model.pnlW,
        pnlL: model.pnlL,
        ykitW: model.ykitW,
        ykitL: model.ykitL,
        ypnlW: model.ypnlW,
        ypnlL: model.ypnlL,
        kitPcs: model.kitPcs,
        pnlKit: model.pnlKit,
        sthPnl: model.sthPnl,
        sthPcs: model.sthPcs,
        pltThk: model.pltThk,
        pltAlph: model.pltAlph,
        spPltNi: model.spPltNi,
        spPltNiAlph: model.spPltNiAlph,
        spPltAu: model.spPltAu,
        spPltAuAlph: model.spPltAuAlph,
        pinCnt: model.pinCnt,
        ulTxt1: model.ulTxt1,
        ulTxt2: model.ulTxt2,
        ulCd1: { id: model.ulCd1?.id },
        ulCd2: { id: model.ulCd2?.id },
        specLine: model.specLine,
        specSpace: model.specSpace,
        specDr: model.specDr,
        specPad: model.specPad,
        prdCnt: model.prdCnt,
        impedanceLineCnt: model.impedanceLineCnt,
        pcsValue: model.pcsValue,
      })),
    }
    if(specData?.specPrdGroupPrcs && specData.specPrdGroupPrcs.length > 0){
      jsonData = { 
        ...jsonData,
        prdGroup: {
          prdGrpNm: specData.specPrdGroupPrcs?.[0]?.prdGrpNm,
          prdGrpIdx: specData.specPrdGroupPrcs?.[0]?.productLinesGroup?.id,
          data: specData.specPrdGroupPrcs?.map((prc:specPrdGroupPrcs) => ({
            prcIdx: prc.process?.id,
            vendorIdx: prc.vendor?.id,
            order: prc.ordNo,
            prcWkRemark: prc.prcWkRemark
          }))
        }
      }
    }
  }
  console.log(JSON.stringify(jsonData));

  return jsonData;
}

export const changeTempModel = (d:modelsMatchRType, tempModel:any) => {
  return {
    prdNm: tempModel?.prdNm ?? d?.model?.prdNm,
    prdRevNo: tempModel?.prdRevNo ?? d?.model?.prdRevNo,
    layerEm: tempModel?.layerEm ?? d?.model?.layerEm,
    modelTypeEm: tempModel?.modelTypeEm ?? d?.model?.modelTypeEm,
    thk: tempModel?.thk ?? d?.model?.thk,
    mnfNm: tempModel?.mnfNm ?? d?.model?.mnfNm,
    copOut: tempModel?.copOut ?? d?.model?.copOut,
    copIn: tempModel?.copIn ?? d?.model?.copIn,
    vcutYn: tempModel?.vcutYn ?? d?.model?.vcutYn,
    board: tempModel?.board ?? d?.model?.board,
    material: tempModel?.material ?? d?.model?.material,
    surface: tempModel?.surface ?? d?.model?.surface,
    smPrint: tempModel?.smPrint ?? d?.model?.smPrint,
    smColor: tempModel?.smColor ?? d?.model?.smColor,
    smType: tempModel?.smType ?? d?.model?.smType,
    mkPrint: tempModel?.mkPrint ?? d?.model?.mkPrint,
    mkColor: tempModel?.mkColor ?? d?.model?.mkColor,
    mkType: tempModel?.mkType ?? d?.model?.mkType,
    spPrint: tempModel?.spPrint ?? d?.model?.spPrint,
    spType: tempModel?.spType ?? d?.model?.spType,
    aprType: tempModel?.aprType ?? d?.model?.aprType,
    vcutType: tempModel?.vcutType ?? d?.model?.vcutType,
    vcutText: tempModel?.vcutText ?? d?.model?.vcutText,
    drgNo: tempModel?.drgNo ?? d?.model?.drgNo,
    unit: tempModel?.unit ?? d?.model?.unit,
    pcsW: tempModel?.pcsW ?? d?.model?.pcsW,
    pcsL: tempModel?.pcsL ?? d?.model?.pcsL,
    kitW: tempModel?.kitW ?? d?.model?.kitW,
    kitL: tempModel?.kitL ?? d?.model?.kitL,
    pnlW: tempModel?.pnlW ?? d?.model?.pnlW,
    pnlL: tempModel?.pnlL ?? d?.model?.pnlL,
    ykitW: tempModel?.ykitW ?? d?.model?.ykitW,
    ykitL: tempModel?.ykitL ?? d?.model?.ykitL,
    ypnlW: tempModel?.ypnlW ?? d?.model?.ypnlW,
    ypnlL: tempModel?.ypnlL ?? d?.model?.ypnlL,
    kitPcs: tempModel?.kitPcs ?? d?.model?.kitPcs,
    pnlKit: tempModel?.pnlKit ?? d?.model?.pnlKit,
    sthPnl: tempModel?.sthPnl ?? d?.model?.sthPnl,
    sthPcs: tempModel?.sthPcs ?? d?.model?.sthPcs,
    pltThk: tempModel?.pltThk ?? d?.model?.pltThk,
    pltAlph: tempModel?.pltAlph ?? d?.model?.pltAlph,
    spPltNi: tempModel?.spPltNi ?? d?.model?.spPltNi,
    spPltNiAlph: tempModel?.spPltNiAlph ?? d?.model?.spPltNiAlph,
    spPltAu: tempModel?.spPltAu ?? d?.model?.spPltAu,
    spPltAuAlph: tempModel?.spPltAuAlph ?? d?.model?.spPltAuAlph,
    pinCnt: tempModel?.pinCnt ?? d?.model?.pinCnt,
    ulTxt1: tempModel?.ulTxt1 ?? d?.model?.ulTxt1,
    ulTxt2: tempModel?.ulTxt2 ?? d?.model?.ulTxt2,
    ulCd1: tempModel?.ulCd1 ?? d?.model?.ulCd1,
    ulCd2: tempModel?.ulCd2 ?? d?.model?.ulCd2,
    specLine: tempModel?.specLine ?? d?.model?.specLine,
    specSpace: tempModel?.specSpace ?? d?.model?.specSpace,
    specDr: tempModel?.specDr ?? d?.model?.specDr,
    specPad: tempModel?.specPad ?? d?.model?.specPad,
  }
}


export const changeSalesModelAddNewModel = (
  model: salesModelsType | undefined,
  boardSelectList: selectType[],
  boardGroupSelectList: selectType[],
  metarialSelectList: selectType[],
  surfaceSelectList: selectType[],
  outSelectList: selectType[],
  smPrintSelectList: selectType[],
  smColorSelectList: selectType[],
  smTypeSelectList: selectType[],
  mkPrintSelectList: selectType[],
  mkColorSelectList: selectType[],
  mkTypeSelectList: selectType[],
  unitSelectList: selectType[],
) => {
  const jsonData = {
    inactiveYn: false,
    partner: { id: model?.partner?.id },
    prdNm: model?.prdNm ?? "",
    board: { id: model?.board?.id ?? boardSelectList?.[0]?.value },
    boardGroup: { id: model?.boardGroup?.id ?? boardGroupSelectList?.[0]?.value },
    mnfNm: model?.mnfNm ?? boardSelectList.find(f=>f.value === model?.boardGroup?.id)?.label ?? boardGroupSelectList?.[0]?.label,
    drgNo: model?.drgNo ?? "",
    thk: model?.thk,
    prdRevNo: model?.prdRevNo ?? "",
    layerEm: model?.layerEm ?? "L1",
    modelTypeEm: model?.modelTypeEm ?? "sample",
    copOut: model?.copOut,
    copIn: model?.copIn,
    material: { id: model?.material?.id ?? metarialSelectList?.[0]?.value },
    surface: { id: model?.surface?.id ?? surfaceSelectList?.[0]?.value },
    smPrint: { id: model?.smPrint?.id ?? smPrintSelectList?.[0]?.value },
    smColor: { id: model?.smColor?.id ?? smColorSelectList?.[0]?.value },
    smType: { id: model?.smType?.id ?? smTypeSelectList?.[0]?.value },
    mkPrint: { id: model?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value },
    mkColor: { id: model?.mkColor?.id ?? mkColorSelectList?.[0]?.value },
    mkType: { id: model?.mkType?.id ?? mkTypeSelectList?.[0]?.value },
    spPrint: { id: model?.spPrint?.id },
    spType: { id: model?.spType?.id },
    aprType: { id: model?.aprType?.id ?? outSelectList?.[0]?.value },
    vcutYn: model?.vcutYn ?? false,
    vcutType: { id: model?.vcutType?.id },
    vcutText: model?.vcutText,
    unit: { id: model?.unit?.id ?? unitSelectList?.[0]?.value },
    pcsW: model?.pcsW ?? 0,
    pcsL: model?.pcsL ?? 0,
    kitW: model?.kitW ?? 0,
    kitL: model?.kitL ?? 0,
    pnlW: model?.pnlW ?? 0,
    pnlL: model?.pnlL ?? 0,
    ykitW: model?.ykitW ?? 0,
    ykitL: model?.ykitL ?? 0,
    ypnlW: model?.ypnlW ?? 0,
    ypnlL: model?.ypnlL ?? 0,
    kitPcs: model?.kitPcs ?? 0,
    pnlKit: model?.pnlKit ?? 0,
    sthPnl: model?.sthPnl ?? 0,
    sthPcs: model?.sthPcs ?? 0,
    pltThk: model?.pltThk ?? 0,
    pltAlph: model?.pltAlph ?? 0,
    spPltNi: model?.spPltNi ?? 0,
    spPltNiAlph: model?.spPltNiAlph ?? 0,
    spPltAu: model?.spPltAu ?? 0,
    spPltAuAlph: model?.spPltAuAlph ?? 0,
    pinCnt: model?.pinCnt ?? 0,
  }

  return jsonData;
}

// 신양 모델 생성
export const changeModelAddNewModelSy = (
  tempData:salesOrderProcuctCUType, 
  metarialSelectList: selectType[],
  surfaceSelectList: selectType[],
  partnerId: string,
) => {
  let jsonData = {
    inactiveYn: false,
    partner: { id: partnerId },
    prdNm: tempData?.orderTit,
    mnfNm: tempData?.currPrdInfo?.boardGroup?.id,
    drgNo: tempData.currPrdInfo?.drgNo,
    thk: tempData.currPrdInfo?.thk,
    prdRevNo: tempData.currPrdInfo?.prdRevNo,
    copOut: tempData.currPrdInfo?.copOut,
    copIn: tempData.currPrdInfo?.copIn,
    material: { id: tempData.currPrdInfo?.material?.id ?? metarialSelectList?.[0]?.value },
    surface: { id: tempData.currPrdInfo?.surface?.id ?? surfaceSelectList?.[0]?.value },
    spPrint: { id: tempData.currPrdInfo?.spPrint?.id },
    spType: { id: tempData.currPrdInfo?.spType?.id },
    aprType: { id: tempData.currPrdInfo?.aprType?.id },
    vcutText: tempData.currPrdInfo?.vcutText,
    approvalYn: tempData?.approvalYn ?? true,
    pcsW: tempData.currPrdInfo?.pcsW,
    pcsL: tempData.currPrdInfo?.pcsL,
    pltThk: tempData.currPrdInfo?.pltThk ?? 25,
    pltAlph: tempData.currPrdInfo?.pltAlph ?? 0,
    spPltNi: tempData.currPrdInfo?.spPltNi ?? 4,
    spPltNiAlph: tempData.currPrdInfo?.spPltNiAlph,
    spPltAu: tempData.currPrdInfo?.spPltAu ?? 0.03,
    spPltAuAlph: tempData.currPrdInfo?.spPltAuAlph,
  }

  return jsonData;
}