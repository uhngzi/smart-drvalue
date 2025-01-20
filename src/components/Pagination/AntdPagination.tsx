import styled from "styled-components";

import { Pagination } from 'antd';

import Points from "@/assets/svg/icons/l_ellipsis.svg";
import ArrowLeft from "@/assets/svg/icons/l_drop_left.svg";
import ArrowRight from "@/assets/svg/icons/l_drop_right.svg";
import { componentsStylesType } from "@/data/type/componentStyles";

interface Props {
  current: number;
  total: number;
  size: number;
  onChange: (page: number) => void;
  styles?: componentsStylesType;
  className?: string;
}

const AntdPagination: React.FC<Props> = ({
  current,
  total,
  size,
  onChange,
  styles,
  className
}) => {
  return (
    <AntdPaginationStyled 
      className={className}
    >
      <Pagination
        defaultCurrent={1}
        current={current}
        total={total}
        pageSize={size}
        onChange={(page: number) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          onChange(page);
        }}
        align="center"
        showSizeChanger={false}
        jumpPrevIcon={<Points />}
        jumpNextIcon={<Points />}
        itemRender={(page, type, originalElement) => {
          if (type === 'prev') {
            return (
              <div className="ant-pagination-item">
                <ArrowLeft color={'#555555'} width={20} />
              </div>
            );
          }
          if (type === 'next') {
            return (
              <div className="ant-pagination-item">
                <ArrowRight color={'#555555'} width={20} />
              </div>
            );
          }
          return originalElement;
        }}
      />
    </AntdPaginationStyled>
  );
};

export default AntdPagination;

const AntdPaginationStyled = styled.div`
  .ant-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ant-pagination-item {
    width: 40px;
    height: 40px;

    background-color: transparent;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 15px;
  }

  .ant-pagination-item-active {
    background-color: #4880FF;
    a {
      color: white;
      font-size: 17px;
    font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    }
  }

  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    display: flex;
    align-items: center;
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    display: flex;
    align-items: center;

    .ant-pagination-item {
      width: auto;
    }
  }
`;