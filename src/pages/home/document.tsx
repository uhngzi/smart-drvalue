import AntdModal from "@/components/Modal/AntdModal";
import { TabLarge } from "@/components/Tab/Tabs";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { Button, Empty } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";

import FilmDocumentForm from "@/contents/documentForm/FilmDocumentForm";
import OrderDocumentForm from "@/contents/documentForm/OrderDocumentForm";
import EstimateDocumentForm from "@/contents/documentForm/EstimateDocumentForm";

const HomeDocumentPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="h-[calc(100vh-192px)]">
      <Button onClick={()=>{setOpen(true)}}>
        임시
      </Button>

      <AntdModal
        open={open}
        setOpen={setOpen}
        title={"미리보기"}
        contents={
          <EstimateDocumentForm />
        }
        width={635}
      />
    </div>
  )
}

HomeDocumentPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="샘플 페이지"
  >
    {page}
  </MainPageLayout>
);

export default HomeDocumentPage;