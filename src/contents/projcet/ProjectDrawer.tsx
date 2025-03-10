import { Button, Card, Checkbox, DatePicker, Drawer } from "antd"
import styled, { css } from "styled-components";

import Close from "@/assets/svg/icons/s_close.svg";
import Plus from "@/assets/svg/icons/s_plus_gray.svg"
import Calendar from "@/assets/svg/icons/newcalendar.svg";

import { TabSmall } from "@/components/Tab/Tabs";
import { useState } from "react";
import CardInputList from "@/components/List/CardInputList";
import AntdInput from "@/components/Input/AntdInput";
import AntdDragger from "@/components/Upload/AntdDragger";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdInputFill from "@/components/Input/AntdInputFill";
import AntdDatePicker from "@/components/DatePicker/AntdDatePicker";

const tabList = [
  { key: 1, text: '진행 관리' },
  { key: 2, text: '품질 관리' },
  { key: 3, text: '인력 투입 관리' },
]

interface Props {
  open: boolean;
  close: ()=>void;
  placement?: 'right' | 'left' | 'top' | 'bottom';
  width?: number;
  maskClosable?: boolean;
  mask?: boolean;
  getContainer?: boolean;
  style?: React.CSSProperties;
}

const ProjectDrawer: React.FC<Props> = ({
  open,
  close,
  placement = "right",
  width = 510,
  maskClosable = true,
  mask = true,
  getContainer = true,
  style,
}) => {

  const [selectKey, setSelectKey] = useState<number>(1);


  // -------------------진행관리 변수, 함수들--------------------
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileIdList, setFileIdList] = useState<string[]>([]);
  const [memoText, setMemoText] = useState<string>('');
  const [memoList, setMemoList] = useState<{id: string|Number, status: string, text: string}[]>([]);
  
  function addMemo() {
    setMemoText('');
    setMemoList((prev:any) => [...prev, {id: prev.length, status:true, text:memoText}]);
  }
  function deleteMemo(id: string|Number) {
    setMemoList((prev:any) => prev.map((memo:any) => memo.id === id ? {...memo, status: 'delete'} : memo));
  }
  // -----------------------------------------------------

  
  function drawerClose(){
    setSelectKey(1);
    setFileList([]);
    setFileIdList([]);
    setMemoText('');
    setMemoList([]);
    close();
  }
  return (
    <AntdDrawerStyled
      closeIcon={null}
      placement={placement}
      open={open}
      onClose={drawerClose}
      width={selectKey === 1 ? 600 : selectKey === 2 ? 800 : 400}
      maskClosable={maskClosable}
      mask={mask}
      getContainer={getContainer ? (typeof window !== 'undefined' ? () => document.body : undefined) : false}
      style={style}
    >
      <section className="p-20 flex flex-col gap-20">
        <div className="flex justify-between items-center">
          <span className="text-16 font-medium" style={{color:'#000000D9'}}>도면설계 계획(진행) 관리</span>
          <div className="flex cursor-pointer" onClick={drawerClose}><Close/></div>
        </div>
        <div>
          <div className="w-full flex gap-32">
            {tabList.map((i, idx) => (
              <div key={idx} className="min-w-67 min-h-46 px-10 py-12 mr-10 text-14 text-center cursor-pointer"
                style={i.key ===selectKey ? {color:'#4880FF',borderBottom:'3px solid #4880FF'}:{}}
                onClick={()=>setSelectKey(i.key)}>{i.text}</div>
            ))}
          </div>
          {selectKey === 1 && (
            <CardInputList items={[]} handleDataChange={() => {}} styles={{mg:'-10px'}}>
              <section className="flex flex-col gap-20">
                <div className={`grid grid-cols-1 md:grid-cols-6 gap-10`}>
                  <div className="col-span-3">
                    <p className="pb-8">진행관리일</p>
                    <DatePicker className="!w-full !rounded-0" suffixIcon={<Calendar/>}/>
                  </div>
                  <div className="col-span-3">
                    <p className="pb-8">진행률</p>
                    <AntdInput value={""} onChange={()=>{}}/>
                  </div>
                </div>
                <div className="flex flex-col gap-10">
                  <p className="text-14">첨부파일</p>
                  <div className="w-full h-[172px]">
                    <AntdDragger
                      fileList={fileList}
                      setFileList={setFileList}
                      fileIdList={fileIdList}
                      setFileIdList={setFileIdList}
                    />
                  </div>
                  <div style={{height:`${32*fileList.length}px`}}></div>
                </div>
                <div>
                  <div className="flex gap-10 v-between-h-center">
                    <AntdInput value={memoText} placeholder="메모를 작성해주세요" onChange={(e) => setMemoText(e.target.value)}/>
                    <Button type="text" className="!w-24 !h-24 !p-0" onClick={addMemo}><Plus/></Button>
                  </div>
                  {memoList.map((memo, idx) => (
                    <p key={idx} className="flex h-36 p-3 v-between-h-center">
                      <span className={`text-14 font-normal ${memo.status === "delete" ? "line-through text-[#00000073]" : ""}`}>{memo.text}</span>
                      <span className="cursor-pointer" onClick={() => deleteMemo(memo.id)}><Close/></span>
                    </p>
                  ))}
                </div>
              </section>
            </CardInputList>
          )}
          {selectKey === 2 && (
            <CardInputList items={[]} handleDataChange={() => {}} styles={{mg:'-10px'}}>
              <section className="flex flex-col gap-20">
                <div className={`grid grid-cols-1 md:grid-cols-6 gap-10`}>
                  <div className="col-span-2">
                    <p className="pb-8">품질관리일</p>
                    <DatePicker className="!w-full !rounded-0" suffixIcon={<Calendar/>}/>
                  </div>
                </div>
                <AntdTableEdit
                  columns={[
                    {
                      title: '불량여부',
                      width:84,
                      dataIndex: 'errorYn',
                      key: 'errorYn',
                      align: 'center',
                      render:() => (
                        <Checkbox/>
                      )
                    },
                    {
                      title: '불량 항목',
                      width:87,
                      dataIndex: 'errorCode',
                      key: 'prdRevNo',
                      align: 'center',
                    },
                    {
                      title: '불량 내용',
                      width:200,
                      dataIndex: 'errorText',
                      key: 'errorText',
                      align: 'center',
                    },
                    {
                      title: '수량',
                      width:82,
                      dataIndex: 'amount',
                      key: 'amount',
                      align: 'center',
                      render: (value) => (
                        <div className="w-full h-full v-h-center">
                          <AntdInputFill value={value} onChange={(e) => {}} placeholder="수량"/>
                        </div>
                      )
                    },
                    {
                      title: '불량 상태',
                      width:248,
                      dataIndex: 'errorsts',
                      key: 'errorsts',
                      align: 'center',
                      render: (value, record) => (
                        <div className="w-full h-full v-h-center">
                          <AntdInputFill value={value} onChange={(e) => {}} placeholder="example"/>
                        </div>
                      )
                    },
                  ]}
                  data={[]}
                  styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
                />
              </section>
            </CardInputList>
          )}
          {selectKey === 3 && (
            <CardInputList items={[]} handleDataChange={() => {}} styles={{mg:'-10px'}}>
            <section className="flex flex-col gap-20">
              <div className={`grid grid-cols-1 md:grid-cols-6 gap-10`}>
                <div className="col-span-3">
                  <p className="pb-8">인력 투입일</p>
                  <DatePicker className="!w-full !rounded-0" suffixIcon={<Calendar/>}/>
                </div>
              </div>
              <AntdTableEdit
                columns={[
                  {
                    title: '근로자',
                    width:84,
                    dataIndex: 'worker',
                    key: 'worker',
                    align: 'center',
                    
                  },
                  {
                    title: '오전',
                    width:58,
                    dataIndex: 'am',
                    key: 'am',
                    align: 'center',
                    render:() => (
                      <Checkbox/>
                    )
                  },
                  {
                    title: '오후',
                    width:58,
                    dataIndex: 'pm',
                    key: 'pm',
                    align: 'center',
                    render:() => (
                      <Checkbox/>
                    )
                  },
                  {
                    title: '야간',
                    width:58,
                    dataIndex: 'night',
                    key: 'night',
                    align: 'center',
                    render:() => (
                      <Checkbox/>
                    )
                  },
                  {
                    title: '철야',
                    width:58,
                    dataIndex: 'allnight',
                    key: 'allnight',
                    align: 'center',
                    render:() => (
                      <Checkbox/>
                    )
                  },
                ]}
                data={[{worker: "홍길동"}, {worker: "김아무개"}]}
                styles={{th_bg:'#F9F9FB',td_ht:'40px',th_ht:'40px',round:'0px',}}
              />
            </section>
          </CardInputList>
          )}
        </div>
        <div className="flex justify-end"><Button type="primary">저장</Button></div>
      </section>
    </AntdDrawerStyled>
  )
}

const AntdDrawerStyled = styled(Drawer)`
  box-shadow: ${({ style }) =>
    style?.boxShadow ||
    `-6px 0 16px 0 rgba(0, 0, 0, 0.08),
     -3px 0 6px -4px rgba(0, 0, 0, 0.12), 
     -9px 0 28px 8px rgba(0, 0, 0, 0.05)`};

  .ant-drawer-body {
    padding:0;
    ${({ style }) =>
      style &&
      css`
        background-color: ${style.backgroundColor};
      `}
  }
`

export default ProjectDrawer;