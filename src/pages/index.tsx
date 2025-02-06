import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { useRouter } from "next/router";

const HomePage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  return (
    <div>
      index..
    </div>
  )
}

HomePage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="Home">
    {page}
  </MainPageLayout>
);

export default HomePage;