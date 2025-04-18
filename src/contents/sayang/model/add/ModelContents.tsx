import AntdInput from "@/components/Input/AntdInput";
import AntdSelect from "@/components/Select/AntdSelect";

interface Props {
  item: {
    id: number;
    cuNm: string;
    no: string;
    modelNm: string;
    rev: string;
    cuCode: string;
    layer: string;
    thic: string;
    unit: string;
    wonpan: string;
    makeNm: string;
    texture: string;
    surf: string;
    dongbackO: string;
    donbackI: string;
    smprint: string;
    smcolor: string;
    smtype: string;
    mkprint: string;
    mkcolor: string;
    mktype: string;
    tprintstate: string;
    tprinttype: string;
    outtype: string;
    vcut: number | null;
    drgNo: string;
    pmNum: string;
    pcsX: string;
    pcsY: string;
    kitX: string;
    kitY: string;
    pnlX: string;
    pnlY: string;
    kitArX: string;
    kitArY: string;
    pnlArX: string;
    pnlArY: string;
    kit_pcs: string;
    pnl_kit: string;
    sth_pnl: string;
    sth_pcs: string;
    dogeumP: string;
    dogeumM: string;
    dogeumNiP: string;
    dogeumNiM: string;
    dogeumAuP: string;
    dogeumAuM: string;
    pin: string;
  }
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: string,
    type: 'one' | 'mult',
  ) => void;
  type: 'one' | 'mult';
}

const ModelContents: React.FC<Props> = ({
  item,
  handleInputChange,
  type,
}) => {
  return (
    <>
      <div className="mb-20 flex">
        <div className="min-w-[306px] border-r-1 border-line flex flex-col gap-24 pr-20">
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">업체명 : </p>
            <AntdInput className="w-[176px!important]" memoView styles={{ht:'36px'}} value={item?.cuNm||''} onChange={(e)=>handleInputChange(e, 'cuNm', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">관리번호 : </p>
            <AntdInput className="w-[176px!important]" memoView styles={{ht:'36px'}} value={item?.no||''} onChange={(e)=>handleInputChange(e, 'no', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">모델명 : </p>
            <AntdInput className="w-[176px!important]" memoView styles={{ht:'36px'}} value={item?.modelNm||''} onChange={(e)=>handleInputChange(e, 'modelNm', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">Rev_No : </p>
            <AntdInput className="w-[176px!important]" memoView styles={{ht:'36px'}} value={item?.rev||''} onChange={(e)=>handleInputChange(e, 'rev', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">고객관리코드 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}} value={item?.cuCode||''} onChange={(e)=>handleInputChange(e, 'cuCode', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">층 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}} value={item?.layer||''} onChange={(e)=>handleInputChange(e, 'layer', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">두께 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}} value={item?.thic||''} onChange={(e)=>handleInputChange(e, 'thic', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">납품단위 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}} value={item?.unit||''} onChange={(e)=>handleInputChange(e, 'unit', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">원판 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}} value={item?.wonpan||''} onChange={(e)=>handleInputChange(e, 'wonpan', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">제조사 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}} value={item?.makeNm||''} onChange={(e)=>handleInputChange(e, 'makeNm', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">재질 : </p>
            <AntdInput className="w-[176px!important]" styles={{ht:'36px'}} value={item?.texture||''} onChange={(e)=>handleInputChange(e, 'texture', type)}/>
          </div>
          <div className="h-36 h-center gap-5">
            <p className="ml-10 min-w-95 h-center justify-end">표면처리 : </p>
            <AntdInput className="w-[176px!important]" memoView styles={{ht:'36px'}} value={item?.surf||''} onChange={(e)=>handleInputChange(e, 'surf', type)}/>
          </div>
        </div>
        <div className="min-w-[676px] h-full flex gap-5 pl-10">
          <div className="flex flex-col gap-24">
            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">동박외층 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.dongbackO||''} onChange={(e)=>handleInputChange(e, 'dongbackO', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">동박내층 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.donbackI||''} onChange={(e)=>handleInputChange(e, 'donbackI', type)}/>
            </div>
            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">S/M인쇄 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.smprint||''} onChange={(e)=>handleInputChange(e, 'smprint', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">S/M색상 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.smcolor||''} onChange={(e)=>handleInputChange(e, 'smcolor', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">S/M종류 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.smtype||''} onChange={(e)=>handleInputChange(e, 'smtype', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">M/K인쇄 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.mkprint||''} onChange={(e)=>handleInputChange(e, 'mkprint', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">M/K색상 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.mkcolor||''} onChange={(e)=>handleInputChange(e, 'mkcolor', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">M/K종류 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.mktype||''} onChange={(e)=>handleInputChange(e, 'mktype', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">특수인쇄형태 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.tprintstate||''} onChange={(e)=>handleInputChange(e, 'tprintstate', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">특수인쇄종류 :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.tprinttype||''} onChange={(e)=>handleInputChange(e, 'tprinttype', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">외형가공형태 : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.outtype||''} onChange={(e)=>handleInputChange(e, 'outtype', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">브이컷 :</p>
              <AntdSelect options={[{value:1,label:'유'},{value:1,label:'무'}]} className="w-[105px!important]" styles={{ht:'36px'}} value={item?.vcut} onChange={(e)=>handleInputChange(e, 'vcut', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">도면번호 : </p>
              <AntdInput className="w-[105px!important]" memoView styles={{ht:'36px'}} value={item?.drgNo||''} onChange={(e)=>handleInputChange(e, 'drgNo', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">Tool No :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.pmNum||''} onChange={(e)=>handleInputChange(e, 'pmNum', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">규격(PCS) : </p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.pcsX||''} onChange={(e)=>handleInputChange(e, 'pcsX', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.pcsY||''} onChange={(e)=>handleInputChange(e, 'pcsY', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">규격(KIP) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.kitX||''} onChange={(e)=>handleInputChange(e, 'kitX', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.kitY||''} onChange={(e)=>handleInputChange(e, 'kitY', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">규격(PNL) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.pnlX||''} onChange={(e)=>handleInputChange(e, 'pnlX', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.pnlY||''} onChange={(e)=>handleInputChange(e, 'pnlY', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">연조(KIT) : </p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.kitArX||''} onChange={(e)=>handleInputChange(e, 'kitArX', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.kitArY||''} onChange={(e)=>handleInputChange(e, 'kitArY', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">연조(PNL) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.pnlArX||''} onChange={(e)=>handleInputChange(e, 'pnlArX', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.pnlArY||''} onChange={(e)=>handleInputChange(e, 'pnlArY', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">KIT/PCS : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.kit_pcs||''} onChange={(e)=>handleInputChange(e, 'kit_pcs', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">PNL/KIT :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.pnl_kit||''} onChange={(e)=>handleInputChange(e, 'pnl_kit', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">STH/PNL : </p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.sth_pnl||''} onChange={(e)=>handleInputChange(e, 'sth_pnl', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">STH/PCS :</p>
              <AntdInput className="w-[105px!important]" styles={{ht:'36px'}} value={item?.sth_pcs||''} onChange={(e)=>handleInputChange(e, 'sth_pcs', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">도금㎛ / ± : </p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.dogeumP||''} onChange={(e)=>handleInputChange(e, 'dogeumP', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.dogeumM||''} onChange={(e)=>handleInputChange(e, 'dogeumM', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">특수도금(Ni) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.dogeumNiP||''} onChange={(e)=>handleInputChange(e, 'dogeumNiP', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.dogeumNiM||''} onChange={(e)=>handleInputChange(e, 'dogeumNiM', type)}/>
              <p className="ml-10 min-w-95 h-center justify-end">특수도금(Au) :</p>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.dogeumAuP||''} onChange={(e)=>handleInputChange(e, 'dogeumAuP', type)}/>
              <AntdInput className="w-[50px!important]" styles={{ht:'36px'}} value={item?.dogeumAuM||''} onChange={(e)=>handleInputChange(e, 'dogeumAuM', type)}/>
            </div>

            <div className="h-36 h-center gap-5">
              <p className="ml-10 min-w-95 h-center justify-end">단자Pin수 : </p>
              <AntdInput styles={{ht:'36px'}} value={item?.pin||''} onChange={(e)=>handleInputChange(e, 'pin', type)}/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModelContents;