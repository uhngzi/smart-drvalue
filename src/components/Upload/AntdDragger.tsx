import { Dispatch, SetStateAction } from 'react';

import Download from '@/assets/svg/icons/s_download.svg';
import OpenNewWindow from '@/assets/svg/icons/l_open_window.svg';
import UploadIcon from '@/assets/svg/icons/folder.svg';
import Klip from '@/assets/svg/icons/klip.svg';
import Del from '@/assets/svg/icons/trash.svg';

import { message, Modal, UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import styled from 'styled-components';
import { downloadFileByObjectName, sliceByDelimiter, uploadFile } from './upLoadUtils';
import { instance } from '@/api/lib/axios';
import cookie from 'cookiejs';
import { cookieName } from '@/api/lib/config';


interface Props {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  fileIdList: string[];
  setFileIdList: Dispatch<SetStateAction<string[]>>;

  disabled?: boolean;
  mult?: boolean;
}

const CustomDragger = styled(Dragger)`
  .ant-upload-drag .ant-upload-btn{
    padding: 0;
  }
    
  .ant-upload-drag {
    border-radius: 0;
    border: 1px solid #D9D9D9;
  }
`

const AntdDragger: React.FC<Props> = ({
  fileList,
  setFileList,
  fileIdList,
  setFileIdList,

  disabled = false,
  mult = false,
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
        const file = info.file.response.data[0];
        setFileList(prev => [...prev, info.file]);
        setFileIdList(prev => [...prev, file.uploadEntityResult.id]);
        console.log(info, info.file);
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

  return (
    <>
      <CustomDragger 
        {...UploadProp} 
        className="bg-white" 
        disabled={disabled}
        name="files"
        headers={{
         'x-tenant-code' : 'test',
          Authorization: `bearer ${cookie.get(cookieName)}`,
        }}
        action={`http://115.68.221.100:3300/api/serv/file-mng/v1/tenant/file-manager/upload/multiple`}
      >
        <div className={`flex-col v-h-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <div className="h-84 h-center">
            <p className="w-48 h-48 v-h-center p-3">
              <UploadIcon />
            </p>
          </div>
          <div className="h-88 pb-16">
            <p className="text-[#000000] text-16">
              Click or drag file to this area to upload
            </p>
            <p className="text-[#00000045] text-14">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
            </p>
          </div>
        </div>
      </CustomDragger>
      <div className="flex flex-col mt-20">
        {fileList?.map((file, idx) => (
          <div className="h-center h-32" key={idx}>
            <p className="w-16 h-16 mr-8"><Klip /></p>
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
    </>
  );
};

export default AntdDragger;
