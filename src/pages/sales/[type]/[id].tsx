import { useRouter } from "next/router";
import OrderAddLayout from "@/contents/sales/order/add/OrderAdd";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import ModelAddLayout from "@/contents/sales/model/ModelAdd";
import EstimateAddLayout from "@/contents/sales/estimate/EstimateAdd";

const AddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type, id } = router.query;

  return type === "model" ? <ModelAddLayout /> : <div>견적 등록 페이지</div>;
};

AddPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="모달" head={false} modal={true}>
    {page}
  </MainPageLayout>
);

export default AddPage;
