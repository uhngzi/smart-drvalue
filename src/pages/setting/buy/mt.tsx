import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useRouter } from "next/router";

const BuyMtListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  return (
    <></>
  )
}

BuyMtListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default BuyMtListPage;