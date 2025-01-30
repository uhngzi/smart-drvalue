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
    uploaderDetail: string;
    uploaderId: string;
    uploadIp: string;
    type: string;
    description: string;
    updatedAt: Date;
    createdAt: Date;
    deletedAt: null,
    id: string;
  };
}