import { useRouter } from "next/router";

import Setting from "@/assets/svg/icons/l_setting.svg";
import Bell from "@/assets/svg/icons/bell_line.svg";
import MenuIcon from "@/assets/svg/icons/l_menu.svg";

import { useUser } from "@/data/context/UserContext";

interface Props {
  title?: string;
}

const MainHeader: React.FC<Props> = ({ title }) => {
  const router = useRouter();
  const { me } = useUser();

  return (
    <div className="!h-70 min-h-70 w-full h-center px-30 justify-end gap-15">
      <div
        className="w-40 h-40 v-h-center bg-back rounded-50 cursor-pointer"
        onClick={() => {
          router.push("/setting");
        }}
      >
        <p className="w-24 h-24 text-[#718EBF] bg-back rounded-50">
          <Setting />
        </p>
      </div>
      <div className="w-40 h-40 v-h-center bg-back rounded-50 cursor-pointer">
        <p className="w-24 h-24 text-[#718EBF]">
          <Bell />
        </p>
      </div>
      <div className="w-40 h-40 v-h-center text-[#718EBF] text-12 font-normal bg-back rounded-50">
        {me?.userName ?? "-"}
      </div>
      <div className="w-40 h-40 v-h-center text-[#718EBF] text-12 font-normal bg-back rounded-50 cursor-pointer">
        <MenuIcon />
      </div>
    </div>
  );
};

export default MainHeader;
