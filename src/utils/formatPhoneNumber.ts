export const formatPhoneNumber = (phoneNumber: string) => {
  // 숫자만 추출
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  // 02와 같은 2자리 지역번호 포함 9자리 (02-123-4567)
  if (cleaned.length === 9 && cleaned.startsWith('02')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  // 02와 같은 2자리 지역번호 포함 10자리 (02-1234-5678)
  if (cleaned.length === 10 && cleaned.startsWith('02')) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  // 3자리 지역번호 포함 10자리 (031-123-4567)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  // 3자리 지역번호 포함 11자리 (031-1234-5678)
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // 형식에 맞지 않으면 원본 반환
  return phoneNumber;
};

//전화번호 자동 하이픈 함수
export function inputTel(v: string) {
  if(v.length>13) v = v.slice(0, -1);       // 13글자 제한
  else if (v.slice(0,2).includes('02')) {   // 지역번호가 서울일 경우는 02 이후 하이픈 처리
    if(v.length>12) v = v.slice(0, -1);     // 12글자 제한
    else            v = v.replace(/[^0-9]/g, '').replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, '$1-$2-$3').replace(/(\-{1,2})$/g, "");
  } else            v = v.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
  return v
}