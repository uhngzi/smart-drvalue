export const byteToKB = (byte: number | string) => {
  return parseFloat((Number(byte) / 1024).toFixed(2));
};
