const MOCK = {
    clientItems: {
        tableColumns: [],
        CUDPopItems: [
            {name: 'prtNm', label: '거래처명', widthType: 'third', type: 'input'},
            {name: 'prtRegCd', label: '식별코드', widthType: 'third', type: 'input'},
            {name: 'prtSnm', label: '축약명', widthType: 'third', type: 'input'},
            {name: 'prtEngNm', label: '영문명', widthType: 'third', type: 'input'},
            {name: 'prtEngSnm', label: '영문 축약명', widthType: 'third', type: 'input'},
            {name: 'prtRegNo', label: '사업자등록번호', widthType: 'third', type: 'input'},
            {name: 'prtCorpRegNo', label: '법인등록번호', widthType: 'third', type: 'input'},
            {name: 'prtBizType', label: '업태', widthType: 'third', type: 'input'},
            {name: 'prtBizCate', label: '업종', widthType: 'third', type: 'input'},
            {name: 'prtAddr', label: '주소', widthType: 'full', type: 'address'},
            {name: 'prtAddrDtl', label: '상세주소', widthType: 'full', type: 'input'},
            {name: 'prtCeo', label: '대표자명', widthType: 'third', type: 'input'},
            {name: 'prtTel', label: '전화번호', widthType: 'third', type: 'input'},
            {name: 'prtFax', label: '팩스번호', widthType: 'third', type: 'input'},
            {name: 'prtEmail', label: '이메일', widthType: 'third', type: 'input'},
        ],
    },
    wkBoardItems: {
        tableColumns: [],
        CUDPopItems: [
            { name:'brdType',label:'원판유형', widthType:'full', type:'input', },
            { name:'brdDesc',label:'원판명', widthType:'full', type:'input', },
            { name:'brdW',label:'가로', widthType:'full', type:'input', },
            { name:'brdH',label:'세로', widthType:'full', type:'input', },
            { name:'brdExtraInfo',label:'추가정보', widthType:'full', type:'input', },
        ]
    }
    
}


export { 
    MOCK
 };