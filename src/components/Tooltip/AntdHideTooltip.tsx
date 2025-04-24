import React, { useState } from "react";
import { Tooltip } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";

interface Props {
  title?: string;
  time?: number;
  children?: React.ReactNode;
  className?: string;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  placement?: TooltipPlacement;
}

const AutoHideTooltip: React.FC<Props> = ({
  title,
  time = 500,
  children,
  className,
  getPopupContainer,
  placement,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
    // 1초 후에 Tooltip을 숨깁니다.
    setTimeout(() => {
      setTooltipVisible(false);
    }, time);
  };

  return (
    <Tooltip
      title={title}
      visible={tooltipVisible}
      getPopupContainer={getPopupContainer}
      placement={placement}
    >
      <div onMouseEnter={handleMouseEnter} className={className}>
        {children}
      </div>
    </Tooltip>
  );
};

export default AutoHideTooltip;
