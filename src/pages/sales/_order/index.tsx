import MainPageLayout from "@/layouts/Main/MainPageLayout";

const SalesOrderPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <>
      수주 페이지
    </>
  )
};

SalesOrderPage.layout = (page: React.ReactNode) => {
  return <MainPageLayout menuTitle="수주">{page}</MainPageLayout>
};

export default SalesOrderPage;