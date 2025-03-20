
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
    },
    laminationItems: {
        tableColumns: [],
        CUDPopItems: [
            { name:'lamDtlTypeEm',label:'유형', widthType:'full', type:'select', option:[{value:'cf',label:'CF'},{value:'pp',label:'PP'},{value:'ccl',label:'CCL'}], },
            { name:'matCd',label:'재질', widthType:'full', type:'select', option:[{value:'FR-1',label:'FR-1'},{value:'FR-4',label:'FR-4'}], },
            { name:'matThk',label:'재질두께', widthType:'full', type:'input', inputType:'number', },
            { name:'copOut',label:'동박외층', widthType:'full', type:'input', },
            { name:'copIn',label:'동박내층', widthType:'full', type:'input', },
            { name:'lamDtlThk',label:'두께', widthType:'full', type:'input', inputType:'number', },
            { name:'lamDtlRealThk',label:'실두께', widthType:'full', type:'input', inputType:'number', },
            { name:'useYn',label:'사용여부', widthType:'full', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}]},
        ]
    },
    mtItems: {
        tableColumns: [],
        CUDPopItems: [
            { name:'materialGroupId',label:'원자재그룹', widthType:'full', type:'select', option:[], },
            { name:'mtNm',label:'원자재명', widthType:'full', type:'input'},
            { name:'mtEnm',label:'원자재영문명', widthType:'full', type:'input', inputType:'number', },
            { name:'unitType',label:'단위', widthType:'full', type:'select', option: []},
            { name:'useYn',label:'사용여부', widthType:'full', type:'select', option:[{value:true,label:'사용'},{value:false,label:'미사용'}] },
        ]
    }
    
}


export { 
    MOCK
 };