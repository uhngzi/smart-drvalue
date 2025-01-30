import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

const CompanyBaseListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <></>
  )
}

CompanyBaseListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default CompanyBaseListPage;