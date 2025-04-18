// components/PopupPortal.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

const PopupPortal = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const existing = document.getElementById("popup-root");
    if (!existing) {
      const mount = document.createElement("div");
      mount.id = "popup-root";
      document.body.appendChild(mount);
    }
  }, []);

  if (typeof window === "undefined") return null;
  const container = document.getElementById("popup-root");
  if (!container) return null;

  return createPortal(children, container);
};

export default PopupPortal;