/*
 *
 * selectId 관련 주석처리는 추후에 사용될 수 있음
 *
 */

import Search from "@/assets/svg/icons/s_search.svg";
import Plus from "@/assets/svg/icons/s_plus_gray.svg";
import Edit from "@/assets/svg/icons/s_ellipsis.svg";
import Trash from "@/assets/svg/icons/red-trash.svg";
import AllOpen from "@/assets/svg/icons/allOpen.svg";
import AllClose from "@/assets/svg/icons/allClose.svg";
import CloseEye from "@/assets/svg/icons/close_eye.svg";
import BlueCheck from "@/assets/svg/icons/blue_check.svg";
import SettingFill from "@/assets/svg/icons/settingFill.svg";

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CUtreeType, treeType } from "@/data/type/componentStyles";
import {
  Button,
  Dropdown,
  Input,
  InputRef,
  MenuProps,
  Switch,
  Tooltip,
} from "antd";
import AntdInput from "../Input/AntdInput";
import dayjs from "dayjs";
import AntdDatePicker from "../DatePicker/AntdDatePicker";
import AntdSelect from "../Select/AntdSelect";
import FullChip from "../Chip/FullChip";

export type scrollType = {
  // 데이터 로딩중인지 판별
  loading: boolean;
  // 데이터 로딩을 시키기 위해 진행 (true일 경우 데이터 로딩하고 있는 중 / false일 경우 데이터 로딩 완료)
  setLoading: Dispatch<SetStateAction<boolean>>;
  // main의 총 개수
  mainTotCnt: number;
  // child의 현재 데이터 수
  childCnt?: number;
  // child의 총 데이터 수
  childTotCnt?: number;
};

interface Props {
  open?: boolean;
  data: treeType[];
  isChild?: boolean;
  isCheckUse?:
    | false
    | {
        checkId: string | null;
        setCheckId: (id: string | null) => void;
        child?: boolean;
      };
  onSubmit: (newData: any) => void;
  setAddList: Dispatch<SetStateAction<CUtreeType[]>>;
  setEditList: Dispatch<SetStateAction<CUtreeType[]>>;
  setDelList: Dispatch<SetStateAction<{ type: string; id: string }[]>>;
  addEdits?: {
    info?: any[];
    childInfo?: any[];
    setInfo?: Dispatch<SetStateAction<any[]>>;
    setChildInfo?: Dispatch<SetStateAction<any[]>>;
    addParentEditList?: {
      type: string;
      key: string;
      name: string;
      selectData?: any[];
    }[];
    addChildEditList?: {
      type: string;
      key: string;
      name: string;
      selectData?: any[];
    }[];
  };
  notCollapsed?: boolean;

  // 스크롤 할 때마다 값을 가져오기 위한 변수
  scroll?: scrollType;
}

const CustomTree: React.FC<Props> = ({
  open, // 모달에서 트리를 사용하는 경우에만 사용됨, 모달이 열려있는지 여부
  data,
  isChild = true,
  isCheckUse = false,
  onSubmit,
  setAddList,
  setEditList,
  setDelList,
  addEdits = {
    info: [],
    setInfo: () => {},
    childInfo: [],
    setChildInfo: () => {},
    addParentEditList: [],
    addChildEditList: [],
  },
  notCollapsed,
  scroll,
}) => {
  const [treeName, setTreeName] = useState<string>("");
  const [ordNo, setOrdNo] = useState<string | number>("");

  const customEditItems = (
    type: "main" | "child",
    id: string,
    parentId?: string,
    useYn?: boolean
  ) => (
    <div
      className={`flex flex-col gap-12 px-16 py-9 bg-white rounded-8 w-[${
        (addEdits?.addParentEditList?.length ?? 0) < 1 ? "200" : "350"
      }px]`}
      style={{
        boxShadow:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.0",
      }}
    >
      <div className="relative h-center ">
        <AntdInput
          className="w-full"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter") {
              const inputValue = (e.target as HTMLInputElement).value;
              handleDataUpdate(type, id, inputValue, parentId);
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
        <span
          className="absolute right-5 text-12"
          style={{ color: "#00000073" }}
        >
          Enter
        </span>
      </div>
      {type === "main" &&
        (addEdits?.addParentEditList ?? []).map((edit, index) => (
          <div key={`addEdits-${index}`}>
            <label className="text-12">{edit.name}</label>
            {(edit.type === "input" || edit.type === "number") && (
              <div className="relative h-center">
                <AntdInput
                  className="w-full"
                  type={edit.type === "number" ? "text" : "text"}
                  value={
                    (addEdits.info ?? []).find((v) => v.id === id)?.[
                      edit.key
                    ] || ""
                  }
                  onChange={(e) =>
                    addEdits.setInfo?.((prev) =>
                      prev.map((item) =>
                        item.id === id
                          ? { ...item, [edit.key]: e.target.value }
                          : item
                      )
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") {
                      const inputValue = (e.target as HTMLInputElement).value;
                      handleDataUpdate(type, id, treeName, parentId, {
                        [edit.key]: inputValue,
                      });
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
                <span
                  className="absolute right-5 text-12"
                  style={{ color: "#00000073" }}
                >
                  Enter
                </span>
              </div>
            )}
            {edit.type === "select" && (
              <div key={`addEdits-${index}`} className="relative h-center">
                <AntdSelect
                  className="w-full"
                  options={edit.selectData || []}
                  value={
                    (addEdits?.info ?? []).find((v) => v.id === id)?.[
                      edit.key
                    ] || null
                  }
                  onChange={(value) =>
                    handleDataUpdate(type, id, treeName, parentId, {
                      [edit.key]: value,
                    })
                  }
                />
              </div>
            )}
          </div>
        ))}
      {type === "child" &&
        (addEdits.addChildEditList ?? []).map((edit, index) => (
          <div
            key={`addEditsChild-${index}`}
            className={`${edit.type === "switch" ? "v-between-h-center" : ""} `}
          >
            <label className="text-12">{edit.name}</label>
            {(edit.type === "input" || edit.type === "number") && (
              <div className="relative h-center">
                <AntdInput
                  className="w-full"
                  type={edit.type === "number" ? "number" : "text"}
                  value={
                    (addEdits.childInfo ?? []).find((v) => v.id === id)?.[
                      edit.key
                    ] || ""
                  }
                  onChange={(e) =>
                    addEdits.setChildInfo?.((prev) =>
                      prev.map((item) =>
                        item.id === id
                          ? { ...item, [edit.key]: e.target.value }
                          : item
                      )
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return;
                    if (e.key === "Enter") {
                      const inputValue = (e.target as HTMLInputElement).value;
                      handleDataUpdate(type, id, treeName, parentId, {
                        [edit.key]: inputValue,
                      });
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
                <span
                  className="absolute right-5 text-12"
                  style={{ color: "#00000073" }}
                >
                  Enter
                </span>
              </div>
            )}
            {edit.type === "select" && (
              <div key={`addEdits-${index}`} className="relative h-center">
                <AntdSelect
                  className="w-full"
                  options={edit.selectData || []}
                  value={
                    (addEdits.childInfo ?? []).find((v) => v.id === id)?.[
                      edit.key
                    ] || null
                  }
                  onChange={(value) =>
                    handleDataUpdate(type, id, treeName, parentId, {
                      [edit.key]: value,
                    })
                  }
                />
              </div>
            )}
            {edit.type === "switch" && (
              <div key={`addEdits-${index}`} className="">
                <Switch
                  size="small"
                  value={
                    (addEdits.childInfo ?? []).find((v) => v.id === id)?.[
                      edit.key
                    ] || false
                  }
                  onChange={(value) => {
                    handleDataUpdate(type, id, treeName, parentId, {
                      [edit.key]: value,
                    });
                  }}
                />
              </div>
            )}
          </div>
        ))}
      <div>
        <label className="text-12">순서</label>
        <div className="relative h-center">
          <AntdInput
            className="w-full"
            styles={{ ta: "left" }}
            type="number"
            value={ordNo}
            onChange={(e) => setOrdNo(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (e.key === "Enter") {
                handleDataUpdate(type, id, treeName, parentId);
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
          <span
            className="absolute right-5 text-12"
            style={{ color: "#00000073" }}
          >
            Enter
          </span>
        </div>
      </div>
      {useYn && (
        <div className="flex h-center justify-between mt-10">
          <span className="flex text-12  gap-5">
            <BlueCheck />
            사용여부
          </span>
          <Switch size="small" />
        </div>
      )}
      <div className="flex h-center justify-between mt-10">
        <span className="flex text-12  gap-5">
          <CloseEye />
          숨기기
        </span>
        <Switch size="small" />
      </div>
      <Button
        type="text"
        className="justify-start p-0 h-center gap-5 text-12"
        onClick={() => handleDeleteList([{ id, type }])}
      >
        <Trash />
        삭제
      </Button>
    </div>
  );

  const [collapsedAll, setCollapsedAll] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const newInputRef = useRef<InputRef | null>(null);

  const [focusId, setFocusId] = useState<string | null>(null);
  // const [selectId, setSelectId] = useState<{id: string, type: string}[]>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (isCheckUse) {
      isCheckUse.setCheckId(null);
    }
    setList(data);
  }, [open]);

  useEffect(() => {
    // if(data.length > 0) {
    setFocusId(null);
    setList(data);
    // }
  }, [data]);

  useEffect(() => {
    const hasNewItem = Array.isArray(list)
      ? list.some(
          (item) =>
            item.id.includes("new") ||
            item.children?.some((child: any) => child.id.includes("new"))
        )
      : [];
    if (hasNewItem && newInputRef.current) {
      newInputRef.current.focus();
    }
  }, [list]);

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

  // tree 데이터를 수정할때 사용하는 함수
  const handleDataUpdate = async (
    type: "main" | "child",
    id: string,
    value: any,
    parentsId?: string,
    adds?: any
  ) => {
    console.log(type, id, value, parentsId, adds);
    if (type === "main") {
      const addChk = (addEdits.addParentEditList ?? []).length > 0;
      let edits = addChk ? (addEdits.info ?? []).find((v) => v.id === id) : {};
      if (adds) {
        const newEdit = (addEdits.info ?? []).map((item) =>
          item.id === id ? { ...item, ...adds } : item
        );
        addEdits.setInfo?.(newEdit);
        edits = newEdit.find((v) => v.id === id);
      }

      setEditList((prev) =>
        prev.some((item) => item.id === id)
          ? prev.map((item) =>
              item.id === id
                ? { ...item, ...edits, label: value, ordNo: ordNo }
                : item
            )
          : [...prev, { id, ...edits, label: value, ordNo: ordNo }]
      );
      setList((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...edits, label: value, ordNo: ordNo }
            : item
        )
      );
    } else {
      const addChk = (addEdits.addChildEditList ?? []).length > 0;
      let edits = addChk
        ? (addEdits.childInfo ?? []).find((v) => v.id === id)
        : {};
      if (adds) {
        const newEdit = (addEdits.childInfo ?? []).map((item) =>
          item.id === id ? { ...item, ...adds } : item
        );
        addEdits.setChildInfo?.(newEdit);
        edits = newEdit.find((v) => v.id === id);
      }
      setEditList((prev) =>
        prev.some((item) => item.id === id)
          ? prev.map((item) =>
              item.id === id
                ? { ...item, ...edits, label: value, ordNo: ordNo }
                : item
            )
          : [
              ...prev,
              { id, ...edits, label: value, parentId: parentsId, ordNo: ordNo },
            ]
      );
      setList((prev) => {
        const newList = prev.map((item) => {
          if (item.id === parentsId) {
            const updatedChildren = item.children?.map(
              (child: any) =>
                // 자식 항목 중에서 동일한 id가 있으면 수정
                child.id === id
                  ? { ...child, ...edits, label: value, ordNo: ordNo } // 해당 자식 수정
                  : child // 그대로 두기
            );

            return {
              ...item,
              children: updatedChildren || item.children, // 자식 항목 갱신
            };
          }
          return item;
        });
        return newList;
      });
    }

    // setList((prev) => {
    //   console.log('test')
    //   if (type === 'main') {

    //     return prev.map(item =>
    //       // 기존에 동일한 id가 있으면 해당 항목 수정, 없으면 새 항목 추가
    //       item.id === id
    //         ? { ...item, label: value } // 기존 항목 수정
    //         : item // 그대로 두기
    //     );
    //   } else {
    //     const newList = prev.map((item) => {
    //       if (item.id === parentsId) {
    //         const updatedChildren = item.children?.map(child =>
    //           // 자식 항목 중에서 동일한 id가 있으면 수정
    //           child.id === id
    //             ? { ...child, label: value } // 해당 자식 수정
    //             : child // 그대로 두기
    //         );

    //         return {
    //           ...item,
    //           children: updatedChildren || item.children, // 자식 항목 갱신
    //         };
    //       }
    //       return item;
    //     });
    //     return newList;
    //   }
    // });
  };

  // tree에 데이터를 추가할때 사용하는 함수
  const handleDataAdd = async (
    type: "main" | "child",
    id: string,
    value: string,
    parentsId?: string
  ) => {
    let length = 0;
    const uniqueKey = Date.now();
    console.log(type, id, value, parentsId, uniqueKey);

    setList((prev) => {
      if (type === "main") {
        length = list.length;

        setAddList((prev) => [
          ...prev,
          { id: `temp-${uniqueKey}`, label: value, ordNo: list.length },
        ]);
        return [
          ...prev.filter((item) => !item.id.includes("new")),
          {
            id: `temp-${uniqueKey}`,
            label: value,
            children: [],
            open: true,
            ordNo: list.length,
          },
        ];
      } else {
        const newList = prev.map((item) => {
          if (item.id === parentsId) {
            length = (item.children ?? []).length;

            return {
              ...item,
              children: [
                ...(item.children ?? []).filter(
                  (child: any) => !child.id.includes("new")
                ),
                {
                  id: `temp-${uniqueKey}`,
                  label: value,
                  ordNo: (item.children ?? []).length,
                },
              ],
            };
          }
          return item;
        });
        const newAddItem = {
          id: `temp-${uniqueKey}`,
          label: value,
          parentId: parentsId,
          ordNo: length,
        };
        setAddList((prev) => [...prev, newAddItem]);
        return newList;
      }
    });
  };
  const handleSelect = (item: any) => {
    if (!isCheckUse) {
      return;
    }
    const selectId = item.id;
    isCheckUse.setCheckId(isCheckUse.checkId === selectId ? null : selectId);
    // const selectId = [{id: item.id, type:'main'}, ...item.children?.map((child: any) => ({id: child.id, type:'child'})) || []];
    // setSelectId(prev =>
    //   prev.some(selectedId => selectId.some(v => v.id.includes(selectedId.id)))
    //     ? prev.filter(selectedId => !selectId.some(v => v.id.includes(selectedId.id)))
    //     : [...prev, ...selectId]
    // );
  };
  const handleFocus = (id: string) => {
    if (id === focusId) {
      setFocusId(null);
    } else {
      setFocusId(id);
    }
  };

  const handleBlur = () => {
    setFocusId(null);
    setList((prev) =>
      prev
        .filter((item) => !item.id.includes("new")) // 상위 리스트 필터링
        .map((item) => ({
          ...item,
          children: item.children
            ? item.children.filter((child: any) => !child.id.includes("new")) // children 필터링
            : [],
        }))
    );
  };

  const handleAddList = () => {
    setList([
      { id: "new" + (list.length + 1), label: "", children: [], open: true },
      ...list,
    ]);
  };

  const handleAddChild = (id: string) => {
    setList(
      list?.map((item) =>
        item.id === id
          ? {
              ...item,
              children: item.children?.length
                ? [
                    {
                      id: "newchild" + (Number(item.children?.length) + 1),
                      label: "",
                    },
                    ...item.children,
                  ]
                : [
                    {
                      id: "newchild" + (Number(item.children?.length) + 1),
                      label: "",
                    },
                  ],
            }
          : item
      )
    );
  };

  const handleDeleteList = (idList: { id: string; type: string }[]) => {
    const list = idList.length > 0 ? idList : []; // selectId;
    const removeItemById = (items: any) => {
      return items
        .filter((item: any) => !list.some((v) => v.id.includes(item.id))) // 현재 리스트에서 ID 일치하는 항목 삭제
        .map((item: any) => ({
          ...item,
          children: item.children ? removeItemById(item.children) : undefined, // children도 검사하여 삭제
        }));
    };
    setDelList((prev) => [...prev, ...list]);
    setList((prevList) => removeItemById(prevList));
  };

  const handleChangeList = (id: string, value: string) => {
    setList(
      list?.map((item) => (item.id === id ? { ...item, label: value } : item))
    );
  };

  const handleChangeChild = (
    parentId: string,
    childId: string,
    value: string
  ) => {
    setList(
      list?.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: item.children?.map((child: any) =>
                child.id === childId ? { ...child, label: value } : child
              ),
            }
          : item
      )
    );
  };

  const handleShowList = (id: string) => {
    setList(
      list?.map((item) =>
        item.id === id ? { ...item, open: !item.open } : item
      )
    );
  };

  const handleCollapseAll = () => {
    setCollapsedAll(!collapsedAll);
    setList(list?.map((item) => ({ ...item, open: !item.open })));
  };

  return (
    <section className="flex flex-col h-full justify-between">
      <div
        className="w-full flex flex-col gap-20 h-full min-h-[500px] overflow-y-auto"
        onScroll={(e) => {
          if (!scroll) {
            return;
          }

          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          const threshold = 10;

          if (
            // 스크롤이 가까이 근접했고
            scrollTop + clientHeight >= scrollHeight - threshold &&
            // 데이터가 세팅되어있을 때
            !scroll.loading
          ) {
            // data.length는 main 데이터의 개수와 동일하다.
            if (scroll.mainTotCnt > data.length) {
              // 가지고 있는 현재 메인 데이터 개수보다 부모 총 개수가 더 많을때
              scroll.setLoading(true);
            } else if (
              scroll.childCnt &&
              scroll.childTotCnt &&
              scroll.childTotCnt > scroll.childCnt
            ) {
              // 가지고 있는 현재 자식 데이터 개수보다 자식 총 데이터 개수가 더 많을때
              scroll.setLoading(true);
            }
          }
        }}
      >
        {/* 헤더 영역 */}
        <div className="v-between-h-center">
          <p className="min-w-70">전체 ({list.length})</p>
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
                <AntdInput
                  className="h-full focus:outline-none"
                  styles={{ bw: "0" }}
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
            <p className="w-16 h-16 cursor-pointer" onClick={handleAddList}>
              <Plus />
            </p>
            {!notCollapsed && (
              <p
                className="cursor-pointer flex h-center gap-3"
                onClick={handleCollapseAll}
              >
                {collapsedAll ? (
                  <Button
                    size="small"
                    type="text"
                    style={{ color: "#00000073" }}
                  >
                    <AllOpen /> 모두 펼치기
                  </Button>
                ) : (
                  <Button
                    size="small"
                    type="text"
                    style={{ color: "#00000073" }}
                  >
                    <AllClose /> 모두 접기
                  </Button>
                )}
              </p>
            )}
          </div>
        </div>

        {/* 리스트 영역 */}
        <div>
          {Array.isArray(list) &&
            list.map((item) => {
              // ----- 부모 영역 내 새 값 출력 시작 -----
              if (item?.id?.includes("new")) {
                return (
                  <div
                    className="w-full h-40 h-center pl-10 gap-10"
                    key={item.id}
                  >
                    <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                    <div className="relative flex-1 pr-10">
                      <AntdInput
                        ref={newInputRef}
                        className="w-full h-35 !focus:outline-none !focus:ring-2 !focus:ring-[#09BB1B]"
                        styles={{ bc: "#09BB1B", bw: "2px" }}
                        value={item.label}
                        onChange={(e) =>
                          handleChangeList(item.id, e.target.value)
                        }
                        onFocus={() => handleFocus(item.id)}
                        onBlur={handleBlur}
                        placeholder="새 항목 입력"
                        onKeyDown={(e) => {
                          if (e.nativeEvent.isComposing) return;
                          if (e.key === "Enter") {
                            handleDataAdd("main", item.id, item.label);
                            // e.currentTarget.blur();
                          }
                        }}
                      />
                      {focusId === item.id && (
                        <span className="absolute right-15 top-1/2 transform -translate-y-1/2">
                          엔터 시 저장
                        </span>
                      )}
                    </div>
                  </div>
                );
                // ----- 부모 영역 내 새 값 출력 끝 -----
              } else {
                return (
                  // ----- 부모 영역 내 기존 값 출력 시작 -----
                  <div key={item.id}>
                    <div
                      className={`w-full h-40 h-center pl-5 gap-10 hover:bg-[#0000000a] cursor-pointer ${
                        // 선택 모드일 경우 스타일 설정
                        isCheckUse && !isCheckUse.child
                          ? isCheckUse.checkId === item.id
                            ? "!bg-[#f3faff]"
                            : ""
                          : ""
                      } ${
                        isCheckUse && !isCheckUse.child ? "cursor-pointer" : ""
                      }`}
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowList(item.id);

                        if (isCheckUse && !isCheckUse.child) {
                          isCheckUse.setCheckId(
                            // 선택 모드에서 기존 값과 동일할 경우 체크 해제
                            isCheckUse.checkId === item.id ? null : item.id
                          );
                        }
                      }}
                      onMouseEnter={() => setHoverId(item.id)}
                      onMouseLeave={() => setHoverId(null)}
                    >
                      <SettingFill />
                      <span className="flex-1 text-left">{item.label}</span>
                      {/* 선택했을 경우 체크 표시 우선 */}
                      {isCheckUse &&
                      isCheckUse.checkId == item.id &&
                      !isCheckUse.child ? (
                        <BlueCheck />
                      ) : (
                        // 마우스 오버 시
                        <div
                          className={`${
                            item.id === hoverId ? "visible" : "invisible"
                          }`}
                        >
                          {/* 신규 값일 경우 ID값이 존재하지 않으므로 자식 요소 추가 방지 */}
                          {!(item?.id ?? "").includes("temp") && isChild && (
                            // 추가 버튼
                            <Button
                              size="small"
                              type="text"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddChild(item.id);
                              }}
                            >
                              <Plus />
                            </Button>
                          )}
                          {/* 수정 버튼 */}
                          <Button
                            size="small"
                            type="text"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTreeName(item.label);
                              setOrdNo(item?.ordNo);
                            }}
                          >
                            <Dropdown
                              trigger={["click"]}
                              dropdownRender={() =>
                                customEditItems("main", item.id)
                              }
                            >
                              <a onClick={(e) => e.preventDefault()}>
                                <div
                                  className="w-full h-full v-h-center cursor-pointer"
                                  onClick={() => {}}
                                >
                                  <p className="w-16 h-16 v-h-center">
                                    <Edit />
                                  </p>
                                </div>
                              </a>
                            </Dropdown>
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* ----- 부모 영역 내 자식 값 출력 시작 ----- */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        item.open
                          ? "max-h-full opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                      key={item.id + "child"}
                    >
                      {item.children?.map((child: any) => {
                        if (child?.id?.includes("new")) {
                          return (
                            // ----- 자식 영역 내 새 값 출력 시작 -----
                            <div
                              key={child.id}
                              className="w-full h-40 h-center gap-10 pl-25"
                            >
                              <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                              <div className="relative flex-1 pr-10">
                                <AntdInput
                                  ref={newInputRef}
                                  className="w-full h-35 pl-5"
                                  styles={{ bc: "#09BB1B", bw: "2px" }}
                                  value={child.label}
                                  onChange={(e) =>
                                    handleChangeChild(
                                      item.id,
                                      child.id,
                                      e.target.value
                                    )
                                  }
                                  onFocus={() => handleFocus(child.id)}
                                  onBlur={handleBlur}
                                  onKeyDown={(e) => {
                                    if (e.nativeEvent.isComposing) return;
                                    if (e.key === "Enter") {
                                      handleDataAdd(
                                        "child",
                                        child.id,
                                        child.label,
                                        item.id
                                      );
                                    }
                                  }}
                                />
                                {focusId === child.id && (
                                  <span className="absolute right-15 top-1/2 transform -translate-y-1/2">
                                    엔터 시 저장
                                  </span>
                                )}
                              </div>
                            </div>
                            // ----- 자식 영역 내 새 값 출력 끝 -----
                          );
                        } else {
                          return (
                            // ----- 자식 영역 내 기존 값 출력 시작 -----
                            <Button
                              type="text"
                              className={`w-full h-40 h-center !pl-30 !gap-10 ${
                                isCheckUse && isCheckUse.checkId === child.id
                                  ? "!bg-[#f3faff]"
                                  : ""
                              }`}
                              key={child.id}
                              style={{
                                transition: "none",
                                animation: "none",
                                WebkitTransition: "none",
                                MozTransition: "none",
                                OTransition: "none",
                              }}
                              onClick={() => handleSelect(child)}
                              onMouseEnter={() => setHoverId(child.id)}
                              onMouseLeave={() => setHoverId(null)}
                            >
                              <div className="w-5 h-5 bg-[#ddd] rounded-50" />
                              {/* ~ isInternal, wipPrcNm :: 공정 트리 관련 요소 ~ */}
                              <div className="h-center flex-1 text-left gap-8">
                                {child.isInternal === false ? (
                                  <FullChip label="외주" state="mint" />
                                ) : (
                                  <></>
                                )}
                                <span className="">{child.label}</span>
                                {child.wipPrcNm && (
                                  <span className="h-center gap-8">
                                    - <FullChip label="WIP" /> {child.wipPrcNm}
                                  </span>
                                )}
                              </div>

                              {/* 마우스 오버 시 */}
                              {isCheckUse &&
                                isCheckUse.checkId === child.id && (
                                  <BlueCheck />
                                )}
                              <div
                                className={`${
                                  child.id === hoverId ? "visible" : "invisible"
                                }`}
                              >
                                {/* 수정 버튼 */}
                                <Button
                                  size="small"
                                  type="text"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Dropdown
                                    onOpenChange={(visible) => {
                                      if (visible) {
                                        setTreeName(child.label);
                                        setOrdNo(Number(child?.ordNo));
                                      }
                                    }}
                                    trigger={["click"]}
                                    dropdownRender={() =>
                                      customEditItems(
                                        "child",
                                        child.id,
                                        item.id
                                      )
                                    }
                                  >
                                    <a onClick={(e) => e.preventDefault()}>
                                      <div
                                        className="w-full h-full v-h-center cursor-pointer"
                                        onClick={() => {}}
                                      >
                                        <p className="w-16 h-16 v-h-center">
                                          <Edit />
                                        </p>
                                      </div>
                                    </a>
                                  </Dropdown>
                                </Button>
                              </div>
                              {/* ) : (
                            <BlueCheck/>
                          )} */}
                            </Button>
                          );
                          // ----- 자식 영역 내 기존 값 출력 끝 -----
                        }
                      })}
                    </div>
                    {/* ----- 부모 영역 내 자식 값 출력 끝 ----- */}
                  </div>
                  // ----- 부모 영역 내 기존 값 출력 끝 -----
                );
              }
            })}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="pt-20 pb-10 ">
        <Button
          type="primary"
          size="large"
          onClick={() => {
            onSubmit(list);
          }}
          className="w-full flex h-center gap-8 !h-[50px] "
          style={{
            background: "linear-gradient(90deg, #008A1E 0%, #03C75A 100%)",
          }}
        >
          <span>저장하기</span>
        </Button>
      </div>
    </section>
  );
};

export default CustomTree;
