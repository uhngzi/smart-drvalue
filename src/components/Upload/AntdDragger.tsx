import { Dispatch, SetStateAction, useEffect } from 'react';

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
import useToast from '@/utils/useToast';
import { Upload } from 'antd/lib';


interface Props {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  fileIdList: string[];
  setFileIdList: Dispatch<SetStateAction<string[]>>;

  disabled?: boolean;
  mult?: boolean;
  max?: number;
}

const CustomDragger = styled(Dragger)`
  .ant-upload-drag .ant-upload-btn{
    padding: 0;
  }
    
  .ant-upload-drag {
    border-radius: 2px;
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
  max,
}) => {
  const { showToast, ToastContainer } = useToast();

  const UploadProp: UploadProps = {
    name: 'files',
    multiple: mult,
    showUploadList: false,
    beforeUpload: (file, fileListNew) => {
      if (max && fileList.length + fileListNew.length > max) {
        showToast(`최대 ${max}개의 파일만 업로드할 수 있습니다.`, "error");
        return false; // 업로드 무시
      }
      return true;
    },
    onChange: async info => {
      const { status } = info.file;

      if (status === 'error') {
        showToast(`${info.file.name} 파일 업로드에 실패했습니다.`, "error");
        return;
      }

      if (status === 'done') {
        const filesNm = (info.file.response.data ?? []).map((file: any) => {
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

  return (
    <>
      <CustomDragger 
        {...UploadProp} 
        className="bg-white" 
        disabled={disabled}
        name="files"
        headers={{
        //  'x-tenant-code' : 'gpntest-sebuk-ver',
         'x-tenant-code' : (
            cookie.get('company') === 'sy' ? 'shinyang-test' :
            cookie.get('x-custom-tenant-code') ? cookie.get('x-custom-tenant-code').toString() :
            'gpntest-sebuk-ver'
          ),
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
      <div className="flex flex-col mt-20 max-h-100 overflow-y-auto">
        {fileList?.map((file, idx) => (
          <div className="h-center h-32" key={idx}>
            <p className="w-16 h-16 mr-8"><Klip /></p>
            {/* 파일 이름/형식/사이즈 */}
            <p 
              className="flex flex-1 text-15 text-[#1890FF] cursor-pointer" key={idx}
              onClick={() => downloadFileByObjectName(fileIdList[idx], fileList[idx])}
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
          </div>
        ))}
      </div>
      <ToastContainer />
    </>
  );
};

export default AntdDragger;
