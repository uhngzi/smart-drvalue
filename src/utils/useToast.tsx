import CustomToast from "@/components/Modal/CustomToast";
import { useState } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type?: "success" | "error" | "info"; duration?: number }[]
  >([]);

  const showToast = (message: string, type?: "success" | "error" | "info", duration?: number) => {
    const id = Date.now(); // 고유한 ID
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, (duration || 2) * 1000);
  };

  return {
    showToast,
    ToastContainer: () => (
      <div className="fixed bottom-10 right-10 flex flex-col gap-2" style={{zIndex:2000}}>
        {toasts.map((toast) => (
          <CustomToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    ),
  };
};

export default useToast;
