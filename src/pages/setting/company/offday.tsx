import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { formatDateDay, getHoliday } from "@/utils/third-party-api";
import { Button, Switch } from "antd";

import Plus from "@/assets/svg/icons/s_plus.svg";
import Korea from "@/assets/png/korea.png";
import Christmas from "@/assets/png/christmas.png";
import Worker from "@/assets/png/worker.png";
import Edit from "@/assets/svg/icons/edit.svg";

import Image, { StaticImageData } from "next/image";
import FullChip from "@/components/Chip/FullChip";
import { useEffect, useState } from "react";
import AntdModal from "@/components/Modal/AntdModal";
import CardInputList from "@/components/List/CardInputList";
import { useQuery } from "@tanstack/react-query";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { getAPI } from "@/api/get";
import dayjs from "dayjs";
import 'dayjs/locale/ko';  // 한글 로케일
import 'dayjs/locale/en';  // 영어 로케일
import { offdayCUType } from "@/data/type/base/offday";
import { postAPI } from "@/api/post";
import AntdAlertModal, { AlertType } from "@/components/Modal/AntdAlertModal";

interface HolidayItem {
  id: number | string | null;
  imgType: keyof typeof holidayImg;
  dateName: string;
  locdate: string;
  dateKind: string;
}

const holidayImg: { [key: string]: StaticImageData } = {
  korea : Korea,
  tree: Christmas,
  worker: Worker,
};

const CompanyOffdayListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const [offDayList, setOffDayList] = useState<HolidayItem[]>([]);
  const [addOffOpen, setAddOffOpen] = useState<boolean>(false);
  const [addOffData, setAddOffData] = useState<offdayCUType | null>(null);

  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultType, setResultType] = useState<AlertType>('success');
  const [resultText, setResultText] = useState<string>('');


  const year = new Date().getFullYear();

  const { data: offDayData, isFetching, refetch } = useQuery<apiGetResponseType, Error>({
    queryKey: ['offDay', year],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'offday/jsxcrud/many'
      })
      return result;
    }
  });

  async function addOffDay() {
    console.log(!addOffData?.offdayRemarks)
    if(!addOffData?.offdayRemarks) {
      setResultOpen(true);
      setResultText('휴일명을 입력해주세요.');
      setResultType('error');
      return;
    }
    if(!addOffData?.offdayDt) {
      setResultOpen(true);
      setResultText('날짜를 선택해주세요.');
      setResultType('error');
      return;
    }

    const result = await postAPI({
      type: 'baseinfo',
      utype: 'tenant/',
      url: 'offday',
      jsx: 'jsxcrud',
    }, addOffData);

    if(result.resultCode === 'OK_0000') {
      refetch();
      setResultOpen(true);
      setResultText('쉬는 날이 등록되었습니다.');
      setAddOffOpen(false);
      setResultType('success');
    } else {
      setResultOpen(true);
      setResultText('쉬는 날 등록을 실패했습니다.');
      setResultType('error');
    }
  }

  function changeOffDayData(
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string | boolean,
      name: string,
      type: 'input' | 'select' | 'date' | 'other',
    ) {
      const data = {
        offdayTypeEm : 'holiday',
        offdayRepeatYn: true,
        useYn: true
      } as any;

      if(typeof e === "string" || typeof e === "boolean") {
        data[name] = e;
        if(name === 'offdayDt' && typeof e === "string") {
          data.offdayWk = dayjs(e).locale('ko').format('dddd') as "월요일" | "화요일" | "수요일" | "목요일" | "금요일" | "토요일" | "일요일";
          data.offdayWkEng = dayjs(e).locale('en').format('dddd') as "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
        }
      } else {
        const { value } = e.target;
        data[name] = value;
      }
      setAddOffData(prev => ({...prev, ...data}));
    }
  
  useEffect(() => {
    // 휴일정보에서 dateKind가 1이면 공휴일 매년 반복 , 2이면 임시, 대체공휴일, 3이면 추가한 지정 휴일
      if(!isFetching){
        const offDayList = (offDayData?.data?.data ?? []).map((item: any) => (
          {
            id: item.id,
            imgType: 'worker',
            dateName: item.offdayRemarks,
            locdate: Number(item.offdayDt.replaceAll('-','')),
            dateKind: '03',
          }
        ))
        console.error(offDayList)
        getHoliday(year).then((res) => {
          const allOffDays = [...offDayList, ...res];
          const allOffDayList = allOffDays.sort((a:any, b:any) => a.locdate - b.locdate)
                                  .map((off:any) => ({...off, locdate: formatDateDay(off.locdate)}));
          console.log(allOffDayList)
          setOffDayList(allOffDayList);
        });
      }
  }, [isFetching]);


  return (
    <section className="flex flex-col gap-20">
      <div>
        <p className="text-18 font-bold">쉬는 날 목록</p>
      </div>
      <div className="flex v-between-h-center">
        <div>
          <p className="text-16 font-medium">2025년 <span className="text-16 font-medium" style={{color:'#444444'}}>총 1일</span></p>
          <p className="text-14 font-medium" style={{color:'#00000073'}}>국가에서 지정한 법정 공휴일 외에 별도의 휴일을 지정하여 운영할 수 있습니다.</p>
        </div>
        <Button onClick={() => setAddOffOpen(true)}><Plus/>쉬는 날 추가</Button>
      </div>
      <section className="flex flex-col gap-10">
        {offDayList.map((item: any, index: number) => (
          <div className="flex p-20 gap-10 rounded-8 h-center" style={{border:'1px solid #D9D9D9'}} key={index}>
            <p className="flex-1 flex gap-20 h-center">
              <Image src={holidayImg[item.imgType]} alt="holidayImg" width={24} height={24}/>
              <span className="text-16 font-medium">{item.dateName}</span>
              <span className="text-14 font-medium" style={{color:'#00000073'}}>{item.locdate}</span>
            </p>
            <FullChip label={`${item.dateKind === '01' ? '매년' : '대체공휴일'}`} state={`${item.dateKind === '01' ? 'purple' : 'default'}`} className="text-12"/>
            <Button size="small" type="text" className="!p-0"><span className="w-24 h-24"><Edit /></span></Button>
          </div>
        ))}
      </section>
      <AntdModal
        title="쉬는 날 추가"
        width={600}
        open={addOffOpen}
        setOpen={setAddOffOpen}
        bgColor="#fff"
        contents={
          <div>
            <CardInputList title="" styles={{gap:'gap-20'}} items={[
              {value:addOffData?.offdayRemarks, name:'offdayRemarks',label:'', type:'input', widthType:'full'},
                {value:addOffData?.offdayDt, name:'offdayDt',label:'날짜 선택', type:'date', widthType:'full'},
                {value:'', name:'abc',label:'대체 휴일 설정', type:'custom', widthType:'half',
                  customhtml: <Switch className="scale-110 ml-5" checkedChildren="사용함" unCheckedChildren="사용안함" defaultChecked />
                },
                {value:'', name:'offdayRepeatYn',label:'반복 설정', type:'custom', widthType:'half',
                  customhtml: <Switch checked={addOffData?.offdayRepeatYn} className="scale-110 ml-5" checkedChildren="사용함" unCheckedChildren="사용안함" 
                    defaultChecked onChange={(checked) => changeOffDayData(checked, 'offdayRepeatYn', 'other')} />
                },
            ]} handleDataChange={changeOffDayData}/>
            <div className="h-[50px] mx-10">
              <Button type="primary" size="large" onClick={addOffDay} 
                className="w-full flex h-center gap-8 !h-full" 
                style={{background: 'linear-gradient(90deg, #008A1E 0%, #03C75A 100%)'}}>
                <span>만들기</span>
              </Button>
            </div>
          </div>
        }
      />
      <AntdAlertModal
        open={resultOpen}
        setOpen={setResultOpen}
        title={resultType === "success" ? "등록 성공" : "등록 실패"}
        contents={resultText}
        type={resultType} 
        onOk={()=>{
          refetch();
          setResultOpen(false);
        }}
        hideCancel={true}
        theme="base"
      />
    </section>
  )
}

CompanyOffdayListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default CompanyOffdayListPage;