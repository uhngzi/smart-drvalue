import Search from "@/assets/svg/icons/s_search.svg";
import AllOpen from "@/assets/svg/icons/allOpen.svg";
import AllClose from "@/assets/svg/icons/allClose.svg";
import SettingFill from "@/assets/svg/icons/settingFill.svg";
import BlueCheck from "@/assets/svg/icons/blue_check.svg";

import { useEffect, useState } from "react";
import { treeType } from "@/data/type/componentStyles";
import { Button, Checkbox, CheckboxChangeEvent } from "antd";
import FullChip from "../Chip/FullChip";

/**
 * 커스텀 트리 활용 컴포넌트.
 *
 * - 선택, 체크박스, 자식 여부, 등을 prop으로 제어할 수 있습니다.
 * - select의 경우 Radio버튼 형식이라고 보시면 됩니다. 한개만 선택가능합니다.
 * - 그럴 경우가 없을것 같지만, 체크박스와 select를 동시에 사용하는건 권장하지 않습니다.
 *
 * @component
 * @property {treeType[]} data - 렌더링할 트리 데이터
 * @property {boolean} [isChild=true] - 자식 노드 여부, 기본값은 true 이므로 1뎁스만 이용하는 경우 isChild를 false로 설정
 * @property {boolean} [isSelect=false] - 선택 모드 활성화 여부
 * @property {string | null} [selectId] - 선택된 노드 ID, isSelect가 true일때만 사용할 수 있습니다.
 * @property {(id: any) => void} [setSelectId] - 선택 이벤트 발생 시 호출되는 함수, isSelect가 true일때만 사용할 수 있습니다.
 * @property {boolean} [isCheck=false] - 체크박스 모드 자식 활성화 여부
 * @property {{matchId: string, checkId: string}[]} [checkedData] - 체크된 노드 목록, isCheck가 true일때만 사용할 수 있습니다.
 * @property {(e: CheckboxChangeEvent, matchId: any) => void} [checkChange] - 체크박스 변경 이벤트 핸들러, isCheck가 true일때만 사용할 수 있습니다.
 * @property {boolean} [isCheckParents=false] - 체크박스 모드 부모 활성화 여부
 * @property {{matchId: string, checkId: string}[]} [checkedParentsData] - 체크된 부모 노드 목록, isCheckParents가 true일때만 사용할 수 있습니다.
 * @property {(e: CheckboxChangeEvent, matchId: any) => void} [checkParentsChange] - 부모 체크박스 변경 이벤트 핸들러, isCheckParents가 true일때만 사용할 수 있습니다.
 * @property {boolean} [notCollapsed] - 트리 전체 펴기 접기 활성화 여부
 */
interface Props {
  data: treeType[];
  isChild?: boolean;

  isSelect?: boolean;
  selectId?: string | null;
  setSelectId?: (id: any) => void;

  isCheck?: boolean;
  checkedData?: { matchId: string; checkId: string }[];
  checkChange?: (e: CheckboxChangeEvent, matchId: any) => void;
  notCollapsed?: boolean;

  isCheckParents?: boolean;
  checkedParentsData?: { matchId: string; checkId: string }[];
  checkParentsChange?: (e: CheckboxChangeEvent, matchId: any) => void;
}

const CustomTreeUsed: React.FC<Props> = ({
  data,
  isChild = true,

  isSelect = false,
  selectId,
  setSelectId,

  isCheck = false,
  checkedData,
  checkChange,
  notCollapsed,

  isCheckParents = false,
  checkedParentsData,
  checkParentsChange,
}) => {
  const [collapsedAll, setCollapsedAll] = useState<boolean>(false);
  const [list, setList] = useState<treeType[]>([]);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (data.length > 0) {
      setList(data);
    }
  }, [data]);

  const treeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (value === "") {
      setList(data);
    } else {
      // list와 list 안에 child를 flat하게 만들어서 검색
      const flatTree = data.flatMap((node) => [
        { id: node.id, label: node.label, open: node.open }, // 현재 노드 포함
        ...(node.children?.map((child) => ({
          id: child.id,
          label: child.label,
          open: node.open, // 부모의 `open` 상태를 유지할지 결정
        })) ?? []), // children을 추가
      ]);

      setList(flatTree.filter((item) => item.label.includes(value)));
    }
  };

  // isChild가 true일 때만 동작
  const handleShowList = (id: string) => {
    setList(
      list.map((item) =>
        item.id === id ? { ...item, open: !item.open } : item
      )
    );
  };

  const handleCollapseAll = () => {
    setCollapsedAll(!collapsedAll);
    setList(list.map((item) => ({ ...item, open: !item.open })));
  };

  // isSelect가 true일 때만 동작
  const handleSelect = (item: any) => {
    if (isSelect && setSelectId) {
      setSelectId(selectId === item.id ? null : item?.id);
    }
  };

  return (
    <div className="w-full flex flex-col gap-20 h-full overflow-y-auto">
      <div className="v-between-h-center">
        <p>전체 ({list.length})</p>
        <div className="h-center gap-8">
          {!isSearch ? (
            <p
              className="w-16 h-16 cursor-pointer"
              style={{ color: "#00000073" }}
              onClick={() => setIsSearch(true)}
            >
              <Search />
            </p>
          ) : (
            <div
              className="w-full h-35 flex gap-10 px-5 items-center"
              style={{ border: "1px solid #09BB1B" }}
            >
              <p className="w-24 h-24">
                <Search />
              </p>
              <input
                className="h-full focus:outline-none"
                style={{ border: "0" }}
                value={searchText}
                onChange={(e) => treeSearch(e)}
                onBlur={() => {
                  setSearchText("");
                  setIsSearch(false);
                  setList(data);
                }}
                placeholder="검색"
              />
            </div>
          )}

          {!notCollapsed && (
            <p
              className="cursor-pointer flex h-center gap-3"
              onClick={handleCollapseAll}
            >
              {collapsedAll ? (
                <Button size="small" type="text" style={{ color: "#00000073" }}>
                  <AllOpen /> 모두 펼치기
                </Button>
              ) : (
                <Button size="small" type="text" style={{ color: "#00000073" }}>
                  <AllClose /> 모두 접기
                </Button>
              )}
            </p>
          )}
        </div>
      </div>
      <div>
        {list.map((item) => (
          <div key={item.id} className="mx-5">
            <div
              className={`w-full h-30 h-center pl-5 gap-10 cursor-pointer h-45 hover:bg-[#f3f6f7] ${
                selectId === item.id ? "!bg-[#f3faff] justify-between" : ""
              }`}
              key={item.id}
              onClick={(e) => {
                // Checkbox, 버튼 클릭 시는 무시
                const target = e.target as HTMLElement;
                if (target.tagName === "INPUT") return;

                e.stopPropagation();
                if (isChild) {
                  handleShowList(item.id);
                } else {
                  handleSelect(item);
                }
              }}
            >
              {/* { item.open ? (
                  <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                    <CaretDownFilled />
                  </Button>
                ) : (
                  <Button className="!w-22 !h-22 !p-0" type="text" onClick={(e)=>{e.stopPropagation(); handleShowList(item.id)}}>
                    <CaretUpFilled />
                  </Button>
                )} */}
              <div className="flex h-center gap-10">
                <SettingFill />
                {isCheckParents ? (
                  <Checkbox
                    onChange={(e) =>
                      checkParentsChange?.(
                        e,
                        checkedParentsData?.find(
                          (chk) => chk.checkId === item.id
                        )?.matchId || null
                      )
                    }
                    value={item.id}
                    checked={checkedParentsData?.some(
                      (chk) => chk.checkId === item.id
                    )}
                  />
                ) : !isChild && isCheck ? (
                  <Checkbox
                    onChange={(e) =>
                      checkChange?.(
                        e,
                        checkedData?.find((chk) => chk.checkId === item.id)
                          ?.matchId || null
                      )
                    }
                    value={item.id}
                    checked={checkedData?.some(
                      (chk) => chk.checkId === item.id
                    )}
                  />
                ) : (
                  <></>
                )}
                <span className="flex text-left">{item.label}</span>
              </div>
              {isChild ? (
                <>
                  <div className="h-1 flex-1 bg-[#D9D9D9]" />
                  <span className="flex font-medium text-[#444444A6]">
                    {item.children?.length}
                  </span>
                </>
              ) : (
                selectId === item.id && <BlueCheck />
              )}
            </div>
            {isChild && (
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  item.open ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                }`}
                key={item.id + "child"}
              >
                {item.children?.map((child) => (
                  <div
                    key={child.id}
                    className={`w-full h-40 h-center gap-10 pl-20 cursor-pointer hover:bg-[#f3f6f7] ${
                      selectId === child.id ? "!bg-[#f3faff]" : ""
                    }`}
                    onClick={() => handleSelect(child)}
                  >
                    <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                    <div className="relative flex-1 flex v-between-h-center">
                      <div className="flex h-center text-left gap-8">
                        {isCheck ? (
                          <Checkbox
                            onChange={(e) =>
                              checkChange?.(
                                e,
                                checkedData?.find(
                                  (chk) => chk.checkId === child.id
                                )?.matchId || null
                              )
                            }
                            value={child.id}
                            checked={checkedData?.some(
                              (chk) => chk.checkId === child.id
                            )}
                          />
                        ) : (
                          <></>
                        )}
                        {child?.isInternal === false ? (
                          <FullChip label="외주" state="mint" />
                        ) : (
                          <></>
                        )}
                        <span>{child.label}</span>
                        {child?.wipPrcNm && (
                          <span className="h-center gap-8">
                            - <FullChip label="WIP" /> {child.wipPrcNm}
                          </span>
                        )}
                      </div>
                      {selectId === child.id && <BlueCheck />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTreeUsed;
