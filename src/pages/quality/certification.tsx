import MainPageLayout from "@/layouts/Main/MainPageLayout";
import AntdTableEdit from "@/components/List/AntdTableEdit";
import { useMenu } from "@/data/context/MenuContext";
import { useUser } from "@/data/context/UserContext";
import { List } from "@/layouts/Body/List";
import { ListPagination } from "@/layouts/Body/Pagination";
import useToast from "@/utils/useToast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const QualityCertificationPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { me } = useUser();
  const { selectMenu } = useMenu();
  const { showToast, ToastContainer } = useToast();

  // ------------- 페이지네이션 세팅 ------------ 시작
  const [searchs, setSearchs] = useState<string>("");
  const [sQueryJson, setSQueryJson] = useState<string>("");
  useEffect(() => {
    if (searchs.length < 2) setSQueryJson("");
  }, [searchs]);
  const handleSearchs = () => {
    if (searchs.length < 2) {
      showToast("2글자 이상 입력해주세요.", "error");
      return;
    }
    // url를 통해 현재 메뉴를 가져옴
    const jsx = selectMenu?.children?.find((f) =>
      router.pathname.includes(f.menuUrl ?? "")
    )?.menuSearchJsxcrud;
    if (jsx) {
      setSQueryJson(jsx.replaceAll("##REPLACE_TEXT##", searchs));
    } else {
      setSQueryJson("");
    }
  };
  // ------------- 페이지네이션 세팅 ------------ 끝

  // ------------ 리스트 데이터 세팅 ------------ 시작
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
  });
  const handlePageChange = (page: number, size: number) => {
    setPagination({ current: page, size: size });
  };
  const [data, setData] = useState<any[]>([]);
  // const { data:queryData, isLoading, refetch } = useQuery({
  //   queryKey: ['sales-order/product/worksheet/jsxcrud/many', pagination, sQueryJson],
  //   queryFn: async () => {
  //     return getAPI({
  //       type: 'core-d1',
  //       utype: 'tenant/',
  //       url: 'sales-order/product/worksheet/jsxcrud/many'
  //     },{
  //       limit: pagination.size,
  //       page: pagination.current,
  //       s_query: sQueryJson.length > 1 ? JSON.parse(sQueryJson) : undefined,
  //     });
  //   }
  // });

  // useEffect(()=>{
  //   setDataLoading(true);
  //   if(!isLoading) {
  //     const arr = (queryData?.data?.data ?? []).map((item:salesOrderWorkSheetType) => ({
  //       ...item,
  //       m2: Math.floor(((item.worksheet?.specModel?.spec?.wksizeH ?? 0) * (item.worksheet?.specModel?.spec?.wksizeW ?? 0)) / 1000000 * (item.worksheet?.specModel?.prdCnt ?? 0) * 100) / 100,
  //     }))
  //     setData(arr);
  //     setTotalData(queryData?.data?.total ?? 0);
  //     setDataLoading(false);
  //   }
  // }, [queryData]);
  // ------------ 리스트 데이터 세팅 ------------ 끝

  return (
    <>
      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        // handleMenuClick={handlePageMenuClick}
        searchs={searchs}
        setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />

      <List>
        <AntdTableEdit
          columns={[]}
          data={data}
          styles={{
            th_bg: "#E9EDF5",
            td_bg: "#FFFFFF",
            round: "14px",
            line: "n",
          }}
          loading={dataLoading}
        />
      </List>

      <ListPagination
        pagination={pagination}
        totalData={totalData}
        onChange={handlePageChange}
        // handleMenuClick={handlePageMenuClick}
        searchs={searchs}
        setSearchs={setSearchs}
        handleSearchs={handleSearchs}
      />

      <ToastContainer />
    </>
  );
};

QualityCertificationPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="인증 현황">{page}</MainPageLayout>
);

export default QualityCertificationPage;
