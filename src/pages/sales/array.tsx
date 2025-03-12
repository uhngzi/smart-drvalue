import { getAPI } from "@/api/get";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { boardType } from "@/data/type/base/board";
import { yieldCalType, yieldInputReq, yieldInputType } from "@/data/type/sayang/sample";
import MainPageLayout from "@/layouts/Main/MainPageLayout";
import useToast from "@/utils/useToast";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Calculate from "@/assets/svg/icons/calculate.svg";
import Print from "@/assets/svg/icons/print.svg";
import AntdInput from "@/components/Input/AntdInput";
import AntdTable from "@/components/List/AntdTable";
import { validReq } from "@/utils/valid";
import { postAPI } from "@/api/post";
import Image from "next/image";
import { baseURL } from "@/api/lib/config";
import { LabelMedium } from "@/components/Text/Label";

const SalesArrayPage: React.FC & {
  layout?: (page: React.ReactNode) => React.ReactNode;
} = () => {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  
  // ------------ 필요 데이터 세팅 ------------ 시작
  const [board, setBoard] = useState<boardType[]>([]);
  const { refetch:refetchBoard } = useQuery<apiGetResponseType, Error>({
    queryKey: ["board"],
    queryFn: async () => {
      const result = await getAPI({
        type: 'baseinfo',
        utype: 'tenant/',
        url: 'board/jsxcrud/many'
      });

      if (result.resultCode === "OK_0000") {
        const arr = (result.data?.data ?? []).map((d:boardType) => ({
          value: d.id,
          label: d.brdType,
        }))
        setBoard(result.data?.data ?? []);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });
  // ------------ 필요 데이터 세팅 ------------ 끝

  const [yielddata, setYielddata] = useState<yieldInputType | null>({
    minPanelLength: "200.0",
    minYield: "80.0",
    kitWidth: "280.0",
    kitHeight: "218.0",
    kitGapX: "5.0",
    kitGapY: "5.0",
    marginLongSide: 20,
    marginShortSide: 10,
  });

  const [disk, setDisk] = useState<{id:string; diskWidth:number; diskHeight:number;}[]>([]);
  const [calLoading, setCalLoading] = useState<boolean>(false);
  const [yieldTableData, setYieldTableData] = useState<yieldCalType[]>([]);
  useEffect(()=>{
    if(yielddata === null) {
      setYieldTableData([]);
    }
  }, [yielddata]);

  const items = [
    {tabIndex:1,value:yielddata?.minYield, name:'minYield', label:'최저 수율', type:'input', widthType:'full'},
    {tabIndex:3,value:yielddata?.kitWidth, name:'kitWidth', label:'Kit긴쪽길이', type:'input', widthType:'full'},
    {tabIndex:5,value:yielddata?.kitGapX, name:'kitGapX', label:'Kit긴쪽간격', type:'input', widthType:'full'},
    {tabIndex:7,value:yielddata?.kitArrangeX, name:'kitArrangeX', label:'Kit 배치 X', type:'input', widthType:'full'},
    {tabIndex:9,value:yielddata?.marginLongSide, name:'marginLongSide', label:'판넬긴쪽여분', type:'input', widthType:'full'},

    {tabIndex:2,value:yielddata?.minPanelLength, name:'minPanelLength', label:'판넬 최저 길이', type:'input', widthType:'full'},
    {tabIndex:4,value:yielddata?.kitHeight, name:'kitHeight', label:'Kit짧은쪽길이', type:'input', widthType:'full'},
    {tabIndex:6,value:yielddata?.kitGapY, name:'kitGapY', label:'Kit짧은쪽간격', type:'input', widthType:'full'},
    {tabIndex:8,value:yielddata?.kitArrangeY, name:'kitArrangeY', label:'Kit 배치 Y', type:'input', widthType:'full'},
    {tabIndex:10,value:yielddata?.marginShortSide, name:'marginShortSide', label:'판넬짧은쪽여분', type:'input', widthType:'full'},
  ]

  const handleCheckboxChange = (id:string, w: number, h: number) => {
    setDisk([ ...disk.filter(f=>f.id !== id), {id:id, diskWidth:w, diskHeight:h} ]);
  };
  
  const handleCalculdate = async () => {
    try {
      const disks = disk.map(d=>({diskWidth:d.diskWidth,diskHeight:d.diskHeight}));
      if(disks.length < 1) {
        showToast("원판을 선택해주세요.", "error");
        return;
      }

      const val = validReq(yielddata, yieldInputReq());
      if(!val.isValid) {
        showToast(val.missingLabels+'은(는) 필수 입력입니다.', "error");
        return;
      } 

      const jsonData = { ...yielddata, disks: disks };
      console.log(JSON.stringify(jsonData));

      setCalLoading(true);
      
      const result = await postAPI({
        type: 'core-d1',
        utype: 'tenant/',
        jsx: 'default',
        url:'board-yield-calc/default/calculate/auto/multi-board',
        etc: true,
      }, jsonData);
  
      if(result.resultCode === "OK_0000") {
        const rdata = (result.data ?? []) as yieldCalType[];
        setYieldTableData(rdata);
        setCalLoading(false);
      } else {
        const msg = result?.response?.data?.message;
        showToast(msg, "error");
        setCalLoading(false);
      }
    } catch (e) {
      console.log("CATCH ERROR :: ", e);
    }
  }

  function calculdate(){
    handleCalculdate();
  }

  return (
    <div className="flex flex-col gap-30">
      <div className="w-full p-30 flex flex-col gap-30 bg-white border-1 border-line rounded-14">
        <div className="w-full h-[210px] v-between-h-center gap-30">
          <div className="flex-1 h-full overflow-y-auto">
            { board.map((item:boardType) => (
              <div
                key={item.id}
                className="w-full h-40 border-b-1 border-bdDefault h-center text-black text-opacity-65"
              >
                <p className="w-[105px] h-full v-h-center">
                  <Checkbox
                    // checked={disk.filter(d=>d.id===value).length > 0 ? true : false}
                    name="board"
                    onChange={(e) => {
                      if(e.target.checked)
                        handleCheckboxChange(item.id ?? "", item.brdW, item.brdH);
                      else 
                        setDisk(disk.filter(f=>f.id !== item.id));
                    }}
                  />
                </p>
                <p className="w-[160px] h-full h-center">
                  {item.brdW}
                  {' '} x {' '}
                  {item.brdH}
                </p>
                <p className="h-full h-center">
                  {item.brdType}
                </p>
              </div>
            ))}
          </div>
          <div className="w-[800px] h-[210px] flex flex-wrap gap-x-15 gap-y-30">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col h-66">
              <p className='pb-8'>{item.label}</p>
              <div className="h-center gap-10 w-[130px]">
                <AntdInput 
                  value={item.value ?? undefined}
                  type="number"
                  onChange={(e)=>{
                    let { value } = e.target;
                    if(item.name === "minYield" && Number(value ?? 0) > 100) {
                      setYielddata({
                        ...yielddata,
                        [item.name]: 100,
                      });
                      return;
                    }

                    setYielddata({
                      ...yielddata,
                      [item.name]: value,
                    });
                  }}
                  tabIndex={item.tabIndex}
                  className="!w-100"
                  maxPoint={1}
                />
              </div>
            </div>
          ))}
          </div>
        </div>
        <div className="w-full h-center justify-end gap-20">
          {/* <Button className="v-h-center">
            <span className='w-16 h-16 text-[#222222]'><Print/></span>
            <span>인쇄</span>
          </Button> */}
          <Button type="primary" className="v-h-center" onClick={calculdate}>
            <span className='w-16 h-16'><Calculate/></span>
            <span>계산</span>
          </Button>
        </div>
      </div>

      <div className="w-full flex gap-30">
        <div className='p-30 bg-white rounded-14 border border-[#D9D9D9] min-h-[300px]'>
          <LabelMedium label="계산 결과"/>
          <AntdTable
            className='h-full overflow-y-auto'
            columns={[
              {
                title: '원판',
                dataIndex: 'stencil',
                key: 'stencil',
                align: 'center',
                children: [
                  {
                    title: '가로 x 세로',
                    dataIndex: 'diskWidth',
                    key: 'diskWidth',
                    width: 120,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return (record.disk?.diskWidth ?? "") + ' x ' + (record.disk?.diskHeight ?? "");
                    }
                  },
                ],
              },
              {
                title: '판넬',
                dataIndex: 'panel',
                key: 'panel',
                align: 'center',
                children: [
                  { title: 'X . Y',
                    dataIndex: 'panel.arrangeX',
                    key: 'panel.arrangeX',
                    width: 50,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return Math.floor(Number(record.panel?.arrangeX ?? 0)) + ' . ' + Math.floor(Number(record.panel?.arrangeY ?? 0));
                    }
                  },
                  { title: '가로 x 세로',
                    dataIndex: 'panel.width',
                    key: 'panel.width',
                    width: 120,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return Math.floor(Number(record.panel?.width ?? 0)) + ' x ' +  Math.floor(Number(record.panel?.height ?? 0));
                    }
                  },
                  { title: '개수',
                    dataIndex: 'panelCount',
                    key: 'panelCount',
                    width: 50,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return Math.floor(Number(record.panelCount ?? 0));
                    }
                  },
                  {
                    title: '수량',
                    dataIndex: 'kitCount',
                    key: 'kitCount',
                    width: 80,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return Math.floor(Number(record.kitCount ?? 0));
                    }
                  },
                ],
              },
              {
                title: '계산결과',
                dataIndex: 'remark',
                key: 'remark',
                align: 'center',
                children: [
                  {
                    title: '수율',
                    dataIndex: 'layout.yieldRatio',
                    key: 'layout.yieldRatio',
                    width: 100,
                    align: 'center',
                    render: (_, record:yieldCalType) => {
                      return Math.floor(Number(record.layout?.yieldRatio ?? 0) * 100) / 100;
                    }
                  },
                ],
              },
            ]}
            data={yieldTableData}
            loading={calLoading}
            styles={{ th_bg: '#EEEEEE', td_bg: '#FFF', td_ht: '40px', th_ht: '40px', round: '0px', th_pd: '0' }}
          />
        </div>
        <div className="relative flex flex-wrap gap-30 w-full p-30 bg-white rounded-14 border border-[#D9D9D9] min-h-[300px]">
          {yieldTableData.length > 0 &&
            yieldTableData.reduce((acc, data, index) => {
              if (index % 2 === 0) {
                acc.push([]);
              }
              acc[acc.length - 1].push(data);
              return acc;
            }, [] as any[][]) // 🔹 2개씩 그룹핑
            .map((group, rowIndex) => (
              <div key={rowIndex} className="flex w-full gap-30 min-h-[150px]">
                {group.map((data, colIndex) => (
                  <div key={colIndex} className="flex" style={{ flex: 1 }}>
                    <section className="relative" style={{ flex: 1.5 }}>
                      <Image
                        src={`${baseURL}file-mng/v1/every/file-manager/download/${data.images?.layout}`}
                        alt=""
                        layout="fill" // 🔹 부모 크기에 맞춤
                        objectFit="contain" // 🔹 이미지 비율 유지하면서 부모 영역에 맞춤
                      />
                    </section>
                    <section className="relative" style={{ flex: 1 }}>
                      <Image
                        src={`${baseURL}file-mng/v1/every/file-manager/download/${data.images?.panel}`}
                        alt=""
                        layout="fill" // 🔹 부모 크기에 맞춤
                        objectFit="contain" // 🔹 이미지 비율 유지하면서 부모 영역에 맞춤
                      />
                    </section>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
};

SalesArrayPage.layout = (page: React.ReactNode) => (
  <MainPageLayout
    menuTitle="원판 수율 계산"
    bg="none"
  >{page}</MainPageLayout>
);

export default SalesArrayPage;