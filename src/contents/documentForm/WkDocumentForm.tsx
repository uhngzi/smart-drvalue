import { getAPI } from "@/api/get";
import { baseURL } from "@/api/lib/config";
import { companyType } from "@/data/type/base/company";
import { wkPlanWaitType } from "@/data/type/wk/plan";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WkDocumentForm: React.FC<{ id: string }> = ({ id }) => {
  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [formData, setFormData] = useState<wkPlanWaitType | null>(null);

  // id 값이 변경될 경우마다 실행됨
  const { data: queryDetailData } = useQuery({
    queryKey: ["worksheet/wait-for-production-plan/jsxcrud/one", id],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d2",
        utype: "tenant/",
        url: `worksheet/wait-for-production-plan/jsxcrud/one/${id}`,
      });

      if (result.resultCode === "OK_0000") {
        const entity = result.data.data as wkPlanWaitType;
        setFormData(entity ?? null);
      }

      return result;
    },
    enabled: !!id,
  });
  // ------------ 디테일 데이터 세팅 ------------ 끝

  // 회사 기본 정보 가져오는 api
  const [company, setCompany] = useState<companyType | null>(null);
  const { data: queryCompanyData } = useQuery({
    queryKey: ["company-default/jsxcrud/one"],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "company-default/jsxcrud/one",
      });

      if (result.resultCode === "OK_0000") {
        setCompany(result.data.data);
      } else {
        setCompany(null);
      }

      return result;
    },
  });

  const [logoBase64, setLogoBase64] = useState<string>("");
  useEffect(() => {
    const fetchLogo = async () => {
      if (!company?.companyLogoId) return;

      const response = await fetch(
        `${baseURL}file-mng/v1/every/file-manager/download/${company.companyLogoId}`
      );

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    };

    fetchLogo();
  }, [company?.companyLogoId]);

  return (
    <div className="flex w-full items-center justify-center flex-col bg-[white]"></div>
  );
};

export default WkDocumentForm;
