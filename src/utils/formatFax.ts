export function inputFax(v: string): string {
  // 숫자만 남기기
  v = v.replace(/[^0-9]/g, '');

  if (v.slice(0, 2) === '02') {
    // 서울 지역번호 (02)
    v = v.slice(0, 10); // 최대 10글자 제한
    if (v.length <= 2) {
      return v; // 02까지만 입력되었을 때
    } else if (v.length <= 5) {
      return v.replace(/(\d{2})(\d{1,3})/, '$1-$2'); // 02-XXX
    } else {
      return v.replace(/(\d{2})(\d{3,4})(\d{1,4})/, '$1-$2-$3'); // 02-XXX-XXXX 또는 02-XXXX-XXXX
    }
  } else {
    // 그 외 지역번호
    v = v.slice(0, 11); // 최대 11글자 제한
    if (v.length <= 3) {
      return v; // 지역번호까지만 입력되었을 때
    } else if (v.length <= 6) {
      return v.replace(/(\d{3})(\d{1,3})/, '$1-$2'); // XXX-XXX
    } else {
      return v.replace(/(\d{3})(\d{3,4})(\d{1,4})/, '$1-$2-$3'); // XXX-XXX-XXXX 또는 XXX-XXXX-XXXX
    }
  }
}
