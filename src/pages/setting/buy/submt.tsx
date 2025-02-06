import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useRouter } from "next/router";

const BuySubMtListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  return (
    <></>
  )
}

BuySubMtListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default BuySubMtListPage;