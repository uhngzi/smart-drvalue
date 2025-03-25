import { selectType } from "@/data/type/componentStyles";
import { TableProps } from "antd";

import { 
  generateFloorOptions,
  ModelStatus,
} from "@/data/type/enum";
import { salesOrderProcuctCUType } from "@/data/type/sales/order";

import AntdInputFill from "../Input/AntdInputFill";
import AntdSelectFill from "../Select/AntdSelectFill";
import { SetStateAction } from "react";

const divClass = "h-35 w-[100%] h-center justify-left ";
const divTopClass = "h-[100%] flex flex-col items-start";

export const salesOrderModelClmn = (
  newProducts: salesOrderProcuctCUType[],
  setNewProducts: React.Dispatch<React.SetStateAction<salesOrderProcuctCUType[]>>,
  setDeleted: React.Dispatch<SetStateAction<boolean>>,
  unitSelectList: selectType[],
  vcutSelectList: selectType[],
  outSelectList: selectType[],
  smPrintSelectList: selectType[],
  smColorSelectList: selectType[],
  smTypeSelectList: selectType[],
  mkPrintSelectList: selectType[],
  mkColorSelectList: selectType[],
  mkTypeSelectList: selectType[],
  spPrintSelectList: selectType[],
  spTypeSelectList: selectType[],
  surfaceSelectList: selectType[],
  handleModelDataChange: (id:string, name:string, value:any) => void,
  newFlag: boolean,
  selectId: string | null,
): TableProps['columns'] => [
  {
    title: '층',
    dataIndex: 'layer',
    key: 'layer',
    align: 'center',
    children: [
      {
        title:'두께(T)',
        width: 65,
        dataIndex: 'thic_layer',
        key:'thic_layer',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={generateFloorOptions()}
                value={record.currPrdInfo?.layerEm ?? "L1"}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.layerEm', e)}
                styles={{fs:'12px'}}
                placeholder={"층 입력"}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+1}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.thk}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.thk', e.target.value)}
                className='!text-12'
                type="number"
                placeholder={"두께 입력"}
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+2}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '동박',
    width: 75,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    children: [
      {
        title:'외/내층',
        width: 75,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.copOut}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.copOut', e.target.value)}
                className="!text-12" 
                type="number"
                placeholder={"외층 입력"}
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+3}
                />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.copIn}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.copIn', e.target.value)}
                className="!text-12" 
                type="number"
                placeholder={"내층 입력"}
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+4}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '표면처리',
    dataIndex: 'surface',
    width: 60,
    key: 'surface',
    align: 'center',
    children: [
      {
        title:'',
        width: 60,
        dataIndex: 'surface',
        key:'surface',
        align: 'center',
        render: (value:any, record:any) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={surfaceSelectList}
                value={record.currPrdInfo?.surface?.id ?? surfaceSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.surface.id', e)}
                styles={{fs:'12px'}}
                placeholder={"단위 입력"}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+5}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '동도금',
    width: 60,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'',
        width: 60,
        dataIndex: 'pin',
        key:'pin',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pltThk}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pltThk', e.target.value)}
                className="!text-12"
                type="number"
                placeholder={"도금 입력"}
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+6}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.currPrdInfo?.pltAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pltAlph', e.target.value)}
                className="!text-12"
                type="number"
                placeholder={"도금± 입력"}
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+7}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수도금',
    width:110,
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    children: [
      {
        title:'Ni Au',
        width: 90,
        dataIndex: 'tDogeum',
        key:'tDogeum',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.spPltNi}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPltNi', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Ni 입력"}
                tabIndex={record.index*40+8}
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAu}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPltAu', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Au 입력"}
                tabIndex={record.index*40+10}
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.spPltNiAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPltNiAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Ni± 입력"}
                tabIndex={record.index*40+9}
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAuAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPltAuAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Au± 입력"}
                tabIndex={record.index*40+11}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'S/M',
    width:125,
    dataIndex: 'sm',
    key: 'sm',
    align: 'center',
    children: [
      {
        title:'',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={smPrintSelectList} 
                value={record.currPrdInfo?.smPrint?.id ?? smPrintSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.smPrint.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"S/M인쇄 입력"}
                tabIndex={record.index*40+12}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.currPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.smColor.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"S/M색상 입력"}
                tabIndex={record.index*40+13}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.currPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.smType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"S/M종류 입력"}
                tabIndex={record.index*40+14}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'M/K',
    width:125,
    dataIndex: 'mk',
    key: 'mk',
    align: 'center',
    children: [
      {
        title:'',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={mkPrintSelectList}
                value={record.currPrdInfo?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.mkPrint.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"M/K인쇄 입력"}
                tabIndex={record.index*40+15}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.currPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.mkColor.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"M/K색상 입력"}
                tabIndex={record.index*40+16}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.currPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.mkType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"M/K종류 입력"}
                tabIndex={record.index*40+17}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수인쇄',
    width:125,
    dataIndex: 'tPrint',
    key: 'tPrint',
    align: 'center',
    children: [
      {
        title:'외형가공',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={spPrintSelectList}
                value={record.currPrdInfo?.spPrint?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPrint.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"특수인쇄 입력"}
                tabIndex={record.index*40+18}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={outSelectList} 
                value={record.currPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.aprType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"외형가공형태 입력"}
                tabIndex={record.index*40+19}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'Rev',
    dataIndex: 'rev',
    width: 80,
    key: 'rev',
    align: 'center',
    children: [
      {
        title:'도면번호',
        width: 80,
        dataIndex: 'user',
        key:'user',
        align: 'center',
        render: (value:any, record:any) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.prdRevNo}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.prdRevNo', e.target.value)}
                className='!text-12'
                readonly={selectId === record.id ? !newFlag : undefined}
                placeholder={"Rev 입력"}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+20}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.doNum}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.doNum', e.target.value)}
                className='!text-12'
                placeholder="도면번호 입력"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                tabIndex={record.index*40+21}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'PCS SIZE',
    width:70,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pcsL}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pcsL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"X 입력"}
                tabIndex={record.index*40+22}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pcsW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Y 입력"}
                tabIndex={record.index*40+23}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조KIT',
    width:70,
    dataIndex: 'arkit',
    key: 'arkit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'arpnl',
        key: 'arpnl',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.ykitL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"X 입력"}
                tabIndex={record.index*40+24}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.ykitW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.ykitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Y 입력"}
                tabIndex={record.index*40+25}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT SIZE',
    width:70,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'PCS/KIT',
        width:70,
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitL}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.kitL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"X 입력"}
                tabIndex={record.index*40+26}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.kitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Y 입력"}
                tabIndex={record.index*40+27}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.kitPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"PCS/KIT"}
                tabIndex={record.index*40+28}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL SIZE',
    width:70,
    dataIndex: 'pnl',
    key: 'pnl',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'pnlSize_xy',
        key: 'pnlSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pnlL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"X 입력"}
                tabIndex={record.index*40+29}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pnlW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"Y 입력"}
                tabIndex={record.index*40+30}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL/KIT',
    width:50,
    dataIndex: 'kitpcs',
    key: 'kitpcs',
    align: 'center',
    children:[
      {
        title: 'STH',
        width:50,
        dataIndex: 'pnlkit',
        key: 'pnlkit',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlKit}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pnlKit', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"PNL/KIT 입력"}
                tabIndex={record.index*40+31}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPnl}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.sthPnl', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"STH/PNL 입력"}
                tabIndex={record.index*40+32}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.sthPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"STH/PCS 입력"}
                tabIndex={record.index*40+33}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '비고',
    width:100,
    dataIndex: 'remarks',
    key: 'remarks',
    align: 'center',
    children:[
      {
        title: '승인원 여부',
        width:100,
        dataIndex: 'inremarks',
        key: 'inremarks',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.remarks}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.remarks', e.target.value)}
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed || record.modelStatus === ModelStatus.REPEAT}
                placeholder={"비고 입력"}
                tabIndex={record.index*40+34}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={[{value:"Y",label:"유"},{value:"N",label:"무"}]}
                value={record.currPrdInfo?.seungYn ?? "Y"}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.seungYn', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : record.modelStatus === ModelStatus.REPEAT}
                placeholder={"승인원 여부"}
                tabIndex={record.index*40+35}
              />
            </div>
          </div>
        )
      },
    ]
  },
]

export const salesOrderModelReadClmn = (
  unitSelectList: selectType[],
  vcutSelectList: selectType[],
  outSelectList: selectType[],
  smPrintSelectList: selectType[],
  smColorSelectList: selectType[],
  smTypeSelectList: selectType[],
  mkPrintSelectList: selectType[],
  mkColorSelectList: selectType[],
  mkTypeSelectList: selectType[],
  spPrintSelectList: selectType[],
  spTypeSelectList: selectType[],
  surfaceSelectList: selectType[],
): TableProps['columns'] => [
  {
    title: '층',
    dataIndex: 'layer',
    key: 'layer',
    align: 'center',
    children: [
      {
        title:'두께(T)',
        width: 65,
        dataIndex: 'thic_layer',
        key:'thic_layer',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={generateFloorOptions()}
                value={record.currPrdInfo?.layerEm ?? "L1"}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.thk}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '동박',
    width: 75,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    children: [
      {
        title:'외/내층',
        width: 75,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.copOut}
                className="!text-12" disabled
                />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.copIn}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '표면처리',
    dataIndex: 'surface',
    width: 60,
    key: 'surface',
    align: 'center',
    children: [
      {
        title:'',
        width: 60,
        dataIndex: 'surface',
        key:'surface',
        align: 'center',
        render: (value:any, record:any) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={surfaceSelectList}
                value={record.currPrdInfo?.surface?.id ?? surfaceSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '동도금',
    width: 60,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'',
        width: 60,
        dataIndex: 'pin',
        key:'pin',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pltThk}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.currPrdInfo?.pltAlph}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수도금',
    width:110,
    dataIndex: 'tDogeum',
    key: 'tDogeum',
    align: 'center',
    children: [
      {
        title:'Ni Au',
        width: 90,
        dataIndex: 'tDogeum',
        key:'tDogeum',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.spPltNi}
                className="!text-12" disabled
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAu}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.spPltNiAlph}
                className="!text-12" disabled
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAuAlph}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'S/M',
    width:125,
    dataIndex: 'sm',
    key: 'sm',
    align: 'center',
    children: [
      {
        title:'',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={smPrintSelectList} 
                value={record.currPrdInfo?.smPrint?.id ?? smPrintSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.currPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.currPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'M/K',
    width:125,
    dataIndex: 'mk',
    key: 'mk',
    align: 'center',
    children: [
      {
        title:'',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill
                options={mkPrintSelectList}
                value={record.currPrdInfo?.mkPrint?.id ?? mkPrintSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.currPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.currPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수인쇄',
    width:125,
    dataIndex: 'tPrint',
    key: 'tPrint',
    align: 'center',
    children: [
      {
        title:'외형가공',
        width: 125,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                options={spPrintSelectList}
                value={record.currPrdInfo?.spPrint?.id}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={outSelectList} 
                value={record.currPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'Rev',
    dataIndex: 'rev',
    width: 80,
    key: 'rev',
    align: 'center',
    children: [
      {
        title:'도면번호',
        width: 80,
        dataIndex: 'user',
        key:'user',
        align: 'center',
        render: (value:any, record:any) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.prdRevNo}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.doNum}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'PCS SIZE',
    width:70,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pcsL}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pcsW}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조KIT',
    width:70,
    dataIndex: 'arkit',
    key: 'arkit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'arpnl',
        key: 'arpnl',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.ykitL}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.ykitW}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT SIZE',
    width:70,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'PCS/KIT',
        width:70,
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitL}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitW}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitPcs}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL SIZE',
    width:70,
    dataIndex: 'pnl',
    key: 'pnl',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:70,
        dataIndex: 'pnlSize_xy',
        key: 'pnlSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlL}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlW}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL/KIT',
    width:50,
    dataIndex: 'kitpcs',
    key: 'kitpcs',
    align: 'center',
    children:[
      {
        title: 'STH',
        width:50,
        dataIndex: 'pnlkit',
        key: 'pnlkit',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlKit}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPnl}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPcs}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '비고',
    width:100,
    dataIndex: 'remarks',
    key: 'remarks',
    align: 'center',
    children:[
      {
        title: '승인원 여부',
        width:100,
        dataIndex: 'inremarks',
        key: 'inremarks',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.remarks}
                className="!text-12" disabled
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={[{value:"Y",label:"유"},{value:"N",label:"무"}]}
                value={record.currPrdInfo?.seungYn ?? "Y"}
                className="!text-12" disabled
              />
            </div>
          </div>
        )
      },
    ]
  },
]