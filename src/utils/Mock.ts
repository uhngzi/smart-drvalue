const MOCK = {
    prtItems: [
        { label: '거래처명', value: '샘플 거래처', widthType: 'full' },
        { label: '거래처 식별코드', value: 'SP123', widthType: 'half' },
        { label: '거래처 축약명', value: 'SP', widthType: 'half' },
        { label: '거래처 영문명', value: 'Sample Partner Inc.', widthType: 'half' },
        { label: '거래처 영문 축약명', value: 'SPI', widthType: 'half' },
        { label: '사업자등록번호', value: '123-45-67890', widthType: 'half' },
        { label: '법인등록번호', value: '987-65-43210', widthType: 'half' },
        { label: '업태', value: '제조업', widthType: 'half' },
        { label: '업종', value: '전자제품', widthType: 'half' },
        { label: '주소', value: '서울특별시 강남구 테헤란로 123 456호', widthType: 'full' },
        { label: '대표자명', value: '홍길동', widthType: 'half' },
        { label: '전화번호', value: '02-123-4567', widthType: 'half' },
        { label: '팩스번호', value: '02-765-4321', widthType: 'half' },
        { label: '이메일', value: 'info@samplepartner.com', widthType: 'half' },
    ],
    mngItems: [
        { label: '담당자명', value: '김철수', widthType: 'full' },
        { label: '부서명', value: '영업부', widthType: 'half' },
        { label: '팀명', value: '북미팀', widthType: 'half' },
        { label: '담당자 전화번호', value: '02-123-4568', widthType: 'half' },
        { label: '담당자 휴대번호', value: '010-1234-5678', widthType: 'half' },
        { label: '담당자 팩스번호', value: '02-765-4322', widthType: 'half' },
        { label: '담당자 이메일', value: 'chulsoo.kim@samplepartner.com', widthType: 'half' },
    ],
    modelOrderInfo: [
        {label: '거래처명/거래처코드', value: '비케이전자(주)/900', widthType: 'half'},
        {label: '발주일', value: '2021-07-01', widthType: 'half'},
        {label: '고객발주명', value: '비케이전자 이런 모델 발주합니다', widthType: 'full'},
        {label: '발주내용', value: '비케이전자 이런 모델 발주합니다', widthType: 'full'},
    ],
    regOrderModel: [
        {name: "모델명",odno:"GPN_ERP_TEST_0000", layer:"5", thic:"1.6", cnt:"100", dueDt:"2025-07-31"},
        {name: "모델명",odno:"GPN_ERP_TEST_0000", layer:"5", thic:"1.6", cnt:"100", dueDt:"2025-07-31"},
        {name: "모델명",odno:"GPN_ERP_TEST_0000", layer:"5", thic:"1.6", cnt:"100", dueDt:"2025-07-31"},
    ],

    //실제 사용할수도 있으려나...
    companyInfo: [
        {value:'', name:'companyName', label:'회사명', type:'input', widthType:'full'},
        {value:'', name:'companyInitial', label:'회사명 약칭', type:'input', widthType:'half'},
        {value:'', name:'companyEnName', label:'영문 회사명', type:'input', widthType:'half'},
        {value:'', name:'companyBizNumq', label:'사업자등록번호', type:'input', widthType:'half'},
        {value:'', name:'companyRegNum', label:'법인등록번호', type:'input', widthType:'half'},
        {value:'', name:'companyType', label:'업태', type:'input', widthType:'half'},
        {value:'', name:'companyBiz', label:'업종', type:'input', widthType:'half'},
        {value:'', name:'companyCeo', label:'대표자명', type:'input', widthType:'half'},
        {value:'', name:'companyMainTel', label:'대표 전화번호', type:'input', widthType:'half'},
        {value:'', name:'companyMainFax', label:'대표 팩스번호', type:'btnInput', widthType:'half'},
        {value:'', name:'companyMainMail', label:'대표 이메일', type:'input', widthType:'half'},
        {value:'', name:'companyAddr', label:'주소', type:'input', widthType:'full'},
    ],
    companyTaxMng: [
        {value:'', name:'taxMngName', label:'담당자명', type:'btnInput', widthType:'third'},
        {value:'', name:'taxMngMail', label:'이메일', type:'input', widthType:'third'},
        {value:'', name:'taxMngTel', label:'전화번호', type:'input', widthType:'third'},
    ]
}


export { 
    MOCK
 };