import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { useRouter } from "next/router";

const BuyOutListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  return (
    <></>
  )
}

BuyOutListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default BuyOutListPage;