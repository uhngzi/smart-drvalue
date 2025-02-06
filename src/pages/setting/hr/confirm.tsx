import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useRouter } from "next/router";

const HrConfirmListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  return (
    <></>
  )
}

HrConfirmListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default HrConfirmListPage;