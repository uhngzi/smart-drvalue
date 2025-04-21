import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

const BuyUnitThicknessListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <>
    </>
  )
}

BuyUnitThicknessListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout styles={{pd:'70px'}}
    menu={[
      { text: '모델 단가', link: '/setting/buy/unit/model' },
      { text: '추가비용(두께)', link: '/setting/buy/unit/thickness' },
      { text: '재질', link: '/setting/buy/unit/texture' },
      { text: '특별사양', link: '/setting/buy/unit/special' },
    ]}
  >
    {page}
  </SettingPageLayout>
)

export default BuyUnitThicknessListPage;