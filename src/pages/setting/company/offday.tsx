import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { formatDateDay, getHoliday } from "@/utils/third-party-api";
import { Button, Dropdown, MenuProps, Modal, Switch } from "antd";

import Plus from "@/assets/svg/icons/s_plus.svg";
import Korea from "@/assets/png/korea.png";
import Christmas from "@/assets/png/christmas.png";
import Worker from "@/assets/png/worker.png";
import Edit from "@/assets/svg/icons/edit.svg";
import Trash from "@/assets/svg/icons/red-trash.svg";

import Image, { StaticImageData } from "next/image";
import FullChip from "@/components/Chip/FullChip";
import { useEffect, useState } from "react";
import AntdModal from "@/components/Modal/AntdModal";
import CardInputList from "@/components/List/CardInputList";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 로케일
import "dayjs/locale/en"; // 영어 로케일
import { newDataOffdayType, offdayCUType } from "@/data/type/base/offday";
import { postAPI } from "@/api/post";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";
import { deleteAPI } from "@/api/delete";

interface HolidayItem {
  id: number | string | null;
  imgType: keyof typeof holidayImg;
  dateName: string;
  locdate: string;
  dateKind: string;
}
interface OffDeleteType {
  id: number | string | null;
  dateName: string;
}

const holidayImg: { [key: string]: StaticImageData } = {
  korea: Korea,
  tree: Christmas,
  worker: Worker,
};

const items: MenuProps["items"] = [
  {
    label: (
      <span className="text-12" style={{ color: "#E76735" }}>
        삭제
      </span>
    ),
    key: "1",
    icon: (
      <span className="w-16 h-16">
        <Trash />
      </span>
    ),
  },
];

const CompanyOffdayListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [offDayList, setOffDayList] = useState<HolidayItem[]>([]);
  const [addOffOpen, setAddOffOpen] = useState<boolean>(false);
  const [addOffData, setAddOffData] = useState<offdayCUType | null>(null);

  const [deleteOffData, setDeleteOffData] = useState<OffDeleteType | null>(
    null
  );
  const [deletePopOpen, setDeletePopOpen] = useState<boolean>(false);

  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<AlertType>("success");
  const [resultTitle, setResultTitle] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");

  const year = new Date().getFullYear();

  const {
    data: offDayData,
    isFetching,
    refetch,
  } = useQuery<apiGetResponseType, Error>({
    queryKey: ["offDay", year],
    queryFn: async () => {
      const result = await getAPI({
        type: "baseinfo",
        utype: "tenant/",
        url: "offday/jsxcrud/many",
      });
      return result;
    },
  });

  async function apiAddOffDay() {
    console.log(!addOffData?.offdayRemarks);
    if (!addOffData?.offdayRemarks) {
      setResultOpen(true);
      setResultTitle("등록 실패");
      setResultText("휴일명을 입력해주세요.");
      setResultType("error");
      return;
    }
    // if(!addOffData?.offdayDt) {
    //   setResultOpen(true);
    //   setResultTitle('등록 실패');
    //   setResultText('날짜를 선택해주세요.');
    //   setResultType('error');
    //   return;
    // }

    const result = await postAPI(
      {
        type: "baseinfo",
        utype: "tenant/",
        url: "offday",
        jsx: "jsxcrud",
      },
      {
        ...addOffData,
        offdayDt: addOffData.offdayDt
          ? dayjs(addOffData.offdayDt).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
      }
    );

    if (result.resultCode === "OK_0000") {
      refetch();
      setResultOpen(true);
      setResultTitle("등록 성공");
      setResultText("쉬는 날이 등록되었습니다.");
      setAddOffData(newDataOffdayType);
      setAddOffOpen(false);
      setResultType("success");
    } else {
      setResultOpen(true);
      setResultTitle("등록 실패");
      setResultText("쉬는 날 등록을 실패했습니다.");
      setAddOffData(newDataOffdayType);
      setResultType("error");
    }
  }
  async function apiDeleteOffDay() {
    const result = await deleteAPI(
      {
        type: "baseinfo",
        utype: "tenant/",
        url: "offday",
        jsx: "jsxcrud",
      },
      deleteOffData?.id?.toString() ?? ""
    );

    if (result.resultCode === "OK_0000") {
      refetch();
      setResultOpen(true);
      setResultTitle("삭제 성공");
      setResultText("쉬는 날이 삭제되었습니다.");
      setDeletePopOpen(false);
      setResultType("success");
    } else {
      setResultOpen(true);
      setResultTitle("삭제 실패");
      setResultText("쉬는 날 삭제를 실패했습니다.");
      setResultType("error");
    }
  }

  function deletePop(id: number | string | null, dateName: string) {
    console.log(id, dateName);
    if (!id) {
      setResultOpen(true);
      setResultTitle("삭제 실패");
      setResultText("법정 공휴일은 삭제할 수 없습니다.");
      setResultType("error");
    } else {
      setDeleteOffData({ id, dateName });
      setDeletePopOpen(true);
    }
  }
  function changeOffDayData(
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | string
      | boolean,
    name: string,
    type: "input" | "select" | "date" | "other"
  ) {
    const data = {
      offdayTypeEm: "holiday",
      offdayRepeatYn: true,
      useYn: true,
    } as any;

    if (typeof e === "string" || typeof e === "boolean") {
      data[name] = e;
      if (name === "offdayDt" && typeof e === "string") {
        data.offdayWk = dayjs(e).locale("ko").format("dddd") as
          | "월요일"
          | "화요일"
          | "수요일"
          | "목요일"
          | "금요일"
          | "토요일"
          | "일요일";
        data.offdayWkEng = dayjs(e).locale("en").format("dddd") as
          | "Monday"
          | "Tuesday"
          | "Wednesday"
          | "Thursday"
          | "Friday"
          | "Saturday"
          | "Sunday";
      }
    } else {
      const { value } = e.target;
      data[name] = value;
    }
    setAddOffData((prev) => ({ ...prev, ...data }));
  }

  useEffect(() => {
    // 휴일정보에서 dateKind가 1이면 공휴일 매년 반복 , 2이면 임시, 대체공휴일, 3이면 추가한 지정 휴일
    if (!isFetching) {
      const offDayList = offDayData?.data?.data.map((item: any) => ({
        id: item.id,
        imgType: "worker",
        dateName: item.offdayRemarks,
        locdate: Number(item.offdayDt.replaceAll("-", "")),
        dateKind: "03",
      }));

      getHoliday(year).then((res) => {
        const allOffDays = [...offDayList, ...res];
        const allOffDayList = allOffDays
          .sort((a: any, b: any) => a.locdate - b.locdate)
          .map((off: any) => ({ ...off, locdate: formatDateDay(off.locdate) }));
        console.log(allOffDayList);
        setOffDayList(allOffDayList);
      });
    }
  }, [isFetching]);

  function offPopClose() {
    setAddOffData(newDataOffdayType);
    setAddOffOpen(false);
  }

  return (
    <section className="flex flex-col gap-20">
      <div>
        <p className="text-18 font-bold">쉬는 날 목록</p>
      </div>
      <div className="flex v-between-h-center">
        <div>
          <p className="text-16 font-medium">
            2025년{" "}
            <span className="text-16 font-medium" style={{ color: "#03C75A" }}>
              총 {offDayList.length}일
            </span>
          </p>
          <p className="text-14 font-medium" style={{ color: "#00000073" }}>
            국가에서 지정한 법정 공휴일 외에 별도의 휴일을 지정하여 운영할 수
            있습니다.
          </p>
        </div>
        <Button onClick={() => setAddOffOpen(true)}>
          <Plus />
          쉬는 날 추가
        </Button>
      </div>
      <section className="flex flex-col gap-10">
        {offDayList.map((item: any, index: number) => (
          <div
            className="flex p-20 gap-10 rounded-8 h-center"
            style={{ border: "1px solid #D9D9D9" }}
            key={index}
          >
            <p className="flex-1 flex gap-20 h-center">
              <Image
                src={holidayImg[item.imgType]}
                alt="holidayImg"
                width={24}
                height={24}
              />
              <span className="text-16 font-medium">{item.dateName}</span>
              <span
                className="text-14 font-medium"
                style={{ color: "#00000073" }}
              >
                {item.locdate}
              </span>
            </p>
            <FullChip
              label={`${item.dateKind === "01" ? "매년" : "대체공휴일"}`}
              state={`${item.dateKind === "01" ? "purple" : "default"}`}
              className="text-12"
            />
            <Button size="small" type="text" className="!p-0">
              <Dropdown
                trigger={["click"]}
                menu={{
                  items,
                  onClick: () => deletePop(item.id, item.dateName),
                }}
              >
                <span className="w-24 h-24">
                  <Edit />
                </span>
              </Dropdown>
            </Button>
          </div>
        ))}
      </section>
      <AntdModal
        title="쉬는 날 추가"
        width={600}
        draggable={true}
        open={addOffOpen}
        setOpen={setAddOffOpen}
        onClose={offPopClose}
        bgColor="#fff"
        contents={
          <div>
            <CardInputList
              title=""
              styles={{ gap: "gap-20" }}
              items={[
                {
                  value: addOffData?.offdayRemarks,
                  name: "offdayRemarks",
                  label: "",
                  type: "input",
                  widthType: "full",
                },
                {
                  value: addOffData?.offdayDt,
                  name: "offdayDt",
                  label: "날짜 선택",
                  type: "date",
                  widthType: "full",
                },
                {
                  value: "",
                  name: "abc",
                  label: "대체 휴일 설정",
                  type: "custom",
                  widthType: "half",
                  customhtml: (
                    <Switch
                      className="scale-110 ml-5"
                      checkedChildren="사용함"
                      unCheckedChildren="사용안함"
                      defaultChecked
                    />
                  ),
                },
                {
                  value: "",
                  name: "offdayRepeatYn",
                  label: "반복 설정",
                  type: "custom",
                  widthType: "half",
                  customhtml: (
                    <Switch
                      checked={addOffData?.offdayRepeatYn}
                      className="scale-110 ml-5"
                      checkedChildren="사용함"
                      unCheckedChildren="사용안함"
                      defaultChecked
                      onChange={(checked) =>
                        changeOffDayData(checked, "offdayRepeatYn", "other")
                      }
                    />
                  ),
                },
              ]}
              handleDataChange={changeOffDayData}
            />
            <div className="h-[50px] mx-10">
              <Button
                type="primary"
                size="large"
                onClick={apiAddOffDay}
                className="w-full flex h-center gap-8 !h-full"
                style={{
                  background:
                    "linear-gradient(90deg, #008A1E 0%, #03C75A 100%)",
                }}
              >
                <span>만들기</span>
              </Button>
            </div>
          </div>
        }
      />
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultTitle}
        contents={resultText}
        type={resultType}
        onOk={() => {
          refetch();
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="base"
      />
      <Modal
        open={deletePopOpen}
        width={308}
        centered
        footer={null}
        closeIcon={null}
      >
        <section className="px-10 pt-6 flex flex-col gap-20">
          <div className="flex flex-col gap-20 h-center">
            <span className="font-medium text-18 leading-[18px]">
              {deleteOffData?.dateName}을 삭제할까요?
            </span>
            <span
              className="leading-[24px] text-center"
              style={{ color: "#00000073" }}
            >
              삭제하려는 날에 휴일 대체 기록이 있다면, 해당 휴일 대체 기록은
              취소됩니다.
            </span>
          </div>
          <div className="flex flex-col gap-5">
            <Button
              size="large"
              onClick={() => apiDeleteOffDay()}
              className="w-full flex h-center gap-8 !h-[50px]"
              style={{ background: "#E76735" }}
            >
              <span className="text-14" style={{ color: "#fff" }}>
                이 일정 및 향후 일정 삭제
              </span>
            </Button>
            <Button
              size="large"
              onClick={() => apiDeleteOffDay()}
              className="w-full flex h-center gap-8 !h-[50px]"
            >
              <span className="text-14" style={{ color: "#000000A6" }}>
                모든 일정 삭제
              </span>
            </Button>
            <Button
              type="text"
              size="large"
              onClick={() => setDeletePopOpen(false)}
              className="w-full flex h-center gap-8 !h-[50px]"
            >
              <span className="text-14" style={{ color: "#038D07" }}>
                취소
              </span>
            </Button>
          </div>
        </section>
      </Modal>
    </section>
  );
};

CompanyOffdayListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
);

export default CompanyOffdayListPage;
