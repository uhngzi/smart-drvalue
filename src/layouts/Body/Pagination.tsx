import Image from "next/image";
import { MenuProps } from "antd/lib";
import { Button, Dropdown, Pagination } from "antd";

import { MoreOutlined } from "@ant-design/icons";

import Excel from "@/assets/png/excel.png"
import Print from "@/assets/png/print.png"

interface Props {
  totalData: number;
  pagination: {
    current: number;
    size: number;
  }
  handleMenuClick?: () => void;
  onChange?: (page: number) => void;
}

const items: MenuProps['items'] = [
  {
    label: <span className="text-12">Excel</span>,
    key: '1',
    icon: <Image src={Excel} alt="Excel" width={16} height={16} />,
  },
  {
    label: <span className="text-12">Print</span>,
    key: '2',
    icon: <Image src={Print} alt="Print" width={16} height={16} />,
  },
]

export const ListPagination: React.FC<Props> = ({
  totalData,
  pagination,
  handleMenuClick,
  onChange,
}) => {
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="flex w-full h-50 gap-20 justify-end items-center">
      <span>총 {totalData}건</span>
      <Pagination 
        size="small"
        defaultCurrent={1}
        current={pagination.current}
        total={totalData}
        onChange={(page: number) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onChange?.(page);
        }}
      />
      <Dropdown menu={menuProps} trigger={['click']} placement="bottomCenter" getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}>
        <Button type="text" size="small" icon={<MoreOutlined />} style={{backgroundColor: "#E9EDF5"}}/>
      </Dropdown>
    </div>
  )
}