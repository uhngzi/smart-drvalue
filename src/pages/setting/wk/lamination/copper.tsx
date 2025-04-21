import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

const WkLaminationCopperListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <>
    </>
  )
}

WkLaminationCopperListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '적층구조 자재', link: '/setting/wk/lamination/material' },
      { text: '적층구조 동박', link: '/setting/wk/lamination/copper' },
      { text: '적층구조 요소', link: '/setting/wk/lamination/source' },
    ]}
  >
    {page}
  </SettingPageLayout>
)

export default WkLaminationCopperListPage;