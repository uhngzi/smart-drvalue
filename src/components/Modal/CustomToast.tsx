import React, { useState, useEffect } from "react";

interface Props {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; // 지속 시간 (초)
  onClose: () => void;
}

const CustomToast: React.FC<Props> = ({
  message,
  type = "info",
  duration = 3, // 기본 지속 시간 3초
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // 컴포넌트가 마운트될 때 표시

    const hideTimer = setTimeout(() => {
      setVisible(false); // 서서히 사라지는 상태로 변경
    }, (duration - 0.5) * 1000); // 메시지 지속 시간보다 0.5초 빠르게 사라지기 시작

    const removeTimer = setTimeout(() => {
      onClose(); // 완전히 사라진 후 컴포넌트 제거
    }, duration * 1000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-[10%] left-1/2 transform -translate-x-1/2 px-15 py-10 rounded-6 shadow-sm transition-all duration-500 text-white ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } ${
        type === "success"
          ? "bg-[#03C75A]"
          : type === "error"
          ? "bg-[#FFA39E]"
          : "bg-[#F5222D]"
      }`}
    >
      {message}
    </div>
  );
};

export default CustomToast;
