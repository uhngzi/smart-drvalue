export const isValidEnglish = (text: string): boolean => {
  const englishRegex = /^[A-Za-z0-9\s]*$/; // 영문자, 숫자, 공백 허용
  return englishRegex.test(text);
};

// 영문자와 공백만 남기고 모두 제거
export const formatEnglish = (text: string): string => {
  return text.replace(/[^A-Za-z0-9\s]/g, "");
};
