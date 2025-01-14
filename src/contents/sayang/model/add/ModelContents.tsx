import AntdInput from "@/components/Input/AntdInput";

interface Props {

}

const ModelContents: React.FC<Props> = ({

}) => {
  return (
    <>
      <div className="min-w-[190px] h-full border-r-1 border-line flex flex-col items-end justify-end gap-10 px-10 py-20">
        <div className="h-center gap-5">
          <p>제조사 : </p>
          <AntdInput className="w-[100px!important]"/>
        </div>
        <div className="h-center gap-5">
          <p>재질 : </p>
          <AntdInput className="w-[100px!important]"/>
        </div>
        <div className="h-center gap-5">
          <p>표면처리 : </p>
          <AntdInput className="w-[100px!important]"/>
        </div>
      </div>
      <div className="min-w-[400px] h-full flex flex-col justify-end items-end gap-10 px-10 py-20">
        <div className="w-full h-center gap-5 justify-end">
          <p>STH/PNL : </p>
          <div className="h-center w-[75%] gap-5">
            <AntdInput className="w-[50px!important]"/>
            <p>STH/PCS : </p>
            <AntdInput className="w-[50px!important]"/>
          </div>
        </div>
        <div className="w-full h-center gap-5 justify-end">
          <p>도금㎛ / ± : </p>
          <div className="h-center w-[75%] gap-5">
            <div className="flex flex-col gap-5">
              <AntdInput className="w-[50px!important]"/>
              <AntdInput className="w-[50px!important]"/>
            </div>
            <p>특수도금(Ni) : </p>
            <div className="flex flex-col gap-5">
              <AntdInput className="w-[50px!important]"/>
              <AntdInput className="w-[50px!important]"/>
            </div>
            <p>특수도금(Au) : </p>
            <div className="flex flex-col gap-5">
              <AntdInput className="w-[50px!important]"/>
              <AntdInput className="w-[50px!important]"/>
            </div>
          </div>
        </div>
        <div className="w-full h-center gap-5 justify-end">
          <p>단자Pin수: </p>
          <div className="h-center w-[75%] gap-5">
            <AntdInput />
          </div>
        </div>
      </div>
    </>
  )
}

export default ModelContents;