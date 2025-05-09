import { getAPI } from "@/api/get";
import { baseURL } from "@/api/lib/config";
import { companyType } from "@/data/type/base/company";
import { wkDetailType, wkPlanWaitType } from "@/data/type/wk/plan";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WkDocumentForm: React.FC<{ id: string }> = ({ id }) => {
  // ------------ 디테일 데이터 세팅 ------------ 시작
  const [formData, setFormData] = useState<wkDetailType | null>(null);

  // id 값이 변경될 경우마다 실행됨
  const { data: queryWkProcData } = useQuery({
    queryKey: [
      "worksheet/production-status/process-status/detail/jsxcrud/one",
      id,
    ],
    queryFn: async () => {
      const result = await getAPI({
        type: "core-d2",
        utype: "tenant/",
        url: `worksheet/production-status/process-status/detail/jsxcrud/one/${id}`,
      });

      if (result.resultCode === "OK_0000") {
        const entity = result?.data?.data as wkDetailType;
        setFormData(entity ?? null);
      }

      return result;
    },
    enabled: !!id,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);
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
    <div className="p-15 min-h-[595px] min-w-[1123px] flex flex-col bg-[white]">
      <div className="h-center h-60 w-full">
        <div className="flex flex-col w-100">
          <div className="v-h-center w-full h-2/3">
            {logoBase64 && (
              <img
                src={logoBase64}
                alt="logo"
                width={75}
                height={30}
                style={{ objectFit: "contain", display: "block" }}
              />
            )}
          </div>
          <div className="w-full h-30 text-9 h-center">
            <div className="w-30 h-full border-r border-bdDefault h-center">
              QR
            </div>
            <div className="w-full h-full h-center px-10">
              {formData?.specModel?.fpNo}
              <br />
              {formData?.specModel?.prdMngNo}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="h-center">
            <div>샘플 (신규)</div>
            <div className="flex flex-col">
              <div>납기일자</div>
              <div></div>
            </div>
          </div>
          <div className="h-center">
            <div>이전작업일</div>
            <div></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div>작업지시서</div>
          <div className="flex flex-col">
            <div className="h-center">
              <div>접수일</div>
              <div></div>
            </div>
            <div className="h-center">
              <div>투입일</div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div>무전해금(ENIG)</div>
          <div className="h-center">
            <div>필름번호</div>
            <div></div>
          </div>
        </div>
        <div className="h-center">
          <div>결재</div>
          <div className="flex flex-col">
            <div>작성</div>
            <div></div>
          </div>
          <div className="flex flex-col">
            <div>검토</div>
            <div></div>
          </div>
          <div className="flex flex-col">
            <div>승인</div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WkDocumentForm;
