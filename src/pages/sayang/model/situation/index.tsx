import MainPageLayout from "@/layouts/Main/MainPageLayout";

const SayangModelSitustionPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <>모델 현황...</>
  )
}

SayangModelSitustionPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="모델 등록 및 현황"
    menu={[
      {text:'모델 등록 대기', link:'/sayang/model/wait'},
      {text:'모델 등록 현황', link:'/sayang/model/situation'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangModelSitustionPage;