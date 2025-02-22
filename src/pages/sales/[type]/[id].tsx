import { useRouter } from "next/router";
import PopRegLayout from "@/layouts/Main/PopRegLayout";
import OrderAddLayout from "@/contents/sales/order/add/OrderAdd";

let title = "";

const AddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type, id } = router.query;

  title = type
  ? `${type === "order" ? "고객 발주" : "견적"} ${id?.includes("new") ? "등록" : "수정"}`
  : "로딩 중...";

  return (
    type === "order" ?
    <OrderAddLayout />
    :
    <div>견적 등록 페이지</div>
  );
};

AddPage.layout = (page: React.ReactNode) => (
  <PopRegLayout head={false}>{page}</PopRegLayout>
);

export default AddPage;