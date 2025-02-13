import { useEffect, useState } from "react";
import Contents from "../Body/Contents";
import MainHeader from "../Header/MainHeader";
import Sider from "../Sider/Sider";
import { useRouter } from "next/router";
import Link from "next/link";
import { TabLarge } from "@/components/Tab/Tabs";
import SettingSider from "../Sider/SettingSider";
import SettingContents from "../Body/SettingContents";

interface Props {
  children : React.ReactNode;
}

const AuthPageLayout: React.FC<Props> = ({ children}) => {
  const router = useRouter();

  return (
    <div className="w-full h-[100vh] bg-[#FFF] v-h-center">
      <section className="w-[800px] h-full v-h-center">
        {children}
      </section>
    </div>
  )
}

export default AuthPageLayout;