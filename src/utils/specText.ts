import { baseSpecType } from "@/data/type/base/spec";

/**
 * @desc 견적 특수사양 텍스트 만드는 util
 */
export function specialSpecToText(spec:baseSpecType) {
  let specText = "";
  specText += spec?.process?.prcNm ? `${spec?.process?.prcNm} ` : "" 
  specText += spec?.remark ? `${spec?.remark}: ` : ": " 
  specText += spec?.minRange || ""
  specText += spec?.maxRange ? `~${spec?.maxRange}` : ""
  specText += spec?.minRange ? spec?.unit?.cdNm ? `${spec?.unit.cdNm}, ` : ", " : ""
  specText += spec?.addCost ? `추가비용: ${spec?.addCost.toLocaleString()}원 ` : ""
  specText += spec?.weight ? `추가(비율): ${spec?.weight}%` : ""
  
  return specText
}