import { baseURL } from "@/api/lib/config";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import { useEffect, useMemo, useState } from "react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  DownloadOutlined,
  DownOutlined,
  FullscreenOutlined,
  PrinterOutlined,
  UpOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

interface PdfViewProps {
  selectImage: string;
  fileName: string;
  width?: number;
}

const PdfView: React.FC<PdfViewProps> = ({
  selectImage,
  fileName,
  width = 500,
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(props) => {
          const {
            GoToPreviousPage,
            GoToNextPage,
            CurrentPageInput,
            ZoomOut,
            ZoomIn,
            EnterFullScreen,
            Download,
            Print,
          } = props;

          return (
            <div style={{ display: "flex", gap: "15px" }}>
              <GoToPreviousPage>
                {(props) => (
                  <button onClick={props.onClick} style={{ marginLeft: 10 }}>
                    <UpOutlined
                      style={{ fontSize: "18px", color: "#00000080" }}
                    />
                  </button>
                )}
              </GoToPreviousPage>
              <GoToNextPage>
                {(props) => (
                  <button onClick={props.onClick}>
                    <DownOutlined
                      style={{ fontSize: "18px", color: "#00000080" }}
                    />
                  </button>
                )}
              </GoToNextPage>
              <ZoomOut>
                {(props) => (
                  <button onClick={props.onClick}>
                    <ZoomOutOutlined
                      style={{ fontSize: "18px", color: "#00000080" }}
                    />
                  </button>
                )}
              </ZoomOut>
              <ZoomIn>
                {(props) => (
                  <button onClick={props.onClick}>
                    <ZoomInOutlined
                      style={{ fontSize: "18px", color: "#00000080" }}
                    />
                  </button>
                )}
              </ZoomIn>
              <EnterFullScreen>
                {(props) => (
                  <button onClick={props.onClick}>
                    <FullscreenOutlined
                      style={{ fontSize: "18px", color: "#00000080" }}
                    />
                  </button>
                )}
              </EnterFullScreen>
              {/* <Download /> */}
              <button
                onClick={() => {
                  if (pdfBlob) {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(pdfBlob);
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(a.href);
                  }
                }}
              >
                <DownloadOutlined
                  style={{ fontSize: "18px", color: "#00000080" }}
                />
              </button>
              <Print>
                {(props) => (
                  <button onClick={props.onClick}>
                    <PrinterOutlined
                      style={{ fontSize: "18px", color: "#00000080" }}
                    />
                  </button>
                )}
              </Print>
            </div>
          );
        }}
      </Toolbar>
    ),
  });

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
      <div
        style={{
          width: `${width}px`,
          height: "calc(85vh - 60px)",
          overflow: "auto",
        }}
      >
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
        >
          <Viewer fileUrl={blobUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    )
  );
};

export default PdfView;
