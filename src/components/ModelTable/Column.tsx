import { selectType } from "@/data/type/componentStyles";
import { TableProps } from "antd";

import Trash from "@/assets/svg/icons/trash.svg";

import { 
  generateFloorOptions,
  ModelTypeEm,
  SalesOrderStatus
} from "@/data/type/enum";
import { salesOrderProcuctCUType, salesOrderProductRType } from "@/data/type/sales/order";

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
  handleModelDataChange: (id:string, name:string, value:any) => void,
  newFlag: boolean,
  selectId: string | null,
): TableProps['columns'] => [
  {
    title: 'Rev',
    dataIndex: 'rev',
    width: 80,
    key: 'rev',
    align: 'center',
    children: [
      {
        title:'납품단위',
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
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={unitSelectList}
                value={record.currPrdInfo?.unit?.id ?? unitSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.unit.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
          </div>
        )
      }
    ]
  },
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
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.thk}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.thk', e.target.value)}
                className='!text-12'
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '동박두께',
    width: 75,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    children: [
      {
        title:'',
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
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              /> 외
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.copIn}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.copIn', e.target.value)}
                className="!text-12" 
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />내
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '도금(㎛)',
    width: 60,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'핀 수',
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
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.currPrdInfo?.pltAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pltAlph', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pinCnt}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pinCnt', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수도금(㎛)',
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
                disabled={record.completed}
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltNiAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPltNiAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAu}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPltAu', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAuAlph}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spPltAuAlph', e.target.value)}
                type="number"
                className="!text-12"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
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
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.currPrdInfo?.smColor?.id ?? smColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.smColor.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.currPrdInfo?.smType?.id ?? smTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.smType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
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
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.currPrdInfo?.mkColor?.id ?? mkColorSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.mkColor.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.currPrdInfo?.mkType?.id ?? mkTypeSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.mkType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
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
        title:'',
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
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={spTypeSelectList}
                value={record.currPrdInfo?.spType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.spType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={[{value:ModelTypeEm.SAMPLE,label:'샘플'},{value:ModelTypeEm.PRODUCTION,label:'양산'}]}
                value={record.currPrdInfo?.modelTypeEm?.id ?? "sample"}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.modelTypeEm.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '외형가공',
    width:90,
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    children: [
      {
        title:'브이컷',
        width:90,
        dataIndex: 'vcut',
        key: 'vcut',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={outSelectList} 
                value={record.currPrdInfo?.aprType?.id ?? outSelectList?.[0]?.value}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.aprType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={[{value:false,label:'무'},{value:true,label:'유'}]}
                value={record.currPrdInfo?.vcutYn ?? false}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.vcutYn', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={vcutSelectList}
                value={record.currPrdInfo?.vcutType?.id}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.vcutType.id', e)}
                styles={{fs:'12px'}}
                disabled={record.completed ? true : selectId === record.id ? !newFlag : undefined}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '도면번호',
    width:100,
    dataIndex: 'doNum',
    key: 'doNum',
    align: 'center',
    children: [
      {
        title:'',
        width:100,
        dataIndex: 'doNum',
        key: 'doNum',
        align: 'center',
        render: (_, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.doNum}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.doNum', e.target.value)}
                className='w-[100px] !text-12'
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'PCS',
    width:50,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
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
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pcsW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pcsW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT',
    width:50,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
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
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.kitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL',
    width:50,
    dataIndex: 'pnl',
    key: 'pnl',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
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
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pnlW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조KIT',
    width:55,
    dataIndex: 'arkit',
    key: 'arkit',
    align: 'center',
    children:[
      {
        title: '연조PNL',
        width:100,
        dataIndex: 'arpnl',
        key: 'arpnl',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.currPrdInfo?.ykitL}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.ykitL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
              <AntdInputFill
                value={record.currPrdInfo?.ykitW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.ykitW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.currPrdInfo?.ypnlL}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.ypnlL', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
              <AntdInputFill
                value={record.currPrdInfo?.ypnlW}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.ypnlW', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT/PCS',
    width:50,
    dataIndex: 'kitpcs',
    key: 'kitpcs',
    align: 'center',
    children:[
      {
        title: 'PNL/KIT',
        width:50,
        dataIndex: 'pnlkit',
        key: 'pnlkit',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.kitPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlKit}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.pnlKit', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'STH/PNL',
    width:50,
    dataIndex: 'sthpnl',
    key: 'sthpnl',
    align: 'center',
    children:[
      {
        title: 'STH/PCS',
        width:50,
        dataIndex: 'sthpcs',
        key: 'sthpcs',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPnl}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.sthPnl', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPcs}
                onChange={(e)=>handleModelDataChange(record.id, 'currPrdInfo.sthPcs', e.target.value)}
                className="!text-12"
                type="number"
                readonly={selectId === record.id ? !newFlag : undefined}
                disabled={record.completed}
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
): TableProps['columns'] => [
  {
    title: 'No',
    width: 30,
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (value:any, record:any, index:number) => (
      <>
        <div className="h-[50%] w-[100%] v-h-center ">
          <p className="w-24 h-24 bg-back rounded-6 v-h-center ">{record?.index}</p>
        </div>
      </>
    ),
  },
  {
    title: 'Rev',
    dataIndex: 'rev',
    width: 80,
    key: 'rev',
    align: 'center',
    children: [
      {
        title:'납품단위',
        width: 80,
        dataIndex: 'user',
        key:'user',
        align: 'center',
        render: (value:any, record:any) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.prdRevNo}
                className='!text-12'
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={unitSelectList}
                value={record.currPrdInfo?.unit?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
          </div>
        )
      }
    ]
  },
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
                value={record.currPrdInfo?.layerEm}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.thk}
                className='!text-12'
                readonly={true}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '동박두께',
    width: 75,
    dataIndex: 'dongback',
    key: 'dongback',
    align: 'center',
    children: [
      {
        title:'',
        width: 75,
        dataIndex: '',
        key:'',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.copOut}
                className="!text-12" 
                readonly={true}
              /> 외
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.copIn}
                className="!text-12" 
                readonly={true}
              />내
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '도금(㎛)',
    width: 60,
    dataIndex: 'dogeum',
    key: 'dogeum',
    align: 'center',
    children: [
      {
        title:'핀 수',
        width: 60,
        dataIndex: 'pin',
        key:'pin',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pltThk}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill 
                value={record.currPrdInfo?.pltAlph}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pinCnt}
                className="!text-12"
                readonly={true}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '특수도금(㎛)',
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
                className="!text-12"
                readonly={true}
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltNiAlph}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass+"gap-5"}>
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAu}
                className="!text-12"
                readonly={true}
              />
              <AntdInputFill 
                value={record.currPrdInfo?.spPltAuAlph}
                className="!text-12"
                readonly={true}
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
                value={record.currPrdInfo?.smPrint?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smColorSelectList} 
                value={record.currPrdInfo?.smColor?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={smTypeSelectList} 
                value={record.currPrdInfo?.smType?.id}
                styles={{fs:'12px'}}
                readonly={true}
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
                value={record.currPrdInfo?.mkPrint?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkColorSelectList}
                value={record.currPrdInfo?.mkColor?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill
                options={mkTypeSelectList}
                value={record.currPrdInfo?.mkType?.id}
                styles={{fs:'12px'}}
                readonly={true}
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
        title:'',
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
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={spTypeSelectList}
                value={record.currPrdInfo?.spType?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                options={[{value:ModelTypeEm.SAMPLE,label:'샘플'},{value:ModelTypeEm.PRODUCTION,label:'양산'}]}
                value={record.currPrdInfo?.modelTypeEm?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '외형가공',
    width:90,
    dataIndex: 'out',
    key: 'out',
    align: 'center',
    children: [
      {
        title:'브이컷',
        width:90,
        dataIndex: 'vcut',
        key: 'vcut',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={outSelectList} 
                value={record.currPrdInfo?.aprType?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={[{value:false,label:'무'},{value:true,label:'유'}]}
                value={record.currPrdInfo?.vcutYn ?? false}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdSelectFill 
                className='w-[90px]'
                options={vcutSelectList}
                value={record.currPrdInfo?.vcutType?.id}
                styles={{fs:'12px'}}
                readonly={true}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: '도면번호',
    width:100,
    dataIndex: 'doNum',
    key: 'doNum',
    align: 'center',
    children: [
      {
        title:'',
        width:100,
        dataIndex: 'doNum',
        key: 'doNum',
        align: 'center',
        render: (_, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.doNum}
                className='w-[100px] !text-12'
                readonly={true}
              />
            </div>
          </div>
        )
      }
    ]
  },
  {
    title: 'PCS',
    width:50,
    dataIndex: 'pcs',
    key: 'pcs',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
        dataIndex: 'pcsSize_xy',
        key: 'pcsSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pcsL}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pcsW}
                className="!text-12"
                readonly={true}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT',
    width:50,
    dataIndex: 'kit',
    key: 'kit',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
        dataIndex: 'kitSize_xy',
        key: 'kitSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitL}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitW}
                className="!text-12"
                readonly={true}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'PNL',
    width:50,
    dataIndex: 'pnl',
    key: 'pnl',
    align: 'center',
    children:[
      {
        title: 'X/Y',
        width:50,
        dataIndex: 'pnlSize_xy',
        key: 'pnlSize_xy',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlL}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlW}
                className="!text-12"
                readonly={true}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: '연조KIT',
    width:55,
    dataIndex: 'arkit',
    key: 'arkit',
    align: 'center',
    children:[
      {
        title: '연조PNL',
        width:100,
        dataIndex: 'arpnl',
        key: 'arpnl',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.currPrdInfo?.ykitL}
                className="!text-12"
                readonly={true}
              />
              <AntdInputFill
                value={record.currPrdInfo?.ykitW}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass+" gap-3"}>
              <AntdInputFill
                value={record.currPrdInfo?.ypnlL}
                className="!text-12"
                readonly={true}
              />
              <AntdInputFill
                value={record.currPrdInfo?.ypnlW}
                className="!text-12"
                readonly={true}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'KIT/PCS',
    width:50,
    dataIndex: 'kitpcs',
    key: 'kitpcs',
    align: 'center',
    children:[
      {
        title: 'PNL/KIT',
        width:50,
        dataIndex: 'pnlkit',
        key: 'pnlkit',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.kitPcs}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.pnlKit}
                className="!text-12"
                readonly={true}
              />
            </div>
          </div>
        )
      },
    ]
  },
  {
    title: 'STH/PNL',
    width:50,
    dataIndex: 'sthpnl',
    key: 'sthpnl',
    align: 'center',
    children:[
      {
        title: 'STH/PCS',
        width:50,
        dataIndex: 'sthpcs',
        key: 'sthpcs',
        align: 'center',
        render: (value, record) => (
          <div className={divTopClass}>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPnl}
                className="!text-12"
                readonly={true}
              />
            </div>
            <div className={divClass}>
              <AntdInputFill
                value={record.currPrdInfo?.sthPcs}
                className="!text-12"
                readonly={true}
              />
            </div>
          </div>
        )
      },
    ]
  },
]