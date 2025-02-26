import { Dayjs } from "dayjs";

export type errBoardType = {
  id?: string;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  deletedAt?: Date | Dayjs | null;
  tenantId?: string;
  tenantUserId?: string;
  writerId?: string;
  writerName?: string;
  menuName?: string;
  detailWorkName?: string;
  content?: string;
  attachmentFiles?: string[];
  status?: string;
}

export type errCommentType = {
  id?: string;
  class?: number;
  order?: number;
  message?: string;
  tenantId?: string;
  tenantUserId?: string;
  writerId?: string;
  writerName?: string;
  deletedAt?: Date | Dayjs | null;
  createdAt?: Date | Dayjs | null;
  updatedAt?: Date | Dayjs | null;
  childComments?: {
    createdAt: Date | Dayjs | null;
    updatedAt: Date | Dayjs | null;
    id: string;
    tenantId: string;
    tenantUserId: string;
    writerId: string;
    writerName: string;
    message: string;
    class: number;
    order: number;
  }[];
  childShow?: boolean;
}

export const errReq = () => {
  return [
    { field: 'writerName', label: '작성자명' },
    { field: 'menuName', label: '메뉴명' },
    { field: 'detailWorkName', label: '세부작업명' },
    { field: 'content', label: '내용' },
    { field: 'attachmentFiles', label: '첨부파일' },
  ]
}