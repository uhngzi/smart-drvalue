import React from "react";

const ProgressBar = ({ value = 0 }) => {
  const percentage = Math.max(0, Math.min(100, value)); // 0 ~ 100 사이로 제한

  // 값에 따른 배경색 결정 (낮음: 0~30, 중간: 30~70, 높음: 70~100)
  let bgColor = "";
  if (percentage < 30) {
    bgColor = "#6226EF20";
  } else if (percentage <= 70) {
    bgColor = "#FFA75620"; // 중간 (주황 계열)
  } else {
    bgColor = "#00B69B20"; // 초록
  }

  const containerStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    position: "relative",
    width: "100%",
    height: "26px",
    borderRadius: "2px",
    overflow: "hidden",
  };

  const barStyle = {
    height: "100%",
    backgroundColor: bgColor,
    width: `${percentage}%`,
    transition: "width 0.3s ease",
  };

  const textStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  };

  return (
    <div style={containerStyle}>
      <div style={barStyle} />
      <div style={textStyle}>{percentage}%</div>
    </div>
  );
};

export default ProgressBar;
