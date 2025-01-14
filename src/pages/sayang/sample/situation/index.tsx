import MainPageLayout from "@/layouts/Main/MainPageLayout";

interface Props {

}

const SayangSampleSituationPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <>등록 현황...</>
  )
}

SayangSampleSituationPage.layout = (page: React.ReactNode) => (
  <MainPageLayout 
    menuTitle="샘플-사양등록및현황"
    menu={[
      {text:'사양 및 생산의뢰 등록대기', link:'/sayang/sample/add'},
      {text:'사양 및 생산의뢰 등록현황', link:'/sayang/sample/situation'},
    ]}
  >{page}</MainPageLayout>
)

export default SayangSampleSituationPage;