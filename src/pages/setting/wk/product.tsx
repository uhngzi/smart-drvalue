import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useRouter } from "next/router";

const WkProductListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  return (
    <></>
  )
}

WkProductListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default WkProductListPage;