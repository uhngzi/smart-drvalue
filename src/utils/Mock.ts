
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
            { name:'materialGroup.id',label:'원자재그룹', widthType:'full', type:'select', option:[], },
            { name:'mtNm',label:'원자재명', widthType:'full', type:'input'},
            { name:'mtEnm',label:'원자재영문명', widthType:'full', type:'input', inputType:'number', },
            { name:'unitType',label:'단위', widthType:'full', type:'select', option: []},
            { name:'useYn',label:'사용여부', widthType:'full', type:'select', option:[{value:true,label:'사용'},{value:false,label:'미사용'}] },
            { name:'materialSuppliers',label:'구매처 선택', widthType:'full', type:'mSelect', option:[] },
        ]
    },
    userItem: {
        tableColumns: [],
        CUDPopItems: [
            { name:'userName',label:'이름', widthType:'third', type:'input'},
            { name:'userId',label:'아이디', widthType:'third', type:'input'},
            { name:'userPassword',label:'비밀번호', widthType:'third', type:'input'},
            { name:'deptId',label:'부서', widthType:'third', type:'select', option:[], child:'teamId'},
            { name:'teamId',label:'팀', widthType:'third', type:'select', isChild:true, option:[]},
            { name:'empTit',label:'직함', widthType:'third', type:'input'},
            { name:'empRank',label:'직급', widthType:'third', type:'input'},
            { name:'empStDt',label:'입사일', widthType:'third', type:'date'},
            { name:'empSts',label:'근무상태', widthType:'third', type:'select', option:[{value:'대기',label:'대기'},{value:'근무',label:'근무'},{value:'휴직',label:'휴직'},{value:'병가',label:'병가'},{value:'퇴사',label:'퇴사'}]},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
        ]
    }
    
}


export { 
    MOCK
 };