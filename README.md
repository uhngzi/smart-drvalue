# SMART FRONT

###

- 개발기간 : 24.12.31 ~ XX.XX.XX
- 최신버전 : v0.1
- 개발참여 : 승예지

## 빌드

```
  // 초기에만 실행
  $ yarn

$ yarn dev
```

## 사용 기술 및 라이브러리

`Next.js` `yarn berry` `TypeScript` `tailwind css` `styled-component` `antd`

## 프로젝트 구조

```
  src
    - api : API와 연결되는 정보 및 API 주소 폴더
        - lib : API 연결 정보 폴더
        - insert.ts : insert 관련 API 주소 파일
        - list.ts : list 관련 API 주소 파일
        - update.ts : update 관련 API 주소 파일

    - assets : 미디어 파일 저장 하는 폴더
        - image : png, jpg 등 이미지 파일 저장 폴더
        - logo : 로고에 쓰이는 이미지 파일 폴더
        - svg : svg 파일 저장 폴더

    - components : 재사용되는 컴포넌트 폴더 (select, input 등...)

    - contents : 페이지 내 사용되는 컴포넌트 폴더 (모달창 내용 등...)

    - data : 컬럼, 데이터 타입 등을 저장하는 폴더
        - column : 페이지 내 기본 목록 컬럼을 저장하는 폴더
        - type : 데이터 타입을 저장하는 폴더

    - layout : 전체적인 틀로 사용되는 컴포넌트 폴더

    - pages : Next.js에서 사용하는 페이지 폴더

    - styles : 프로젝트 내에서 공통적으로 설정하는 style
    
    - utils : 프로젝트 내에서 사용하는 유틸리티 폴더 (함수, 상수, 변수 등등)
```

## 스타일 축약

```
  wd : width
  ht : height
  bg : background color
  fc, fs, fw : font color, size, weight
  pd, pt, pl, pr, pb : padding top, left, right, bottom
  mg, mt, ml, mr, mb : margin top, left, right, bottom
  bd, bd_t, bd_l, bd_r, bd_b : border top, left, right, bottom
  bc, bw : border color, width
```

## 배포

```
ssh -i smartFront.pem root@115.68.221.100
  BHM<9O2-
지피엔 : cd /home/smart/smart-front
신양 : cd /home/smart/smart-sinyang
  * 현재 테넌트 코드를 하드코딩 해둔 상태 (수정 필요)
git pull
  개인 계정명
  개인 토큰
yarn build
지피엔 : pm2 restart 31 또는 pm2 restart smart80 
신양 : pm2 restart sy

  *** 서버 내 yarnrc.yml 파일 내 nodeLinker는 node-modules로 실행 (yarn berry ~ pnp로 진행할 경우 에러 발생되므로...)
```


```
근태 관련
** SIDER 내 근태만 남길 것
** MainPageLayout 내 loginCheck 주석 처리
cd /home/secom/smart-front
git pull
yarn build
pm2 restart smart-front-81
```