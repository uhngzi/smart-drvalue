// components/PopupPortal.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

const PopupPortal = ({ open, children }: { open: boolean, children: React.ReactNode }) => {
  useEffect(() => {
    const existing = document.getElementById("popup-root");
    if (!existing && open) {
      const mount = document.createElement("div");
      mount.id = "popup-root";
      document.body.appendChild(mount);
    }

    return () => {
      const root = document.getElementById("popup-root");
      if (root && !open) {
        root.remove();
      }
    };
  }, [open]);

  if (typeof window === "undefined") return null;
  const container = document.getElementById("popup-root");
  if (!open || !container) return null;

  return createPortal(children, container);
};

export default PopupPortal;