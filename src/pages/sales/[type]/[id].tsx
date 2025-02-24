import { useRouter } from "next/router";
import PopRegLayout from "@/layouts/Main/PopRegLayout";
import OrderAddLayout from "@/contents/sales/order/add/OrderAdd";

const AddPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { type, id } = router.query;

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