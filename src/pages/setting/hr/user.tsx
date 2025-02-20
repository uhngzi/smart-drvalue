import SettingPageLayout from "@/layouts/Main/SettingPageLayout";
import { Button } from "antd";
import { useRouter } from "next/router";

import People from "@/assets/svg/icons/people.svg";
import UserSetting from "@/assets/svg/icons/user-setting.svg";
import UserFollow from "@/assets/svg/icons/user-follow.svg";
import UserAdd from "@/assets/svg/icons/user-add.svg";
import { useState } from "react";
import BaseTreeCUDModal from "@/components/Modal/BaseTreeCUDModal";

const HrUserListPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const [newOpen, setNewOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newData, setNewData] = useState<any>({});

  function modalOpen(title:string){
    setNewOpen(true);
    setNewTitle(title);
    // setNewData(data);
  }

  function modalClose(){
    setNewOpen(false);
    setNewData({});
  }

  return (
    <section className="flex flex-col gap-20">
      <div>
        <p className="text-18 font-bold">조직도</p>
      </div>
      <div className="flex v-between-h-center">
        <div>
          <p className="text-16 font-medium">조직 설정하기</p>
          <p className="text-14 font-medium" style={{color:'#00000073'}}>회사의 조직도를 관리해보세요.</p>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("조직도")}>
          <People/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>조직도</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("근무형태")}>
          <UserSetting/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>근무형태</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("업무구분")}>
          <UserFollow/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>업무구분</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
        <div className="flex p-20 gap-10 rounded-8 h-center cursor-pointer" style={{border: '1px solid #D9D9D9'}} onClick={() => modalOpen("조직 구성원")}>
          <UserAdd/>
          <div className="flex flex-col gap-3">
            <span className="text-16 fw-500" style={{color:'#000000D9'}}>조직 구성원</span>
            <span style={{color:'#00000073'}}>회사 조직 구조를 한눈에 파악할 수 있도록 조직도를 설정하세요.</span>
          </div>
        </div>
      </div>
      <BaseTreeCUDModal
        title={{name: `${newTitle} 설정`}}
        open={newOpen} 
        setOpen={setNewOpen} 
        onClose={() => modalClose()}
        onSubmit={() => {}}
        onDelete={() => {}}/>
    </section>
  )
}

HrUserListPage.layout = (page: React.ReactNode) => (
  <SettingPageLayout>{page}</SettingPageLayout>
)

export default HrUserListPage;