import { getAPI } from "@/api/get";
import { postAPI } from "@/api/post";
import { TabLarge } from "@/components/Tab/Tabs";
import { useUser } from "@/data/context/UserContext";
import { apiGetResponseType } from "@/data/type/apiResponse";
import ListTitleBtn from "@/layouts/Body/ListTitleBtn";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import useToast from "@/utils/useToast";
import { validReq } from "@/utils/valid";
import { useQuery } from "@tanstack/react-query";
import { Button, Empty, List } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useRef, useState } from "react";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Klip from '@/assets/svg/icons/klip.svg';
import { ListPagination } from "@/layouts/Body/Pagination";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import FullChip from "@/components/Chip/FullChip";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { LabelMedium, LabelThin } from "@/components/Text/Label";
import TextArea from "antd/es/input/TextArea";
import AntdInput from "@/components/Input/AntdInput";
import { downloadFileByObjectName } from "@/components/Upload/upLoadUtils";
import AntdDraggerSmall from "@/components/Upload/AntdDraggerSmall";
import { DividerH } from "@/components/Divider/Divider";
import AntdModal from "@/components/Modal/AntdModal";
import AntdDragger from "@/components/Upload/AntdDragger";
import { title } from "process";
import { patchAPI } from "@/api/patch";

interface CompanyBoardType {
  id?: string;
  title?: string;
  content?: string;
  files?: string[],
  user?: {
    name?: string;
    userId?: string;
  },
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
}

const HomeBoard: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}> = ({
  open, setOpen
}) => {
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
  const [data, setData] = useState<CompanyBoardType[]>([]);
  const { refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ["notice-board/jsxcrud/many", pagination],
    queryFn: async () => {
      setDataLoading(true);

      const result = await getAPI({
        type: 'core-d3',
        utype: 'tenant/',
        url: 'notice-board/jsxcrud/many',
      }, {
        page: pagination.current,
        limit: pagination.size,
      });

      if (result.resultCode === "OK_0000") {
        setData(result.data?.data ?? []);
        setTotalData(result?.data?.total ?? 0);
        setDataLoading(false);
        
      } else {
        console.log("error:", result.response);
        setDataLoading(false);
      }
      return result;
    },
  });
  // ------------ 리스트 데이터 세팅 ------------ 끝

  const [select, setSelect] = useState<CompanyBoardType>();
  const [ fileList, setFileList ] = useState<any[]>([]);
  const [ fileIdList, setFileIdList ] = useState<string[]>([]);
  useEffect(() => {
    if (select) {
      setSelect((prevSelect) => ({
        ...prevSelect,
        files: fileIdList,
      }));
    }
  }, [fileIdList]);  

  // 첨부파일 목록의 유동적인 높이 조절을 위해 추가
  // 전체 div의 크기를 가져오기 위한 변수
  const ref = useRef<HTMLDivElement>(null);
  // 높이 변경을 감지하기 위한 변수
  const [changeHeight, setChangeHeight] = useState<{width: number; height: number;} | null>(null);

  useEffect(()=>{
    if(select?.files && select.files.length > 0)
      fetchFileInfo();
  }, [select?.files])

  const fetchFileInfo = async () => {
    if(select?.files && select.files.length > 0) {
      let fileArr:any[] = [];
      for (const file of select.files) {
        const result = await getAPI({
          type: 'file-mng',
          url: `every/file-manager/default/info/${file}`,
          header: true,
        });
        
        if(result.resultCode === "OK_0000") {
          const entity = result?.data?.fileEntity;
          fileArr.push({
            ...entity,
            name: entity?.originalName,
            originFileObj: {
              name: entity?.originalName,
              size: entity?.size,
              type: entity?.type,
            }
          });
        }
      }
      setFileList(fileArr);
      setFileIdList(select.files);
    }
  }
    
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [resultMsg, setResultMsg] = useState<string>("");
  
  // ------------- 오류사항 등록 ------------- 시작
  const handleSubmit = async () => {
    try {
      if(!select?.title || select?.title === "" || !select?.content || select?.content === "") {
       showToast("제목과 내용을 입력해주세요.");
       return;
      }

      console.log(JSON.stringify(select));
      if(select.id) {
        // 수정
        const result = await patchAPI({
            type: 'core-d3',
            utype: 'tenant/',
            url: 'notice-board',
            jsx: 'jsxcrud'
          },
          select.id,
          { 
            title: select?.title,
            content: select?.content,
            files: select?.files,
          }
        );
        
        if(result.resultCode === "OK_0000") {
          refetch();
          showToast("수정 완료", "success");
        } else {
          const msg = result.response?.data?.message;
          setResultMsg(msg);
          setAlertOpen(true);
        }
      } else {
        // 등록
        const result = await postAPI({
          type: 'core-d3',
          utype: 'tenant/',
          url: 'notice-board',
          jsx: 'jsxcrud'},
          { 
            title: select?.title,
            content: select?.content,
            files: select?.files,
          }
        );
        
        if(result.resultCode === "OK_0000") {
          refetch();
          const entity = result.data.data as CompanyBoardType;
          setSelect({ ...entity });
          console.log(entity);
          showToast("등록 완료", "success");
        } else {
          const msg = result.response?.data?.message;
          setResultMsg(msg);
          setAlertOpen(true);
        }
      }
    } catch(e) {
      console.log("CATCH ERROR :: ", e);
      setResultMsg(e+"");
      setAlertOpen(true);
    }
  }
  // ------------- 오류사항 등록 ------------- 끝
  
  // 값 초기화
  useEffect(()=>{
    if(!open) {
      setSelect(undefined);
      setFileIdList([]);
      setFileList([]);
    }
  }, [open])

  return (
    <div className="flex flex-col">
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
              leftPin: true,
              render: (_: any, __: any, index: number) => totalData - ((pagination.current - 1) * pagination.size + index), // 역순 번호 매기기
            },
            {
              title: '작성자명',
              width: 100,
              dataIndex: 'user.name',
              key: 'user.name',
              align: 'center',
            },
            {
              title: '제목',
              width: 300,
              dataIndex: 'title',
              key: 'title',
              align: 'center',
              cellAlign: 'left',
              tooltip: "제목을 클릭하시면 세부 내용 및 첨부파일을 확인할 수 있습니다",
              render: (value, record) => (
                <div
                  className="w-full h-center cursor-pointer justify-left transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
                  onClick={()=>{
                    setSelect(record);
                    setFileIdList(record.files ?? []);
                    setOpen(true);
                  }}
                >
                  {value}
                </div>
              )
            },
            {
              title: '내용',
              minWidth: 100,
              dataIndex: 'content',
              key: 'content',
              align: 'center',
              cellAlign: 'left',
              tooltip: "내용을 클릭하시면 세부 내용 및 첨부파일을 확인할 수 있습니다",
              render: (value, record) => (
                <div
                  className="w-full h-center cursor-pointer justify-left transition--colors duration-300 text-point1 hover:underline hover:decoration-blue-500"
                  onClick={()=>{
                    setSelect(record);
                    setFileIdList(record.files ?? []);
                    setOpen(true);
                  }}
                >
                  {value}
                </div>
              )
            },
            {
              title: '작성일시',
              width: 200,
              dataIndex: 'createdAt',
              key: 'createdAt',
              align: 'center',
              render: (value) => {
                return dayjs(value).format("YYYY-MM-DD HH:mm");
              }
            },
          ]}
          data={data}
          styles={{th_bg:'#E9EDF5',td_bg:'#FFFFFF',round:'14px',line:'n'}}
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
        draggable={true} mask={false}
        title={select?.id ? "공지사항 상세" : "공지사항 등록"}
        contents={<div className="flex flex-col gap-20">
          <div className="w-full h-full min-h-100 bg-white rounded-14 p-20 flex flex-col gap-20">
            <div className="w-full h-full flex flex-col gap-20">
              <div>
                <LabelThin label="제목"/>
                <AntdInput
                  value={select?.title}
                  onChange={(e) => {
                    const { value } = e.target;
                    setSelect({...select, title: value});
                  }}
                  // readonly={select?.id ? true : false}
                />
              </div>
              <div className="w-full">
                <LabelThin label="내용"/>
                <TextArea
                  value={select?.content}
                  onChange={(e) => {
                    const { value } = e.target;
                    setSelect({...select, content:value});
                  }}
                  className="rounded-2"
                  style={{height:200,minHeight:200,background:"#FFF",color:"#222222"}}
                  // disabled={select?.id ? true : false}
                />
              </div>
              <div>
              {/* { !select?.id && */}
                <AntdDragger
                  fileList={fileList}
                  setFileList={setFileList}
                  fileIdList={fileIdList}
                  setFileIdList={setFileIdList}
                  mult={true}
                />
              {/* } */}
              {/* { select?.id && select?.files && select?.files?.length > 0 &&
                select?.files?.map((fileId, index) => (
                <div className="h-center" key={index}>
                  <p className="w-16 h-16 mr-8 min-w-16 min-h-16"><Klip /></p>
                  <div
                    className="text-[#1890FF] cursor-pointer"
                    onClick={()=> downloadFileByObjectName(fileId, fileList[index])}
                  >
                    {fileList[index]?.name}
                  </div>
                </div>
                ))
              } */}
              </div>
            </div>
            { !select?.id &&
              <div className="w-full h-center justify-end">
                <Button type="primary" onClick={handleSubmit}>
                  <Arrow/> 등록
                </Button>
              </div>
            }
            { select?.id &&
              <div className="w-full h-center justify-end">
                <Button type="primary" onClick={handleSubmit}>
                  <Arrow/> 수정
                </Button>
              </div>
            }
          </div>
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
}

export default HomeBoard;