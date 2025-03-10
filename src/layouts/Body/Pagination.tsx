import Image from "next/image";
import { MenuProps } from "antd/lib";
import { Button, Dropdown, Pagination, Tooltip } from "antd";

import { MoreOutlined } from "@ant-design/icons";

import Excel from "@/assets/png/excel.png"
import Print from "@/assets/png/print.png"
import { LabelMedium } from "@/components/Text/Label";

interface Props {
  totalData: number;
  pagination: {
    current: number;
    size: number;
  }
  handleMenuClick?: (key:number) => void;
  onChange?: (page: number, size: number) => void;
  title?: string;
  titleBtn?: any;
}

export const ListPagination: React.FC<Props> = ({
  totalData,
  pagination,
  handleMenuClick,
  onChange,
  title,
  titleBtn,
}) => {
  const items: MenuProps['items'] = [
    {
      label: <span className="text-12">엑셀 다운로드</span>,
      key: 1,
      icon: <Image src={Excel} alt="Excel" width={16} height={16} />,
      onClick: ()=>{
        handleMenuClick?.(1)
      }
    },
    {
      label: <span className="text-12">프린트</span>,
      key: 2,
      icon: <Image src={Print} alt="Print" width={16} height={16} />,
      onClick: ()=>{handleMenuClick?.(2)}
    },
  ]
  // 100개 이상일 경우 "전체 보기" 옵션 추가 (totalData와 비교)
  const pageSizeOptions = ["10", "20", "50", "100"];
  if (totalData > 100) {
    pageSizeOptions.push(totalData.toString()); // "전체 보기" 옵션 추가
  }

  return (
    <div className="flex w-full h-50 v-between-h-center">
      <div>
        {title && <LabelMedium label={title}/>}
        {titleBtn}
      </div>
      <div className="h-50 gap-20 h-center">
        <span>총 {totalData}건</span>
        <Pagination 
          size="small"
          defaultCurrent={1}
          current={pagination.current}
          total={totalData}
          onChange={(page: number, size: number) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onChange?.(page, size);
          }}
          pageSize={pagination.size}
          showSizeChanger={true}
          pageSizeOptions={pageSizeOptions}
          locale={{ items_per_page: "건씩 보기" }}
        />
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          placement="bottomCenter"
          getPopupContainer={() => document.body}
        >
          <Tooltip title="엑셀 다운로드 또는 프린트를 할 수 있어요">
          <Button type="text" size="small" icon={<MoreOutlined />} style={{backgroundColor: "#E9EDF5"}}/>
          </Tooltip>
        </Dropdown>
      </div>
    </div>
  )
}