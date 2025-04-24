import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";
import AntdInput from "@/components/Input/AntdInput";
import Items2 from "@/components/Item/Items2";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdSelect from "@/components/Select/AntdSelect";
import AntdSelectFill from "@/components/Select/AntdSelectFill";
import { LabelThin } from "@/components/Text/Label";
import { BuyOrderMtBadClmn, BuyOrderMtPriceClmn } from "@/data/columns/Buy";
import {
  materialGroupBadType,
  materialGroupType,
  materialPriceType,
} from "@/data/type/base/material_back";
import { buyOrderDetailType, buyOrderType } from "@/data/type/buy/cost";
import BlueBox from "@/layouts/Body/BlueBox";
import BoxHead from "@/layouts/Body/BoxHead";
import { Popup } from "@/layouts/Body/Popup";
import dayjs from "dayjs";
import { SetStateAction } from "react";

import Close from "@/assets/svg/icons/s_close.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Bag from "@/assets/svg/icons/bag.svg";
import Edit from "@/assets/svg/icons/edit.svg";
import Memo from "@/assets/svg/icons/memo.svg";
import Trash from "@/assets/svg/icons/trash.svg";
import { PlusOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import LabelItem from "@/components/Text/LabelItem";
import LabelItemH from "@/components/Text/LabelItemH";

interface Props {
  step: number;
  order: buyOrderType | null;
  setOrder: React.Dispatch<SetStateAction<buyOrderType | null>>;
  tot: number;
  setTot: React.Dispatch<SetStateAction<number>>;
  orderDetails: buyOrderDetailType[];
  setOrderDetails: React.Dispatch<SetStateAction<buyOrderDetailType[]>>;
  handleDataChange: (id: string, name: string, value: any) => void;
  setSelectMtIdx: (
    value: SetStateAction<{
      mtIdx: string;
      orderId: string;
      orderNo: number;
    } | null>
  ) => void;
  mtGrp: materialGroupType[];
  mtPrice: materialPriceType[];
  mtBad: materialGroupBadType[];
  badCnt: {
    badNm: string;
    badId: string;
    mtId: string;
    cnt: number;
  }[];
  setBadCnt: React.Dispatch<
    SetStateAction<
      {
        badNm: string;
        badId: string;
        mtId: string;
        cnt: number;
      }[]
    >
  >;
  handleDeleteMt: (index: number) => void;
}

const subTableStyles = {
  th_bg: "#FAFAFA",
  td_bg: "#FFFFFF",
  td_ht: "40px",
  th_ht: "40px",
  round: "0",
  th_fw: "bold",
  td_pd: "0",
};

const MtList: React.FC<Props> = ({
  step,
  order,
  setOrder,
  tot,
  setTot,
  orderDetails,
  setOrderDetails,
  handleDataChange,
  setSelectMtIdx,
  mtGrp,
  mtPrice,
  mtBad,
  badCnt,
  setBadCnt,
  handleDeleteMt,
}) => {
  const read = step > 1 ? true : false;

  return (
    <>
      <Popup
        title={step === 1 || step === 3 ? "발주 품목" : "품질 검사"}
        titleEtc={
          <div className="h-center flex-1 justify-end gap-8">
            {step > 1 && (
              <div className="h-center gap-8">
                <LabelThin label="도착일" />
                <AntdDatePicker
                  value={order?.orderRoot?.arrivalDt ?? null}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      orderRoot: {
                        ...order?.orderRoot,
                        arrivalDt: e,
                      },
                    });
                  }}
                  className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]"
                  suffixIcon={"cal"}
                />
                <LabelThin label="승인일" className="!ml-10" />
                <AntdDatePicker
                  value={order?.orderRoot?.approvalDt ?? null}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      orderRoot: {
                        ...order?.orderRoot,
                        approvalDt: e,
                      },
                    });
                  }}
                  afterDate={dayjs()}
                  placeholder="승인일 선택"
                  className="!w-full !rounded-2 !h-32 !border-[#D9D9D9]"
                  suffixIcon={"cal"}
                />
              </div>
            )}
            <div className="h-center gap-5 ml-8">
              총 발주 금액
              <AntdInput
                value={tot}
                onChange={(e) => setTot(Number(e.target.value))}
                type="number"
                readonly={read}
                className="!w-100"
              />
              원
            </div>
          </div>
        }
      >
        {step > 1 && orderDetails.length < 1 && (
          <div className="w-full h-full min-h-100 v-h-center">
            입력한 발주 품목이 없습니다.
          </div>
        )}
        {orderDetails.length > 0 &&
          orderDetails.map((item, index) => (
            <BlueBox key={index}>
              <BoxHead>
                <div className="w-24 h-24 bg-back rounded-4 v-h-center">
                  {index + 1}
                </div>
                <Items2
                  label1="원자재 그룹 선택"
                  size1={3}
                  children1={
                    <AntdSelectFill
                      options={[
                        { value: "직접입력", label: "직접입력" },
                        ...mtGrp.map((item) => ({
                          value: item.id,
                          label: item.mtGrpNm ?? "",
                        })),
                      ]}
                      value={item.materialGrpIdx}
                      onChange={(e) => {
                        if (e + "" === "직접입력") setSelectMtIdx(null);
                        handleDataChange(item.id ?? "", "materialGrpIdx", e);
                        handleDataChange(item.id ?? "", "materialIdx", null);
                        handleDataChange(item.id ?? "", "mtNm", null);
                      }}
                      placeholder="원자재 그룹"
                      styles={{ ht: "32px", bg: "#FFF", br: "2px" }}
                      readonly={read}
                    />
                  }
                />

                <Items2
                  label1="원자재 선택"
                  size1={3}
                  children1={
                    item.materialGrpIdx === "직접입력" ? (
                      <AntdInput
                        value={item.mtNm}
                        onChange={(e) =>
                          handleDataChange(
                            item.id ?? "",
                            "mtNm",
                            e.target.value
                          )
                        }
                        placeholder="원자재명 입력"
                        readonly={read}
                        memoView
                      />
                    ) : (
                      <AntdSelect
                        options={(
                          mtGrp.find((f) => f.id === item.materialGrpIdx)
                            ?.materials ?? []
                        ).map((item) => ({
                          value: item.id,
                          label: item.mtNm ?? "",
                        }))}
                        value={item.materialIdx}
                        onChange={(e) => {
                          if (typeof e === "string")
                            setSelectMtIdx({
                              mtIdx: e,
                              orderId: item.id ?? "",
                              orderNo: index + 1,
                            });
                          handleDataChange(item.id ?? "", "materialIdx", e);
                        }}
                        placeholder="원자재 선택"
                        styles={{ ht: "32px", bg: "#FFF", br: "2px" }}
                        readonly={read}
                      />
                    )
                  }
                />

                <Items2
                  label1="단위"
                  children1={
                    <AntdInput
                      value={item.mtOrderUnit}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderUnit",
                          e.target.value
                        )
                      }
                      placeholder="단위 입력"
                      readonly={read}
                      memoView
                    />
                  }
                />

                <Items2
                  label1="재질"
                  children1={
                    <AntdInput
                      value={item.mtOrderTxtur}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderTxtur",
                          e.target.value
                        )
                      }
                      placeholder="재질 입력"
                      readonly={read}
                      memoView
                    />
                  }
                />

                <Items2
                  label1="W"
                  size1={1}
                  children1={
                    <AntdInput
                      value={item.mtOrderSizeW}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderSizeW",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="W 입력"
                      readonly={read}
                    />
                  }
                />

                <Items2
                  label1="H"
                  size1={1}
                  children1={
                    <AntdInput
                      value={item.mtOrderSizeH}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderSizeH",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="H 입력"
                      readonly={read}
                    />
                  }
                />

                <Items2
                  label1="두께"
                  size1={1}
                  children1={
                    <AntdInput
                      value={item.mtOrderThk}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderThk",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="두께 입력"
                      readonly={read}
                      maxPoint={2}
                    />
                  }
                />

                <Items2
                  label1="무게"
                  size1={1}
                  children1={
                    <AntdInput
                      value={item.mtOrderWeight}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderWeight",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="무게 입력"
                      readonly={read}
                    />
                  }
                />

                <Items2
                  label1="수량"
                  size1={1}
                  children1={
                    <AntdInput
                      value={item.mtOrderQty}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderQty",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="수량 입력"
                      readonly={read}
                    />
                  }
                />

                <Items2
                  label1="단가"
                  size1={1}
                  children1={
                    <AntdInput
                      value={item.mtOrderInputPrice}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderInputPrice",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="단가 입력"
                      readonly={read}
                    />
                  }
                />

                <Items2
                  label1="금액"
                  children1={
                    <AntdInput
                      value={item.mtOrderAmount}
                      onChange={(e) =>
                        handleDataChange(
                          item.id ?? "",
                          "mtOrderAmount",
                          e.target.value
                        )
                      }
                      type="number"
                      placeholder="금액 입력"
                      readonly={read}
                    />
                  }
                />
                {step === 1 && (
                  <div className="flex-1 h-center justify-end">
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: [
                          {
                            label: (
                              <div className="text-[red] h-center gap-5">
                                <p className="w-16 h-16">
                                  <Trash />
                                </p>
                                삭제
                              </div>
                            ),
                            key: 0,
                            onClick: () => {
                              handleDeleteMt(index);
                            },
                          },
                        ],
                      }}
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <div className="w-24 h-24 cursor-pointer v-h-center">
                            <p className="w-16 h-16">
                              <Edit />
                            </p>
                          </div>
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                )}
              </BoxHead>
              {/* 단가 설정 */}
              {step === 1 && (
                <div>
                  {!item.materialIdx && item.materialGrpIdx !== "직접입력" && (
                    <div className="w-full h-50 v-h-center bg-white">
                      원자재 선택 시 구매처에 설정된 단가 목록을 확인할 수
                      있습니다.
                    </div>
                  )}
                  {item.materialIdx && (
                    <AntdTableEdit
                      columns={BuyOrderMtPriceClmn(
                        item,
                        orderDetails,
                        setOrderDetails
                      )}
                      data={mtPrice.filter(
                        (f) => f.material?.id === item.materialIdx
                      )}
                      styles={subTableStyles}
                    />
                  )}
                </div>
              )}
              {/* 불량 설정 */}
              {step === 2 && (
                <div className="flex items-start gap-20">
                  <div className="flex-1">
                    <AntdTableEdit
                      columns={BuyOrderMtBadClmn(item, badCnt, setBadCnt)}
                      data={mtBad.filter(
                        (f) => f.materialGroup?.id === item.materialGrpIdx
                      )}
                      styles={subTableStyles}
                    />
                  </div>
                  <div className="flex flex-col gap-15">
                    <LabelItemH label="도착 수량">
                      <AntdInput
                        value={item.mtOrderArrivalQty}
                        onFocus={() => {
                          if (
                            !item.mtOrderArrivalQty ||
                            item.mtOrderArrivalQty < 1
                          )
                            handleDataChange(
                              item.id ?? "",
                              "mtOrderArrivalQty",
                              item.mtOrderQty ?? 0
                            );
                        }}
                        onChange={(e) => {
                          handleDataChange(
                            item.id ?? "",
                            "mtOrderArrivalQty",
                            Number(e.target.value ?? 0)
                          );
                        }}
                        type="number"
                        className="!w-80"
                        styles={{ ht: "32px" }}
                      />
                    </LabelItemH>
                    <LabelItemH label="입고 수량">
                      <AntdInput
                        value={item.mtOrderInputQty}
                        onChange={(e) => {
                          handleDataChange(
                            item.id ?? "",
                            "mtOrderInputQty",
                            Number(e.target.value ?? 0)
                          );
                        }}
                        type="number"
                        className="!w-80"
                        styles={{ ht: "32px" }}
                      />
                    </LabelItemH>
                    <LabelItemH label="재고 수량">
                      <AntdInput
                        value={item.mtOrderInvenQty}
                        disabled
                        type="number"
                        className="!w-80"
                        styles={{ ht: "32px" }}
                      />
                    </LabelItemH>
                  </div>
                </div>
              )}
            </BlueBox>
          ))}
        {step === 1 && (
          <div
            className="h-40 gap-4 v-h-center cursor-pointer bg-[#EEEEEE45] text-[#00000085] rounded-8"
            onClick={() => {
              setOrderDetails((prev: buyOrderDetailType[]) => [
                ...prev,
                {
                  id: "new-" + prev.length + 1,
                  mtOrderQty: 0,
                  mtOrderSizeW: 0,
                  mtOrderSizeH: 0,
                  mtOrderWeight: 0,
                  mtOrderThk: 0,
                  mtOrderPrice: 0,
                  mtOrderInputPrice: 0,
                  mtOrderAmount: 0,
                },
              ]);
            }}
          >
            <PlusOutlined />
            <span>품목 추가하기</span>
          </div>
        )}
      </Popup>
    </>
  );
};

export default MtList;
