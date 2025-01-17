import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";

interface Props {

}

const ModelContents: React.FC<Props> = ({

}) => {
  return (
    <>
      <div className="mb-20 flex">
        <div className="min-w-[306px] border-r-1 border-line flex flex-col gap-24 pr-20">
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">업체명 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">관리번호 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">모델명 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">Rev_No : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">고객관리코드 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">층 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">두께 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">납품단위 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">원판 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">제조사 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">재질 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">표면처리 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}}/>
          </div>
        </div>
        <div className="min-w-[676px] h-full flex gap-5 pl-10">
          <div className="flex flex-col gap-24">
            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">동박외층 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">동박내층 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>
            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">동박외층 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">동박내층 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">S/M인쇄 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">S/M색상 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">S/M종류 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">M/K인쇄 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">M/K색상 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">M/K종류 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">특수인쇄형태 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">특수인쇄종류 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">외형가공형태 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">브이컷 :</p>
              <AntdSelect options={[{value:1,label:'유'},{value:1,label:'무'}]} className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">도면번호 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">필름번호 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">규격(PCS) : </p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">규격(KIP) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">규격(PNL) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">연조(KIT) : </p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">연조(PNL) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">KIT/PCS : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">PNL/KIT :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">STH/PNL : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">STH/PCS :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">도금㎛ / ± : </p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">특수도금(Ni) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <p className="ml-10 min-w-95 h-center justify-end">특수도금(Au) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">단자Pin수 : </p>
              <AntdInput styles={{ht:'36px'}}/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModelContents;