import { useRouter } from "next/router";
import PopRegLayout from "@/layouts/Main/PopRegLayout";
import OrderAddPage from "@/contents/sales/order/add/OrderAdd";

let title = "";

const AddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type, id } = router.query;

  title = type === "order" ? "고객 발주" : "견적";
  title += id?.includes('new') ? " 등록" : " 수정";

  return (
    type === "order" ?
    <OrderAddPage />
    :
    <div>견적 등록 페이지</div>
  );
};

AddPage.layout = (page: React.ReactNode) => (
  <PopRegLayout title={title}>{page}</PopRegLayout>
);

export default AddPage;