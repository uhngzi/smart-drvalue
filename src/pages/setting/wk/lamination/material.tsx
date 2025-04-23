import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import AntdTable from "@/components/List/AntdTable";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { useState } from "react";
import { laminationMaterialType, setLaminationMaterialType } from "@/data/type/base/lamination";
import { useQuery } from "@tanstack/react-query";





const WkLaminationMaterialListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  console.log(setLaminationMaterialType, 'setLaminationMaterialType!!!');
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [ data, setData ] = useState<Array<laminationMaterialType>>([]);

  const [totalData, setTotalData] = useState<number>(1);
  const [ newData, setNewData ] = useState<laminationMaterialType>();
  const [ newOpen, setNewOpen ] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });

  return (
    <>
    
    <AntdTable
    columns={[
      {
        title: 'No',
        width: 50,
        dataIndex: 'no',
        render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
        align: 'center',
      },
      {
        title: '유형',
        dataIndex: 'lamDtlTypeEm',
        key: 'lamDtlTypeEm',
        align: 'center',
        render: (_, record) => (
          <div
            className="w-full h-full justify-center h-center cursor-pointer"
            onClick={()=>{
            setNewData(setLaminationMaterialType(record));
            setNewOpen(true);
          }}
          >
        {record.lamDtlTypeEm}
        </div>
        )
      },
      {
        title: '재질명',
        width: 130,
        dataIndex: 'matNm',
        key: 'matNm',
        align: 'center',
      },
      {
        title: 'Epoxy',
        width: 130,
        dataIndex: 'epoxy',
        key: 'epoxy',
        align: 'center',
      },
      {
        title: '코드',
        width: 130,
        dataIndex: 'code',
        key: 'code',
        align: 'center',
      },
      
  
    ]}/>
    
    </>
  )
}




WkLaminationMaterialListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '적층구조 자재', link: '/setting/wk/lamination/material' },
      { text: '적층구조 동박', link: '/setting/wk/lamination/copper' },
      { text: '적층구조 요소', link: '/setting/wk/lamination/source' },
    ]}
  >
    {page}
  </SettingPageLayout>
)

export default WkLaminationMaterialListPage;