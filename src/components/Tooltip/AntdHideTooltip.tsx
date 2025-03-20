import React, { useState } from 'react';
import { Tooltip } from "antd";

interface Props {
  title?: string;
  time?: number;
  children?: React.ReactNode;
  className?: string;
}

const AutoHideTooltip:React.FC<Props> = ({
  title,
  time = 500,
  children,
  className,
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
    <Tooltip title={title} visible={tooltipVisible}>
      <div onMouseEnter={handleMouseEnter} className={className}>
        {children}
      </div>
    </Tooltip>
  );
};

export default AutoHideTooltip;
