import { TabLarge } from "@/components/Tab/Tabs";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { Empty } from "antd";
import { useRouter } from "next/router";

const HomeAlarmPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-192px)]">
      <TabLarge
        items={[
          { text: '나의할일', link: '/home/mytodo' },
          { text: '알림', link: '/home/alarm' },
          { text: '회사소식', link: '/home/company' },
        ]}
        pathname={router.pathname === "/" ? '/home/mytodo' : router.pathname}
      />
      <div className="h-full v-h-center">
        <Empty />
      </div>
    </div>
  )
}

HomeAlarmPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="홈 피드"
  >
    {page}
  </MainPageLayout>
);

export default HomeAlarmPage;