import { Dispatch, SetStateAction } from 'react';

import Download from '@/assets/svg/icons/s_download.svg';
import OpenNewWindow from '@/assets/svg/icons/l_open_window.svg';
import UploadIcon from '@/assets/svg/icons/Inbox.svg';

import { byteToKB } from '@/utils/formatBytes';

import { message, Modal, UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import { downloadFileByObjectName, sliceByDelimiter, uploadFile } from './utils';


interface Props {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  fileIdList: string[];
  setFileIdList: Dispatch<SetStateAction<string[]>>;

  disabled?: boolean;
}

const AntdDragger: React.FC<Props> = ({
  fileList,
  setFileList,
  fileIdList,
  setFileIdList,

  disabled = false,
}) => {
  const UploadProp: UploadProps = {
    name: 'file',
    multiple: false,
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
        console.log('hi');
        // const response = await uploadFile(info.file);
        // if (response?.data.status === 200) {
        //   setFileList(prev => [...prev, info.file]);
        //   setFileIdList(prev => [...prev, response.data.data.fullName]);
        // }
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
      <Dragger {...UploadProp} className="bg-white" disabled={disabled}>
        <div className="flex-col v-h-center gap-40 py-48">
          <p className="ant-upload-text">
            첨부할 파일을 여기에 끌어다 놓거나 파일 선택 버튼을 직접
            선택해주세요.
          </p>
          <button
            className={`flex w-fit gap-4 self-center rounded-6 bg-[#5c6bc0] px-16 py-14 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} `}
          >
            <UploadIcon className="w-24 h-24" fill={'#FFFFFF'} />
            <p className="font-[Pretendard-Medium] text-15 text-[#fff]">
              파일 선택
            </p>
          </button>
        </div>
      </Dragger>
      <div className="flex flex-col gap-16 rounded-8 border border-[#d2d2d2] px-16 py-18 mt-10">
        {fileList?.map((file, idx) => (
          <div className="h-center gap-16 border-[#d2d2d2]" key={idx}>
            {/* 파일 이름/형식/사이즈 */}
            <p className="flex flex-1 text-15 text-[#444444]" key={idx}>
              {sliceByDelimiter(file.name || '', '.', 'front')} [
              {sliceByDelimiter(file.name || '', '.', 'back')}, {` `}
              {Math.round(byteToKB(file.size || 0))}KB]
            </p>

            {/* 삭제 버튼 */}
            {!disabled && (
              <button
                className="h-center cursor-pointer gap-2"
                onClick={() => handleDeleteFile(idx)}
              >
                <p className="text-14 text-[#444444]">삭제 X</p>
              </button>
            )}

            {/* 다운로드 버튼 */}
            <button
              className="h-center cursor-pointer gap-2"
              onClick={() => downloadFileByObjectName(fileIdList[idx])}
            >
              <p className="text-14 text-[#444444]">다운로드</p>
              <Download />
            </button>

            {/* 바로보기 버튼 */}
            <button className="h-center cursor-pointer gap-2">
              <p className="text-14 text-[#444444]">바로보기</p>
              <OpenNewWindow color={'#444444'} strokeWidth={1} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AntdDragger;
