export const isValidNumber = (text: string): boolean => {
  const numberRegex = /^\d*\.?\d*$/;  // 숫자와 소수점만 허용
  return numberRegex.test(text) && text !== '';
} 