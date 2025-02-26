import { getAPI } from "@/api/get";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { errBoardType, errCommentType } from "@/data/type/err/err";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

const ErrBoardDetailPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { id } = router.query;


  return (
    <>

    </>
  )
}

ErrBoardDetailPage.layout = (page: React.ReactNode) => (
  <MainPageLayout menuTitle="오류 상세">{page}</MainPageLayout>
);

export default ErrBoardDetailPage;