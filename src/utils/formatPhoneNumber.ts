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
export function inputTel(v: string): string {
  // 숫자만 남기기
  v = v.replace(/[^0-9]/g, '');

  if (v.startsWith('02')) {
    // 서울 번호 처리 (최대 10자리 제한)
    v = v.slice(0, 10);
    if (v.length <= 2) {
      return v; // 02까지만 입력된 경우
    } else if (v.length <= 5) {
      return v.replace(/(\d{2})(\d{1,3})/, '$1-$2'); // 02-XXX
    } else if (v.length <= 9) {
      return v.replace(/(\d{2})(\d{3})(\d{1,4})/, '$1-$2-$3'); // 02-XXX-XXXX
    } else {
      return v.replace(/(\d{2})(\d{4})(\d{1,4})/, '$1-$2-$3'); // 02-XXXX-XXXX
    }
  } else if (v.startsWith('010')) {
    // 휴대폰 번호 처리 (최대 11자리 제한)
    v = v.slice(0, 11);
    if (v.length <= 3) {
      return v; // 010까지만 입력된 경우
    } else if (v.length <= 7) {
      return v.replace(/(\d{3})(\d{1,4})/, '$1-$2'); // 010-XXXX
    } else {
      return v.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3'); // 010-XXXX-XXXX
    }
  } else {
    // 그 외 지역 번호 처리 (032, 051 등, 최대 11자리 제한)
    v = v.slice(0, 11);
    if (v.length <= 3) {
      return v; // 032까지만 입력된 경우
    } else if (v.length <= 6) {
      return v.replace(/(\d{3})(\d{1,3})/, '$1-$2'); // 032-XXX
    } else if (v.length <= 10) {
      return v.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3'); // 032-XXX-XXXX
    } else {
      return v.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3'); // 032-XXXX-XXXX
    }
  }
}

// 전화번호 정규식
export function isValidTel(phoneNumber: string): boolean {
  const phoneRegex = /^(010|02|0[3-9]{1}[0-9]{1})-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
}
