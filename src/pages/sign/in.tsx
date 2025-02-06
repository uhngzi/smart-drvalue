import { instance } from "@/api/lib/axios";
import { cookieName } from "@/api/lib/config";
import AntdAlertModal from "@/components/Modal/AntdAlertModal";
import { Button, Input, Modal } from "antd";
import cookie from "cookiejs";
import { useRouter } from "next/router";
import { useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

const SignInPage: React.FC = () => {
  const router = useRouter();

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
        setOpen(true);
        setType("success");
        console.log("ok", open, type);
      } else {
        setOpen(true);
        setType("error");
      }
    } catch (e) {
      setOpen(true);
      setType("error");
    }
  };

  return (
    <>
      로그인
      <Input
        className="input"
        placeholder="이메일 주소"
        value={"test"}
        onChange={e => {
          setSignInForm(prev => ({ ...prev, id: e.target.value }));
        }}
      />
      <Input.Password
        className="input"
        placeholder="비밀번호"
        value={"test1234"}
        onChange={e => {
          setSignInForm(prev => ({ ...prev, pw: e.target.value }));
        }}
        onPressEnter={() => {
          handleSignIn(signInForm.id, signInForm.pw);
        }}
      />

      {/* 로그인 버튼 */}
      <Button
        className="button"
        type="primary"
        onClick={() => {
          handleSignIn(signInForm.id, signInForm.pw);
        }}
      >
        로그인
      </Button>

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
    </>
  )
}

export default SignInPage;