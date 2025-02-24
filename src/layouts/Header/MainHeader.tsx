import { useRouter } from "next/router";

import Setting from "@/assets/svg/icons/l_setting.svg"
import Bell from "@/assets/svg/icons/bell_line.svg"

interface Props {
  title?: string;
}

const MainHeader: React.FC<Props> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="h-80 w-full v-between-h-center bg-white px-25">
      <p className="text-25 text-[#343C6A] font-medium">
        {title}
      </p>
      <div className="flex">
        <div className="v-h-center rounded-50 bg-back m-5 w-50 h-50">
          <Setting stroke="#718EBF" className="w-30 h-30"/>
        </div>
        <div className="v-h-center rounded-50 bg-back m-5 w-50 h-50">
          <Bell fill="#FE5C73" className="w-27 h-30"/>
        </div>
        <div className="v-h-center rounded-50 bg-back m-5 w-50 h-50 text-18">
          길동
        </div>
      </div>
    </div>
  )
}

export default MainHeader;