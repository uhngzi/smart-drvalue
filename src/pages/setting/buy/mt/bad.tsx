import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

const BuyMtBadListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <></>
  )
}

BuyMtBadListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '원자재 및 원자재 구매처', link: '/setting/buy/mt/list' },
      { text: '원자재 불량', link: '/setting/buy/mt/bad' },
      { text: '원자재 단가', link: '/setting/buy/mt/unit' },
    ]}
  >
    {page}
  </SettingPageLayout>
)

export default BuyMtBadListPage;