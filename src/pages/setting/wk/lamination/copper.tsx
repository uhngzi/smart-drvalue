import AntdTable from "@/components/List/AntdTable";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import BaseInfoCUDModal from "@/components/Modal/BaseInfoCUDModal";
import AntdSettingPagination from "@/components/Pagination/AntdSettingPagination";
import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import Bag from "@/assets/svg/icons/bag.svg";
import { useState } from "react";
import { laminationCopperList } from "@/data/type/base/lamination";

const WkLaminationCopperListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (<></>)
//   //등록 모달창을 위한 변수
//     const [ newOpen, setNewOpen ] = useState<boolean>(false);
// //등록 모달창 데이터
//     const [ newData, setNewData ] = useState<laminationCopperList>();
//     const [totalData, setTotalData] = useState<number>(1);
//     const [pagination, setPagination] = useState({
//       current: 1,
//       size: 10,
//     });

//   return (
//     <>
//     <AntdTable
//           columns={[
//             {
//               title: 'No',
//               width: 50,
//               dataIndex: 'no',
//               render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
//               align: 'center',
//             },
//             {
//               title: '유형',
//               width: 130,
//               dataIndex: 'lamDtlTypeEm',
//               key: 'lamDtlTypeEm',
//               align: 'center',
//               render: (_, record) => (
//                 <div
//                   className="w-full h-full justify-center h-center cursor-pointer"
//                   onClick={()=>{
//                     // setNewData(setLaminationMaterialType(record));
//                     setNewOpen(true);
//                   }}
//                 >
//                   {record.lamDtlTypeEm}
//                 </div>
//               )
//             },
//             {
//               title: '재질',
//               dataIndex: 'matNm',
//               key: 'matNm',
//               align: 'center',
//               render: (_, record) => (
//                 <div
//                   className="w-full h-full justify-center h-center cursor-pointer"
//                   onClick={()=>{
//                     // setNewData(setLaminationMaterialType(record));
//                     setNewOpen(true);

//                   }}
//                 >
//                   {record.matNm}
//                 </div>
//               )
//             },
            
//             {
//               title: 'Epoxy',
//               width: 130,
//               dataIndex: 'epoxy',
//               key: 'epoxy',
//               align: 'center',
//             },
//             {
//               title: '코드',
//               width: 130,
//               dataIndex: 'code',
//               key: 'code',
//               align: 'center',
//             },
//           ]}
//           data={data}
//         />

//         <div className="w-full h-100 h-center justify-end">
//           <AntdSettingPagination
//             current={pagination.current}
//             total={totalData}
//             size={pagination.size}
//             onChange={handlePageChange}
//           />
//         </div>
//       </>}

//       <BaseInfoCUDModal
//         title={{ name: `적층구조 ${newData?.id ? '수정' : '등록'}`, icon: <Bag /> }}
//         open={newOpen} 
//         setOpen={setNewOpen} 
//         onClose={() => modalClose()}
//         items={addModalInfoList} 
//         data={newData}
//         onSubmit={handleSubmitNewData}
//         onDelete={handleDataDelete}
//       />
        

//         <AntdAlertModal
//         open={resultOpen}
//         setOpen={setResultOpen}
//         title={resultTitle}
//         contents={resultText}
//         type={resultType} 
//         onOk={()=>{
//           refetch();
//           setResultOpen(false);
//           setNewData(newLaminationMaterialType);
//         }}
//         hideCancel={true}
//         theme="base"
//       />
//     </>
//     </>
//   )
}

WkLaminationCopperListPage.layout = (page: React.ReactNode) => (
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

export default WkLaminationCopperListPage;