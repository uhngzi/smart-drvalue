import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, List, Pagination } from "antd";
import { useQuery } from "@tanstack/react-query";
import TextArea from "antd/lib/input/TextArea";
import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";

import { useUser } from "@/data/context/UserContext";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { errBoardType, errCommentType, errReq } from "@/data/type/err/err";

import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { ListPagination } from "@/layouts/Body/Pagination";

import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";

import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Klip from '@/assets/svg/icons/klip.svg';
import { CloseCircleTwoTone, CommentOutlined } from "@ant-design/icons";

import AntdModal from "@/components/Modal/AntdModal";
import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";
import { DividerH } from "@/components/Divider/Divider";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { LabelMedium, LabelThin } from "@/components/Text/Label";
import AntdDraggerSmall from "@/components/Upload/AntdDraggerSmall";
import { downloadFileByObjectName } from "@/components/Upload/upLoadUtils";

const ErrBoardPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me, meLoading } = useUser();
  const { showToast, ToastContainer } = useToast();

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [data, setData] = useState<errBoardType[]>([]);
  const { refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["require-tenant-key/board/bugfix/jsxcrud/many", pagination],
    queryFn: async () => {
      setDataLoading(true);

      const result = await getAPI({
        type: 'utility',
        utype: 'root/',
        url: 'require-tenant-key/board/bugfix/jsxcrud/many',
      }, {
        page: pagination.current,
        limit: pagination.size,
      });

      if (result.resultCode === "OK_0000") {
        setData(result.data.data ?? []);
        setTotalData(result?.data.total ?? 0);
        setDataLoading(false);
        
      } else {
        console.log("error:", result.response);
        setDataLoading(false);
      }
      return result;
    },
  });
  // ------------ 리스트 데이터 세팅 ------------ 끝

  const [select, setSelect] = useState<errBoardType>();
  const [open, setOpen] = useState<boolean>(false);
  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);
  useEffect(()=>{
    if(select) {
      setSelect({ ...select, attachmentFiles:fileIdList });
    }
  }, [fileIdList]);

  // 첨부파일 목록의 유동적인 높이 조절을 위해 추가
  // 전체 div의 크기를 가져오기 위한 변수
  const ref = useRef<HTMLDivElement>(null);
  // 높이 변경을 감지하기 위한 변수
  const [changeHeight, setChangeHeight] = useState<{width: number; height: number;} | null>(null);

  const [myCmt, setMyCmt] = useState<{writerName: string, message: string, parentId?: string, reWriterName?: string, reMessage?: string,}>({
    writerName: "", message: ""
  });

  // ------------ 댓글 데이터 세팅 ------------ 시작
  const [cmtLoading, setCmtLoading] = useState<boolean>(true);
  const [totalDataCmt, setTotalDataCmt] = useState<number>(1);
  const [paginationCmt, setPaginationCmt] = useState({
    current: 1,
    size: 5,
  });
  const handlePageChangeCmt = (page: number, size: number) => {
    setPaginationCmt({ current: page, size: size });
  };
  const [comments, setComments] = useState<errCommentType[]>([]);
  const { refetch:commentsRefetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["require-tenant-key/board/bugfix/comment/default/many/by-board-id", select?.id, paginationCmt],
    queryFn: async () => {
      setCmtLoading(true);
      const result = await getAPI({
        type: 'utility',
        utype: 'root/',
        url: `require-tenant-key/board/bugfix/comment/default/many/by-board-id/${select?.id}`,
      }, {
        page: paginationCmt.current,
        limit: paginationCmt.size,
      });
      
      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.comments as errCommentType[] ?? []).map((cmt) => ({
          ...cmt, childShow: false,
        }))
        setComments(arr);
        setTotalDataCmt(result.data?.totalCount ?? 0);
        setCmtLoading(false);
      } else {
        console.log("error:", result.response);
        setCmtLoading(false);
      }
      return result;
    },
    enabled: !!select?.id
  });
  // ------------ 댓글 데이터 세팅 ------------ 끝
  
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<string>("");
  
  // ------------- 오류사항 등록 ------------- 시작
  const handleSubmit = async () => {
    try {
      const val = validReq(select, errReq());
      if(!val.isValid) {
        showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
        return;
      }
      
      console.log(JSON.stringify(select));
      const result = await postAPI({
        type: 'utility',
        utype: 'root/',
        url: 'require-tenant-key/board/bugfix',
        jsx: 'jsxcrud'},
        { ...select, id: undefined }
      );
      
      if(result.resultCode === "OK_0000") {
        refetch();
        const entity = result.data.entity as errBoardType;
        const attachmentFilesStr = result.data.entity?.attachmentFiles;
        setSelect({ ...entity, attachmentFiles: JSON.parse(attachmentFilesStr)});
        console.log(entity);
        showToast("등록 완료", "success");
      } else {
        const msg = result.response?.data?.message;
        setResultMsg(msg);
        setAlertOpen(true);
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
      setResultMsg(e+"");
      setAlertOpen(true);
    }
  }
  // ------------- 오류사항 등록 ------------- 끝
  
  // -------------- 댓글 등록 --------------- 시작
  const handleSubmitComment = async (re:boolean) => {
    try {
      if(select?.id) {
        if(re && (!myCmt?.reWriterName || !myCmt?.reMessage)) {
          showToast("답글 작성자명, 답글 내용은 필수 입력입니다.", "error");
          return;
        }

        if(!re && (!myCmt?.writerName || !myCmt?.message)) {
          showToast("작성자명, 내용은 필수 입력입니다.", "error");
          return;
        }

        const result = await postAPI({
          type: 'utility',
          utype: 'root/',
          url: 'require-tenant-key/board/bugfix/comment',
          jsx: 'default'},
          { boardId: select?.id,
            writerName: re? myCmt?.reWriterName : myCmt?.writerName,
            message: re? myCmt?.reMessage : myCmt?.message,
            parentId : myCmt?.parentId,
          }
        );
        
        if(result.resultCode === "OK_0000") {
          commentsRefetch();
          const entity = result.data.data as errCommentType;
          setComments([ entity, ...comments]);
          setMyCmt({ ...myCmt, message: "", reMessage: undefined, parentId: undefined});
          showToast("등록 완료", "success");
        } else {
          const msg = result.response?.data?.message;
          setResultMsg(msg);
          setAlertOpen(true);
        }
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
    }
  }
  // -------------- 댓글 등록 --------------- 끝

  // 값 초기화
  useEffect(()=>{
    if(!open) {
      setSelect(undefined);
      setFileIdList([]);
      setFileList([]);
    }
  }, [open])

  return (
    !meLoading &&
    <div className="flex flex-col">
      <div className="w-full h-50">
        <ListTitleBtn
          label="신규"
          onClick={()=>{
            setOpen(true);
          }}
          icon={<SplusIcon stroke="#FFF"className="w-16 h-16"/>}
        />
      </div>

      <DividerH />

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
      />

      <List>
        <AntdTableEdit
          columns={[
            {
              title: 'No',
              width: 50,
              dataIndex: 'index',
              key: 'index',
              align: 'center',
              render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
            },
            {
              title: '작성자명',
              width: 100,
              dataIndex: 'writerName',
              key: 'writerName',
              align: 'center',
            },
            {
              title: '메뉴명',
              width: 180,
              dataIndex: 'menuName',
              key: 'menuName',
              align: 'center',
              cellAlign: "left",
            },
            {
              title: '세부작업내용',
              width: 180,
              dataIndex: 'detailWorkName',
              key: 'detailWorkName',
              align: 'center',
              cellAlign: "left",
            },
            {
              title: '내용',
              minWidth: 200,
              dataIndex: 'content',
              key: 'content',
              align: 'center',
              cellAlign: "left",
            },
            {
              title: '처리상태',
              width: 90,
              dataIndex: 'status',
              key: 'status',
              align: 'center',
              render: (value, record) => (
                <div
                  className="w-full h-full v-h-center cursor-pointer"
                  onClick={()=>{
                    setSelect(record);
                    setFileIdList((record as errBoardType).attachmentFiles ?? []);
                    setOpen(true);
                  }}
                >
                  {value}
                </div>
              )
            },
          ]}
          data={data}
          styles={{th_bg:'#FAFAFA',td_bg:'#FFFFFF',round:'0px',line:'n'}}
          loading={dataLoading}
        />
      </List>

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
      />

      <AntdModal
        open={open}
        setOpen={setOpen}
        width={1000}
        title={select?.id ? "오류사항 상세" : "오류사항 등록"}
        contents={<div className="flex flex-col gap-20">
          <div className="w-full h-full min-h-100 bg-white rounded-14 p-20 flex flex-col gap-20">
            <LabelMedium label="상세 내용"/>
            <DividerH />
            <div className="w-full h-full flex items-start gap-20">
              <div className="w-1/3 h-full flex flex-col gap-10">
                <div className="">
                  <LabelThin label="작성자명"/>
                  <AntdInput
                    value={select?.writerName}
                    onChange={(e) => {
                      const { value } = e.target;
                      setSelect({...select, writerName: value});
                    }}
                  />
                </div>
                <div>
                  <LabelThin label="세부작업명"/>
                  <AntdInput
                    value={select?.detailWorkName}
                    onChange={(e) => {
                      const { value } = e.target;
                      setSelect({...select, detailWorkName: value});
                    }}
                    // placeholder="작업명"
                  />
                  {/* <AntdSelect
                    options={[
                      {value: "", label:"등록"},
                      {value: "", label:"수정"},
                      {value: "", label:"그외"},
                    ]}
                    value={select?.}
                    onChange={(e)=>{
                      const value = e+'';
                      setSelect({...select, status: value});
                    }}
                    placeholder={"작업"}
                  /> */}
                </div>
                <div>
                  <LabelThin label="처리 상태"/>
                  <AntdSelect
                    options={[
                      {value: "REGISTERED", label:"등록"},
                      {value: "UNKNOWN", label:"협의필요"},
                      {value: "WAITING", label:"처리중"},
                      {value: "COMPLETED", label:"처리완료"},
                    ]}
                    value={select?.status ?? "REGISTERED"}
                    onChange={(e)=>{
                      const value = e+'';
                      setSelect({...select, status: value});
                    }}
                    styles={{ht:'36px'}}
                  />
                </div>
                { !select?.id &&
                  <AntdDraggerSmall
                    fileList={fileList}
                    setFileList={setFileList}
                    fileIdList={fileIdList}
                    setFileIdList={setFileIdList}
                    mult={true}
                    divRef={ref}
                    changeHeight={changeHeight}
                    defaultHeight={267}
                  />
                }
                { select?.id && select?.attachmentFiles && select?.attachmentFiles?.length > 0 &&
                  select?.attachmentFiles?.map((fileId, index) => (
                  <div className="h-center">
                    <p className="w-16 h-16 mr-8 min-w-16 min-h-16"><Klip /></p>
                    <div
                      className="text-[#1890FF] cursor-pointer"
                      onClick={()=> downloadFileByObjectName(fileId)}
                    >
                      파일{index+1}
                    </div>
                  </div>
                  ))
                }
              </div>
              <div
                className="w-2/3 h-full flex flex-col gap-10"
                ref={el => {if(el)  ref.current = el;}}
              >
                <div>
                  <LabelThin label="메뉴명"/>
                  <AntdInput
                    value={select?.menuName}
                    onChange={(e) => {
                      const { value } = e.target;
                      setSelect({...select, menuName: value});
                    }}
                  />
                </div>
                <div className="w-full">
                  <LabelThin label="오류 및 이슈사항 내용"/>
                  <TextArea
                    value={select?.content}
                    onChange={(e) => {
                      const { value } = e.target;
                      setSelect({...select, content:value});
                    }}
                    className="rounded-2"
                    style={{height:200,minHeight:200}}
                    onResize={(e)=>{setChangeHeight(e)}}
                  />
                </div>
              </div>
            </div>
            { !select?.id &&
              <div className="w-full h-center justify-end">
                <Button type="primary" onClick={handleSubmit}>
                  <Arrow/> 등록
                </Button>
              </div>
            }
          </div>
          { select?.id && !cmtLoading &&
            <div className="w-full h-full min-h-[300px] bg-white rounded-14 p-20 flex flex-col gap-20">
              <LabelMedium label="댓글"/>
              <DividerH />
              <div className="w-full h-40">
                <div className="h-center gap-10">
                  <AntdInput
                    value={myCmt?.writerName}
                    onChange={(e) => {
                      const { value } = e.target;
                      setMyCmt({ ...myCmt, writerName: value });
                    }}
                    placeholder="작성자명"
                    className="!w-100"
                  />
                  <AntdInput
                    value={myCmt?.message}
                    onChange={e => {
                      const { value } = e.target;
                      setMyCmt({ ...myCmt, message: value})
                    }}
                    onKeyDown={e => {
                      if(e.key === 'Enter') {
                        handleSubmitComment(false);
                      }
                    }}
                    placeholder="내용"
                  />
                  <Button type="primary" onClick={()=>handleSubmitComment(false)}>
                    <Arrow/>
                  </Button>
                </div>
              </div>
              <div className="w-full min-h-[200px] flex flex-col gap-10">
              {
                comments && comments.map((cmt) => (<div className="w-full flex flex-col gap-10">
                  <div className="h-center gap-10">
                    <div className="max-w-100 min-w-100 border-r-2 border-r-black">
                      <LabelMedium  label={cmt?.writerName ?? ""} />
                    </div>
                    <div className="flex-1">{cmt?.message}</div>
                    <Button onClick={()=>{
                      setMyCmt({ ...myCmt, parentId: cmt?.id })
                    }}>
                      <CommentOutlined />
                    </Button>
                  </div>
                  { myCmt?.parentId === cmt?.id &&
                    <div className="h-center gap-10 pl-30">
                      <AntdInput
                        value={myCmt?.reWriterName}
                        onChange={(e) => {
                          const { value } = e.target;
                          setMyCmt({ ...myCmt, reWriterName: value });
                        }}
                        placeholder="작성자명"
                        className="!w-100"
                      />
                      <AntdInput
                        value={myCmt?.reMessage}
                        onChange={e => {
                          const { value } = e.target;
                          setMyCmt({ ...myCmt, reMessage: value})
                        }}
                        onKeyDown={e => {
                          if(e.key === 'Enter') {
                            handleSubmitComment(true);
                          }
                        }}
                        placeholder="답글 내용"
                      />
                      <Button onClick={()=>{setMyCmt({ ...myCmt, parentId: undefined })}} className="border-point1">
                        <CloseCircleTwoTone />
                      </Button>
                      <Button type="primary" onClick={()=>handleSubmitComment(true)}>
                        <Arrow/>
                      </Button>
                    </div>
                  }
                  { cmt?.childComments && cmt?.childComments.length > 0 && 
                  <div
                    className="w-full v-h-center cursor-pointer border-1 border-dashed border-line"
                    onClick={()=>{
                      const updateData = [ ...comments ];
                      const index = updateData.findIndex(f => f.id === cmt?.id);
                      if(index > -1) {
                        updateData[index] = { ...updateData[index], childShow: !cmt?.childShow };
                
                        const newArray = [
                          ...updateData.slice(0, index),
                          updateData[index],
                          ...updateData.slice(index + 1)
                        ];
                        setComments(newArray);
                      }
                    }}
                  > {cmt?.childShow ? "⇢ 답글 접기" : "⇢ 답글 보기"} </div> }
                  { cmt?.childComments && cmt?.childShow && cmt?.childComments.map((child)=> (
                    <div className="h-center gap-10 pl-10">
                      <CommentOutlined />
                      <div className="max-w-100 min-w-100 border-r-2 border-r-black">
                        {child?.writerName}
                      </div>
                      <div className="flex-1">{child?.message}</div>
                    </div>
                    ))
                  }
                </div>))
              }
              <div className="w-full v-h-center">
                <Pagination
                  total={totalDataCmt}
                  current={paginationCmt.current}
                  pageSize={paginationCmt.size}
                  size="small"
                  onChange={(page: number, size: number) => {
                    handlePageChangeCmt(page, size);
                  }}
                />
              </div>
              </div>
            </div>
          }
        </div>
        }
      />

      <AntdAlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        title={"요청 실패"}
        contents={<div>{resultMsg}</div>}
        type={"error"}
        onOk={()=>{
          setAlertOpen(false);
        }}
      />
      <ToastContainer />
    </div>
  )
};

ErrBoardPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="오류사항 게시판"
  >{page}</MainPageLayout>
);

export default ErrBoardPage;