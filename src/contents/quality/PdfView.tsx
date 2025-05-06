// components/PdfView.tsx
import { baseURL } from "@/api/lib/config";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useEffect, useMemo, useState } from "react";

interface PdfViewProps {
  selectImage: string;
}

const PdfView: React.FC<PdfViewProps> = ({ selectImage }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const fetchBlob = async () => {
      if (!selectImage) return;

      const response = await fetch(
        `${baseURL}file-mng/v1/every/file-manager/download/${selectImage}`,
        {
          method: "GET",
        }
      );
      const blob = await response.blob();
      setPdfBlob(blob);
    };

    fetchBlob();
  }, [selectImage]);

  const blobUrl = useMemo(() => {
    return pdfBlob ? URL.createObjectURL(pdfBlob) : null;
  }, [pdfBlob]);

  return (
    blobUrl && (
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl={blobUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    )
  );
};

export default PdfView;
