import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dropdown, Space } from "antd";
import dayjs from "dayjs";

import Ordering from "@/assets/svg/icons/ordering.svg";
import More from "@/assets/svg/icons/edit.svg";
import Paste from "@/assets/svg/icons/paste.svg";
import Edit from "@/assets/svg/icons/memo.svg";
import Trash from "@/assets/svg/icons/trash.svg";

const SortableMemoItem = ({
  item,
  idx,
  handleEdit,
  handlePaste,
  handleDelete,
  refs,
  expandedList,
  clampedList,
  toggleExpanded,
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-full p-10 pb-20 flex flex-col bg-[#b0cdeb25] relative"
    >
      <div className="w-full h-center gap-10 h-24">
        <Ordering />
        <p className="flex-1 text-[#00000045] font-300 leading-[150%]">{dayjs(item.createdAt).format("YYYY-MM-DD")}</p>
        <Dropdown trigger={['click']} menu={{ items:[
          {
            label:
              <div className="h-center gap-5">
                <p className="w-16 h-16"><Edit /></p>
                메모 수정
              </div>,
            key: 0,
            onClick:()=>{
              handleEdit();
            }
          },
          {
            label:
              <div className="h-center gap-5">
                <p className="w-16 h-16"><Paste /></p>
                내용 복사
              </div>,
            key: 1,
            onClick:()=>{
              handlePaste();
            }
          },
          {
            label:
              <div className="text-[red] h-center gap-5">
                <p className="w-16 h-16"><Trash /></p>
                삭제
              </div>,
            key: 2,
            onClick:()=>{
              handleDelete(item.id);
            }
          }
        ]}}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <div className="w-24 h-24 cursor-pointer v-h-center">
                <p className="w-16 h-16"><More/></p>
              </div>
            </Space>
          </a>
        </Dropdown>
      </div>

      {/* 메모 내용 */}
      <div
        ref={(el) => {
          refs.current[idx] = el;
        }}
        className={`px-5 whitespace-pre-line transition-all duration-200 ${
          expandedList[idx] ? "" : "line-clamp-4"
        }`}
      >
        {item.memo}
      </div>
      {clampedList[idx] && (
        <div
          className="w-full cursor-pointer v-h-center h-15"
          onClick={() => toggleExpanded(idx)}
        >
          {expandedList[idx] ? "접기" : "더보기"}
        </div>
      )}

      {/* 메모 접히는 부분 */}
      <div
        className="w-20 h-20 absolute bottom-0 right-0"
        style={{backgroundImage: 'linear-gradient(to top left, #FFF 50%, #00000020 50%)'}}
      />
    </div>
  )
}

export default SortableMemoItem;