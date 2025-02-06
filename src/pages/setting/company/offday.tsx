import SettingPageLayout from "@/layouts/Main/SettingPageLayout";

const CompanyOffdayListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  return (
    <></>
  )
}

CompanyOffdayListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default CompanyOffdayListPage;