import Project from "@/contents/project/Project";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { useRouter } from "next/router";

// 함수형 컴포넌트로 작성된 projcet 페이지
const ProjcetPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  return(
    <>
      <Project id={id?.toString() ?? ""} />
    </>
  )
}
ProjcetPage.layout = (page: React.ReactNode) => (
    <MainPageLayout
      menuTitle="일정/인력관리"
      bg="#f5f6fa"
      pd="0"
      modal={true} head={true}
    >{page}</MainPageLayout>
  );

export default ProjcetPage;
