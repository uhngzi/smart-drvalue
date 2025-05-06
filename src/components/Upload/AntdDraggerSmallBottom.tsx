import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import UploadIcon from "@/assets/svg/icons/upload.svg";
import Klip from "@/assets/svg/icons/klip.svg";
import Del from "@/assets/svg/icons/trash.svg";

import { message, Modal, UploadProps } from "antd";
import { UploadFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import styled from "styled-components";
import { downloadFileByObjectName, sliceByDelimiter } from "./upLoadUtils";
import cookie from "cookiejs";
import { baseURL, cookieName } from "@/api/lib/config";
import useToast from "@/utils/useToast";
import { port } from "@/pages/_app";

interface Props {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  fileIdList: string[];
  setFileIdList: Dispatch<SetStateAction<string[]>>;

  disabled?: boolean;
  mult?: boolean;
  divRef?: RefObject<HTMLDivElement | null>;
  changeHeight?: { width: number; height: number } | null;
  defaultHeight?: number | string;

  max?: number;
  acceptType?: string[];
  maxSizeMB?: number;
}

const CustomDragger = styled(Dragger)`
  height: 40px;

  & .ant-upload-drag .ant-upload-btn {
    padding: 0;
    height: 40px;
  }

  & .ant-upload-btn {
    height: 40px !important;
  }

  & .ant-upload-drag {
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    background: #fff;
    height: 40px;
  }
`;

const AntdDraggerSmallBottom: React.FC<Props> = ({
  fileList,
  setFileList,
  fileIdList,
  setFileIdList,

  disabled = false,
  mult = false,
  divRef,
  changeHeight,
  defaultHeight,

  max,
  acceptType,
  maxSizeMB,
}) => {
  const { showToast, ToastContainer } = useToast();

  const UploadProp: UploadProps = {
    name: "files",
    multiple: mult,
    showUploadList: false,
    beforeUpload: (file, fileListNew) => {
      if (max && fileList.length + fileListNew.length > max) {
        showToast(`최대 ${max}개의 파일만 업로드할 수 있습니다.`, "error");
        return false; // 업로드 무시
      }

      if (maxSizeMB && file.size / 1024 / 1024 > maxSizeMB) {
        showToast(
          `파일 크기는 최대 ${maxSizeMB}MB까지만 업로드할 수 있습니다.`,
          "error"
        );
        return false;
      }

      // 타입 체크
      if (
        acceptType &&
        !acceptType.some((typePrefix) => file.type.startsWith(typePrefix))
      ) {
        const readableTypes = acceptType
          .map((type) => {
            if (type === "image/") return "이미지";
            if (type === "application/pdf") return "PDF";
            return type;
          })
          .join(", ");
        showToast(
          `지원하지 않는 파일 형식입니다. (${readableTypes} 형식의 파일만 첨부 가능합니다)`,
          "error"
        );
        return false;
      }

      return true;
    },
    onChange: async (info) => {
      const { status } = info.file;

      if (status === "error") {
        showToast(
          "파일 업로드에 실패했습니다. 잠시 후에 다시 시도해주세요.",
          "error"
        );
      }

      if (info.file.status === "done") {
        if (info.file.response?.resultCode !== "OK_0000") {
          showToast(`${info?.file?.response?.message}`, "error");
          return;
        }

        const filesNm = (info.file.response.data ?? []).map((file: any) => {
          return file?.uploadEntityResult?.storageName;
        });
        setFileList((prev) => [...prev, info.file]);
        setFileIdList((prev) => [...prev, ...filesNm]);
      }
    },
  };

  const handleDeleteFile = (idx: number) => {
    setFileList((prevFileList) =>
      prevFileList.filter((_, index) => index !== idx)
    );
    setFileIdList((prevFileIdList) =>
      prevFileIdList.filter((_, index) => index !== idx)
    );
  };

  const [height, setHeight] = useState<number | string>(0);
  useEffect(() => {
    if (!height) setHeight(defaultHeight ?? 100);
  }, [defaultHeight]);

  useEffect(() => {
    if (divRef?.current?.clientHeight) {
      const divHeight =
        Number(divRef?.current?.clientHeight) - Number(defaultHeight ?? 0);
      if (divHeight > 0) setHeight(divHeight);
      else setHeight(172);
    }
  }, [changeHeight]);

  return (
    <>
      <CustomDragger
        {...UploadProp}
        className="bg-white"
        disabled={disabled}
        name="files"
        headers={{
          "x-tenant-code": String(
            port === "90" || cookie.get("companySY") === "sy"
              ? "shinyang-test"
              : port === "3000"
              ? // "shinyang-dev"
                "gpntest-dev"
              : cookie.get("x-custom-tenant-code") || "gpntest-sebuk-ver"
          ),
          Authorization: `bearer ${cookie.get(cookieName)}`,
        }}
        action={`${baseURL}file-mng/v1/tenant/file-manager/upload/multiple`}
      >
        <div
          className={`h-40 flex-col v-h-center bg-point1 rounded-2 text-white ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div className="h-center gap-5">
            <p className="w-24 h-24 v-h-center">
              <UploadIcon />
            </p>
            파일 등록
          </div>
        </div>
      </CustomDragger>
      {fileList && fileList?.length > 0 && (
        <div
          className="flex flex-col overflow-y-auto"
          style={{ height: height }}
        >
          {fileList.map((file, idx) => (
            <div className="h-center" key={idx}>
              <p className="w-16 h-16 mr-8 min-w-16 min-h-16">
                <Klip />
              </p>
              {/* 파일 이름/형식/사이즈 */}
              <p
                className="flex flex-1 text-15 text-[#1890FF] cursor-pointer"
                key={idx}
                onClick={() =>
                  downloadFileByObjectName(fileIdList[idx], fileList[idx])
                }
              >
                {sliceByDelimiter(file.name || "", ".", "front")}.
                {sliceByDelimiter(file.name || "", ".", "back")}
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
      )}
      <ToastContainer />
    </>
  );
};

export default AntdDraggerSmallBottom;
