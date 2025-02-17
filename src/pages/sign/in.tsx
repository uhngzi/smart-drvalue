import { instance } from "@/api/lib/axios";
import { cookieName } from "@/api/lib/config";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { Button, Input, Modal } from "antd";
import cookie from "cookiejs";
import { useRouter } from "next/router";
import { useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import AuthPageLayout from "@/layouts/Main/AuthPageLayout";


import User from "@/assets/svg/icons/user.svg";
import Lock from "@/assets/svg/icons/lock.svg";

const gradientStyle = {
  background: 'linear-gradient(91.55deg, #4880FF 12%, #03C75A 30%, #038D07 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '2rem',
  fontWeight: 'bold',
};

const SignInPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();

  const [idFocused, setIdFocused] = useState<boolean>(false);
  const [pwFocused, setPwFocused] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<"success" | "error">("success");

  const [signInForm, setSignInForm] = useState({
    id: '',
    pw: '',
  });

  const handleSignIn = async (id: string, pw: string) => {
    try {
      const response = await instance.post('auth/v1/login/tenant/basic', {
        userId: 'test',
        password: 'test1234',
      });

      const { data, resultCode } = response.data;
      
      if (resultCode === 'OK_0000') {
        cookie.set(cookieName, data.accessToken, { expires: 7 });
        router.push('/');
        // setOpen(true);
        // setType("success");
        // console.log("ok", open, type);
      } else {
        // setOpen(true);
        // setType("error");
      }
    } catch (e) {
      // setOpen(true);
      // setType("error");
    }
  };

  return (
    <div className="w-[400px] flex flex-col gap-40">
      <div className="flex flex-col gap-5 h-center">
        <span className="font-bold leading-[26px] tracking-[-0.16px]" style={{color:'#999999'}}>무한 성장을 위한 확장이 필수인 시대,</span>
        <span className="leading-[36.8px] tracking-[-0.32px]" style={gradientStyle}>GrowX</span>
      </div>
      <div className="flex flex-col gap-10">
        <div className="pl-18 flex gap-20 h-center rounded-8 h-[56px]" style={{border:'1px solid #D9D9D9'}}>
          <span className="w-24 h-24"><User/></span>
          <div className="relative mt-10 w-full">
            {/* Floating Label */}
            <label
              className={`absolute left-3 transition-all duration-300 ${
                idFocused || signInForm.id
                  ? 'top-[-14px] text-12 text-gray-400 bg-white px-1' 
                  : 'top-0 text-12 text-gray-400'
              }`}
            >
              아이디
            </label>
            <Input
              variant="borderless"
              className="input text-12 font-medium"
              value={signInForm.id}
              onFocus={() => setIdFocused(true)}
              onBlur={() => setIdFocused(false)}
              onChange={e => {
                setSignInForm(prev => ({ ...prev, id: e.target.value }));
              }}
            />
          </div>
        </div>
        <div className="pl-18 flex gap-20 h-center rounded-8 h-[56px]" style={{border:'1px solid #D9D9D9'}}>
          <span className="w-24 h-24"><User/></span>
          <div className="relative mt-10 w-full">
            {/* Floating Label */}
            <label
              className={`absolute left-3 transition-all duration-300 ${
                pwFocused || signInForm.pw
                  ? 'top-[-14px] text-12 text-gray-400 bg-white px-1' 
                  : 'top-0 text-12 text-gray-400'
              }`}
            >
              비밀번호
            </label>
            <Input.Password
              variant="borderless"
              className="input text-12 font-medium"
              value={signInForm.pw}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              onChange={e => {
                setSignInForm(prev => ({ ...prev, pw: e.target.value }));
              }}
              onPressEnter={() => {
                handleSignIn(signInForm.id, signInForm.pw);
              }}
            />
          </div>
        </div>

        

        {/* 로그인 버튼 */}
          <Button type="primary" size="large" onClick={()=>{handleSignIn(signInForm.id, signInForm.pw);}} 
            className="w-full flex h-center gap-8 !h-[50px]" 
            style={{background: 'linear-gradient(91.71deg, #4880FF -11.85%, #03C75A 70.39%, #038D07 111.82%)'}}>
            <span>로그인하기</span>
          </Button>
          <Button type="text" size="large" onClick={()=>{}} 
            className="w-full flex h-center gap-8 !h-[50px]" >
            <span style={{color:'#4880FF'}}>회원가입하기</span>
          </Button>
          <Button type="text" size="large" onClick={()=>{}} 
            className="w-full flex h-center gap-8 !h-[30px]" >
            <span style={{color:'#038D07'}}>비밀번호를 잊으셨나요?</span>
          </Button>
      </div>

      <AntdAlertModal
        open={open}
        setOpen={setOpen}
        title={type === "success" ? "로그인 성공" : "로그인 실패"}
        contents={<div>메인으로 이동합니다.</div>}
        type={type} 
        onOk={()=>{router.push('/')}}
        onCancle={()=>{setOpen(false)}}
        hideCancel={true}
      />
    </div>
  )
}

SignInPage.layout = (page: React.ReactNode) => (
  <AuthPageLayout>{page}</AuthPageLayout>
)

export default SignInPage;