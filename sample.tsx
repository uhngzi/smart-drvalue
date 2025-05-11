// 모델 등록 드래그 앤 드롭으로 크기 조절
// const containerRef = useRef<HTMLDivElement>(null);
// const [width, setWidth] = useState(800);
// const handleModelMouseDown = (e: React.MouseEvent) => {
//   const startX = e.clientX;
//   const startWidth = width;

//   const handleMouseMove = (moveEvent: MouseEvent) => {
//     const diffX = startX - moveEvent.clientX; // 왼쪽으로 이동 → diffX 증가
//     const newWidth = startWidth + diffX;
//     if (newWidth >= 100 && newWidth <= 1100) { // 최소/최대 너비 제한
//       setWidth(newWidth);
//     }
//   };

//   const handleMouseUp = () => {
//     document.removeEventListener('mousemove', handleMouseMove);
//     document.removeEventListener('mouseup', handleMouseUp);
//   };

//   document.addEventListener('mousemove', handleMouseMove);
//   document.addEventListener('mouseup', handleMouseUp);
// };

{
  /* <AntdModalStep2
        open={open}
        setOpen={setOpen}
        items={stepItems}
        current={stepCurrent}
        onClose={stepModalClose}
        width={1300}
        contents={
        <div className="flex h-full overflow-x-hidden">
          <div style={{width:stepCurrent>0 ? `calc(100% - ${width});`:'100%'}} className="overflow-x-auto">
            <AddOrderContents
              csList={csList}
              csMngList={csMngList}
              setCsMngList={setCsMngList}
              fileList={fileList}
              fileIdList={fileIdList}
              setFileList={setFileList}
              setFileIdList={setFileIdList}
              setOpen={setOpen}
              formData={formData}
              setFormData={setFormData}
              stepCurrent={stepCurrent}
              setStepCurrent={setStepCurrent}
              setEdit={setEdit}
              handleEditOrder={handleEditOrder}
            />
          </div>
          {
            // 모델 등록
            stepCurrent > 0 ?
            <div ref={containerRef} className="flex relative pl-10" style={{width:`${width}px`}}>
              <div className="absolute top-0 left-0 h-full w-10 cursor-col-resize hover:bg-gray-200 h-center" onMouseDown={handleModelMouseDown}>
                <DragHandle />
              </div>
              <div className="w-full">
                <div className="w-full flex flex-col bg-white rounded-14 overflow-auto px-20 py-30 gap-20">
                  <div className=""><LabelMedium label="모델 등록"/></div>
                  <div className="w-full h-1 border-t-1"/>
                    <AntdTableEdit
                      create={true}
                      columns={salesUserOrderModelClmn(newProducts, setNewProducts, setDeleted)}
                      data={newProducts}
                      setData={setNewProducts}
                      styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
                    />
                    <div className="pt-5 pb-5 gap-4 justify-center h-center cursor-pointer" style={{border:"1px dashed #4880FF"}} 
                      onClick={() => {
                        setNewProducts((prev: salesOrderProcuctCUType[]) =>[
                          ...prev,
                          {...newDataSalesOrderProductCUType(), id:'new-'+prev.length+1}
                        ]);
                      }}
                    >
                    <SplusIcon/>
                    <span>모델 추가하기</span>
                  </div>
                  <div className="flex w-full h-50 v-between-h-center">
                    <Button
                      className="w-109 h-32 rounded-6"
                      onClick={()=>{
                        setStepCurrent(0);
                      }}
                    >
                      <p className="w-16 h-16 text-[#222222]"><Back /></p> 이전단계
                    </Button>
                    <Button
                      className="w-109 h-32 bg-point1 text-white rounded-6" style={{color:"#ffffffE0", backgroundColor:"#4880FF"}}
                      onClick={()=>{
                        if(edit && detailId !== "") {
                          handleEditOrder();
                        } else {
                          handleSubmitOrder();
                        }
                      }}
                    >
                      <Arrow /> { edit ? '모델수정' : '모델저장'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            :<></>
          }
        </div>}
      /> */
}

//  스크롤을 통한 값 세팅 및 값 가져오기...
// useEffect(() => {
//   if (
//     !mtLoading &&
//     !mtGrpLoading &&
//     queryMtData?.data?.data &&
//     queryMtData?.data?.data?.length
//   ) {
//     setMt((prev) => {
//       const newItems = (
//         (queryMtData.data.data as materialType[]) ?? []
//       ).filter(
//         (newItem) => !prev.some((existing) => existing.id === newItem.id)
//       );
//       return [...prev, ...newItems];
//     });
//     setMainTotCnt((queryMtGrpData?.data?.data ?? []).length);
//     setChildTotCnt(queryMtData.data.total ?? 0);
//   }
// }, [queryMtData, queryMtGrpData]);

// useEffect(() => {
//   const tree = Object.values(
//     mt.reduce((acc: any, item: materialType) => {
//       const groupId = item.materialGroup?.id ?? "";
//       if (!acc[groupId]) {
//         acc[groupId] = {
//           id: groupId,
//           ordNo: item.materialGroup?.ordNo ?? item.materialGroup?.odNum ?? 0,
//           label: item.materialGroup?.mtGrpNm,
//           children: [],
//           open: true,
//         };
//       }
//       acc[groupId].children.push({
//         id: item.id ?? "",
//         label: item.mtNm ?? "",
//         mtEnm: item.mtEnm,
//         unitType: item.unitType,
//         ordNo: item.ordNo,
//         useYn: item.useYn,
//       });
//       return acc;
//     }, {} as Record<number, materialType>)
//   ).sort((a: any, b: any) => (a.ordNo ?? 0) - b.ordNo);
//   console.log("tree : ", tree);
//   setTreeData(tree);

//   setDataLoading(false);
//   setChildCnt(tree.length);
// }, [mt]);
