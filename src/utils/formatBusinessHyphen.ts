export function autoHyphenBusinessLicense(value:string) {
  const v = value.replace(/[^0-9]/g, '');
  if(v.length > 10) {
    return v.slice(0, -1).replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  } else if (v.length > 5) {
    return v.substr(0,3)+'-'+v.substr(3,2)+'-'+v.substr(5);
  } else if (v.length > 3) {
    return v.substr(0,3)+'-'+v.substr(3);
  } else {
    return v;
  }
}
// 법인등록번호에 자동 하이픈 추가해주는 함수
export function autoHyphenCorpRegNo(value:string) {
  // 법인등록번호 형식은00000-0000000
  const v = value.replace(/[^0-9]/g, '');
  if(v.length > 10) {
    return v.slice(0, -1).replace(/(\d{5})(\d{7})/, '$1-$2');
  }
  else if (v.length > 5) {
    return v.substr(0,5)+'-'+v.substr(5);
  }
  else {
    return v;
  }
}