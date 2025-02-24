import { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';

import UploadIcon from '@/assets/svg/icons/upload.svg';
import Klip from '@/assets/svg/icons/klip.svg';
import Del from '@/assets/svg/icons/trash.svg';

import { message, Modal, UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import styled from 'styled-components';
import { downloadFileByObjectName, sliceByDelimiter } from './upLoadUtils';
import cookie from 'cookiejs';
import { baseURL, cookieName } from '@/api/lib/config';


interface Props {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  fileIdList: string[];
  setFileIdList: Dispatch<SetStateAction<string[]>>;

  disabled?: boolean;
  mult?: boolean;
  divRef?: RefObject<HTMLDivElement | null>;
  changeHeight?: {width:number, height:number} | null;
}

const CustomDragger = styled(Dragger)`
  height: 40px;

  & .ant-upload-drag .ant-upload-btn{
    padding: 0;
    height: 40px;
  }

  & .ant-upload-btn {
    height: 40px !important;
  }
    
  & .ant-upload-drag {
    border-radius: 2px;
    border: 1px solid #D9D9D9;
    background: #FFF;
    height: 40px;
  }
`

const AntdDraggerSmall: React.FC<Props> = ({
  fileList,
  setFileList,
  fileIdList,
  setFileIdList,

  disabled = false,
  mult = false,
  divRef,
  changeHeight,
}) => {
  const UploadProp: UploadProps = {
    name: 'files',
    multiple: mult,
    showUploadList: false,
    onChange: async info => {
      const { status } = info.file;

      if (status === 'error') {
        message.error(`${info.file.name} 파일 업로드에 실패했습니다.`);
        Modal.error({
          title: '업로드 실패',
          content: '업로드에 실패하였습니다.',
        });
      }

      if (info.file.status === 'done') {
        const filesNm = (info.file.response.data ?? []).map((file:any) => {
          return file?.uploadEntityResult?.storageName;
        });
        setFileList(prev => [...prev, info.file]);
        setFileIdList(prev => [...prev, ...filesNm]);
      }
    },
  };

  const handleDeleteFile = (idx: number) => {
    setFileList(prevFileList =>
      prevFileList.filter((_, index) => index !== idx),
    );
    setFileIdList(prevFileIdList =>
      prevFileIdList.filter((_, index) => index !== idx),
    );
  };

  const [height, setHeight] = useState<number>(0);
  useEffect(()=>{
    if(divRef?.current?.clientHeight) {
      const divHeight = Number(divRef?.current?.clientHeight) - 348;
      if(divHeight > 0) setHeight(divHeight);
      else              setHeight(172);
    }
  }, [changeHeight])

  useEffect(()=>{console.log(height)},[height])

  return (
    <>
    <div
      className="flex flex-col mt-20 overflow-y-auto"
      style={{ height: fileList && fileList.length > 0 && divRef?.current?.clientHeight ? height : "auto" }}
    >
      { fileList && fileList?.map((file, idx) => (
        <div className="h-center" key={idx}>
          <p className="w-16 h-16 mr-8 min-w-16 min-h-16"><Klip /></p>
          {/* 파일 이름/형식/사이즈 */}
          <p 
            className="flex flex-1 text-15 text-[#1890FF] cursor-pointer" key={idx}
            onClick={() => downloadFileByObjectName(fileIdList[idx])}
          >
            {sliceByDelimiter(file.name || '', '.', 'front')}.
            {sliceByDelimiter(file.name || '', '.', 'back')}
            {/* {Math.round(byteToKB(file.size || 0))}KB] */}
          </p>

          {/* 삭제 버튼 */}
          {!disabled && (
            <button
              className="h-center cursor-pointer gap-2"
              onClick={() => handleDeleteFile(idx)}
            >
              <p className="text-14 text-[#888888] w-16 h-16">
                <Del />
              </p>
            </button>
          )}

          {/* 다운로드 버튼 */}
          {/* <button
            className="h-center cursor-pointer gap-2"
            onClick={() => downloadFileByObjectName(fileIdList[idx])}
          >
            <p className="text-14 text-[#444444]">다운로드</p>
            <Download />
          </button> */}

          {/* 바로보기 버튼 */}
          {/* <button className="h-center cursor-pointer gap-2">
            <p className="text-14 text-[#444444]">바로보기</p>
            <OpenNewWindow color={'#444444'} strokeWidth={1} />
          </button> */}
        </div>
      ))}
    </div>
      <CustomDragger 
        {...UploadProp} 
        className="bg-white" 
        disabled={disabled}
        name="files"
        headers={{
         'x-tenant-code' : 'test',
          Authorization: `bearer ${cookie.get(cookieName)}`,
        }}
        action={`${baseURL}file-mng/v1/tenant/file-manager/upload/multiple`}
      >
        <div className={`h-40 flex-col v-h-center bg-point1 rounded-2 text-white ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <div className="h-center gap-5">
            <p className="w-24 h-24 v-h-center">
              <UploadIcon />
            </p>
            파일 등록
          </div>
        </div>
      </CustomDragger>
    </>
  );
};

export default AntdDraggerSmall;
