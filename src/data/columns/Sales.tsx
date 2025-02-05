import { TableProps } from 'antd/es/table';
import FullChip from '@/components/Chip/FullChip';

export const salesUserOrderClmn = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
): TableProps['columns'] => [
  {
    title: 'No',
    width: 50,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: '고객명',
    width: 250,
    dataIndex: 'no',
    key: 'no',
    align: 'center',
  },
  {
    title: '고객코드',
    width: 120,
    dataIndex: 'cuName',
    key: 'cuName',
    align: 'center',
  },
  {
    title: '발주명',
    width: 360,
    dataIndex: 'orderName',
    key: 'orderName',
    align: 'center',
  },
  {
    title: '모델수',
    width: 70,
    dataIndex: 'mngName',
    key: 'mngName',
    align: 'center',
  },
  {
    title: '고객처 담당',
    width: 120,
    dataIndex: 'mngName',
    key: 'mngName',
    align: 'center',
  },
  {
    title: '긴급',
    width: 80,
    dataIndex: 'hot',
    key: 'hot',
    align: 'center',
    render: (value: number) => (
      <div className="v-h-center">
        {value === 3 ? (
          <FullChip label="일반" />
        ) : value === 2 ? (
          <FullChip label="긴급" state="pink" />
        ) : (
          <FullChip label="초긴급" state="purple"/>
        )}
      </div>
    ),
  },
  {
    title: '영업담당',
    width: 120,
    dataIndex: 'thic',
    align: 'center',
    key: 'thic',
  },
  {
    title: '발주접수일',
    width: 150,
    dataIndex: 'layer',
    align: 'center',
    key: 'layer',
  },
  {
    title: '발주일',
    width: 150,
    dataIndex: 'submitDt',
    align: 'center',
    key: 'submitDt',
  },
  {
    title: '모델 등록',
    width: 100,
    dataIndex: 'model',
    align: 'center',
    key: 'model',
    render: (value: number) => (
      <div className="v-h-center">
        {value === 3 ? (
          <FullChip label="완료" />
        ) : value === 2 ? (
          <FullChip label="등록중" state="mint" click={() => setOpen(true)} />
        ) : (
          <FullChip label="대기" state="yellow" click={() => setOpen(true)} />
        )}
      </div>
    ),
  },
];
