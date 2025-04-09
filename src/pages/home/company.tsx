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
import { Empty } from "antd";
import { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SplusIcon from "@/assets/svg/icons/s_plus.svg";
import Arrow from "@/assets/svg/icons/t-r-arrow.svg";
import Klip from '@/assets/svg/icons/klip.svg';

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

const HomeCompanyPage: React.FC & {
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
  const [open, setOpen] = useState<boolean>(false);
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
      // const val = validReq(select, errReq());
      // if(!val.isValid) {
      //   showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
      //   return;
      // }
      
      console.log(JSON.stringify(select));
      const result = await postAPI({
        type: 'core-d3',
        utype: 'root/',
        url: 'notice-board',
        jsx: 'jsxcrud'},
        { ...select, id: undefined }
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
      <div className="w-full h-50">
        <ListTitleBtn
          label="신규"
          onClick={()=>{
            setOpen(true);
          }}
          icon={<SplusIcon stroke="#FFF"className="w-16 h-16"/>}
        />
      </div>
    </div>
  )
}

HomeCompanyPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="홈 피드"

  >
    {page}
  </MainPageLayout>
);

export default HomeCompanyPage;