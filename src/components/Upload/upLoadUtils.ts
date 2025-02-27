import { instance, instanceRoot } from '@/api/lib/axios';

import { Modal } from 'antd';

export const sliceByDelimiter = (
  str: string,
  delimiter: string,
  type: 'front' | 'back',
) => {
  const index = str.indexOf(delimiter);

  if (index === -1) return str; // delimiter가 없을 경우 빈 문자열 반환

  switch (type) {
    case 'front':
      return str.slice(0, index);
    case 'back':
      return str.slice(index + delimiter.length);
    default:
      return '';
  }
};

const fileToBase64 = (file: any): any => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const uploadFile = async (file: any) => {
  try {
    const response = await instance.put(
      '/nhn/api-nhn-object-storage/upload/base64/user',
      {
        base64Value: await fileToBase64(file.originFileObj),
        isUploaderOnly: false,
        fileExtension: file.name.split('.').pop(),
        originFileName: file.name,
      },
    );
    if (response.data.status == 403) {
      Modal.error({
        title: '업로드 실패',
        content: '첨부파일이 용량 제한(300KB)을 초과하였습니다',
      });
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const downloadFileByObjectName = async (storageId: string) => {
  try {
    const response = await instanceRoot.get(
      `file-mng/v1/every/file-manager/download/${storageId}`,
      {responseType: 'blob'}
    );
    console.log(response);

    // 🎯 파일명 가져오기 (Content-Disposition 헤더에서)
    const contentDisposition = response.headers['content-disposition'];
    let fileName = "downloaded-file"; // 기본값
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        fileName = match[1].replace(/['"]/g, ''); // 따옴표 제거
      }
    }

    // 파일 다운로드 처리
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // 다운로드할 파일 이름 설정
    document.body.appendChild(link);
    link.click();

    // 메모리 정리
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('파일 다운로드 중 오류 발생:', error);
    throw error; // 에러 발생 시 호출한 곳에서 처리할 수 있도록 던집니다.
  }
};

export const checkLimit = async () => {
  try {
    const response = await instance.get(
      '/nhn/api-nhn-object-storage/limit/check/me',
    );
  } catch (error) {
    console.log(error);
  }
};
