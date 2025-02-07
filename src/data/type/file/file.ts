// 파일

export type fileMultiUploadRType = {
  originUploadResult: {
    eTag: string;
    versionId: string;
  };
  uploadEntityResult: {
    storageType: string;
    size: number;
    status: string;
    originalName: string;
    storageName: string;
    uploaderType: string;
    uploaderDetail?: string;
    uploaderId: string;
    uploadIp: string;
    type: string;
    description?: string;
    updatedAt?: Date | null;
    createdAt?: Date | null;
    deletedAt?: Date | null,
    id: string;
  };
}