const MOCK = {
    prtItems: [
        { label: '거래처명', value: '샘플 거래처', type: 'full' },
        { label: '거래처 식별코드', value: 'SP123', type: 'half' },
        { label: '거래처 축약명', value: 'SP', type: 'half' },
        { label: '거래처 영문명', value: 'Sample Partner Inc.', type: 'half' },
        { label: '거래처 영문 축약명', value: 'SPI', type: 'half' },
        { label: '사업자등록번호', value: '123-45-67890', type: 'half' },
        { label: '법인등록번호', value: '987-65-43210', type: 'half' },
        { label: '업태', value: '제조업', type: 'half' },
        { label: '업종', value: '전자제품', type: 'half' },
        { label: '주소', value: '서울특별시 강남구 테헤란로 123 456호', type: 'full' },
        { label: '대표자명', value: '홍길동', type: 'half' },
        { label: '전화번호', value: '02-123-4567', type: 'half' },
        { label: '팩스번호', value: '02-765-4321', type: 'half' },
        { label: '이메일', value: 'info@samplepartner.com', type: 'half' },
    ],
    mngItems: [
        { label: '담당자명', value: '김철수', type: 'full' },
        { label: '부서명', value: '영업부', type: 'half' },
        { label: '팀명', value: '북미팀', type: 'half' },
        { label: '담당자 전화번호', value: '02-123-4568', type: 'half' },
        { label: '담당자 휴대번호', value: '010-1234-5678', type: 'half' },
        { label: '담당자 팩스번호', value: '02-765-4322', type: 'half' },
        { label: '담당자 이메일', value: 'chulsoo.kim@samplepartner.com', type: 'half' },
    ],
    modelOrderInfo: [
        {label: '거래처명/거래처코드', value: '비케이전자(주)/900', type: 'half'},
        {label: '발주일', value: '2021-07-01', type: 'half'},
        {label: '고객발주명', value: '비케이전자 이런 모델 발주합니다', type: 'full'},
        {label: '발주내용', value: '비케이전자 이런 모델 발주합니다', type: 'full'},
    ],
    regOrderModel: [
        {name: "모델명", layer:"5", thic:"1.6", cnt:"100", dueDt:"2025-07-31"},
        {name: "모델명", layer:"5", thic:"1.6", cnt:"100", dueDt:"2025-07-31"},
        {name: "모델명", layer:"5", thic:"1.6", cnt:"100", dueDt:"2025-07-31"},
    ]
}


export { 
    MOCK
 };