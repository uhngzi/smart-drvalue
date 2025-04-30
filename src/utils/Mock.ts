import { generateFloorOptions } from "@/data/type/enum";

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
					{ name:'matNm', label:'자재', widthType:'full', type:'select', optionSource: 'materialOptions' },
					{ name:'matNm',label:'자재두께', widthType:'full', type:'select', optionSource: 'materialOptions', disabled: true },
					{ name:'epoxy',label:'Epoxy', widthType:'full', type:'input', inputType:'number', },
					{ name:'name', label:'동박', widthType:'full', type:'select', optionSource: 'copperList' },
					{ name:'name',label:'동박두께', widthType:'full', type:'select', optionSource: 'copperList', disabled: true},
					{ name:'useYn',label:'사용여부', widthType:'full', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}]},
			]
	},
    MaterialListPage: {
        tableColumns: [],
        CUDPopItems: [
            { name:'lamDtlTypeEm',label:'유형', widthType:'full', type:'select', option:[{value:'cf',label:'CF'},{value:'pp',label:'PP'},{value:'ccl',label:'CCL'}], },
            { name:'matNm',label:'재질', widthType:'full', type:'input', inputType:'string', },
            { name:'epoxy',label:'Epoxy', widthType:'full', type:'input', inputType:'number', },
            { name:'code',label:'코드', widthType:'full', type:'input', },
        ]   
    },

		CopperListPage: {
			tableColumns: [],
				CUDPopItems: [ 
						{ name:'name',label:'이름', widthType:'full', type:'input'},
						{ name:'copThk',label:'두께', widthType:'full', type:'input', inputType:'number', },
						{ name:'useYn',label:'사용여부', widthType:'full', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}]},
				]   
		},
    mtItems: {
        tableColumns: [],
        CUDPopItems: [
            { name:'materialGroup.id',label:'원자재그룹', widthType:'full', type:'select', option:[], },
            { name:'mtNm',label:'원자재명', widthType:'full', type:'input'},
            { name:'mtEnm',label:'원자재영문명', widthType:'full', type:'input', inputType:'text', },
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
            { name:'userPassword',label:'비밀번호', widthType:'third', type:'password'},
            { name:'deptId',label:'부서', widthType:'half', type:'select', option:[], child:'teamId'},
            { name:'teamId',label:'팀', widthType:'half', type:'select', isChild:true, option:[]},
            { name:'empTit',label:'직함', widthType:'third', type:'input'},
            { name:'empRank',label:'직급', widthType:'third', type:'input'},
            { name:'empStDt',label:'입사일', widthType:'third', type:'date'},
            { name:'empSts',label:'근무상태', widthType:'third', type:'select', option:[{value:'대기',label:'대기'},{value:'근무',label:'근무'},{value:'휴직',label:'휴직'},{value:'병가',label:'병가'},{value:'퇴사',label:'퇴사'}]},
            { name:'defMetaDataWorkType',label:'근무형태', widthType:'third', type:'select', option:[]},
            { name:'defMetaDataJobType',label:'업무구분', widthType:'third', type:'select', option:[]},
            { name:'empRemarks',label:'특이사항', widthType:'full', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
            // { name:'userName',label:'이름', widthType:'third', type:'input'},
        ]
    },

    
    vendorItems: {
        tableColumns: [],
        CUDPopItems: [
          { name: 'processGroupIdx', key: 'id', label: '공정그룹', widthType: 'third', type: 'select', option: [] },
          { name: 'processIdx', key: 'id', label: '공정', widthType: 'third', type: 'select', option: [] },
          { name: 'vendorIdx', key: 'id', label: '외주처', widthType: 'third', type: 'select', option: [] },
          { name: 'priceNm', label: '가격명', widthType: 'third', type: 'input' },
          { name: 'priceUnit', label: '가격', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'layerEm', label: '층', widthType: 'third', type: 'select', option: generateFloorOptions() },
          { name: 'modelTypeEm', label: '제품유형', widthType: 'third', type: 'select', option: [
            { value: 'sample', label: '샘플' },
            { value: 'mass', label: '양산' },
          ] },
          { name: 'thk', label: '두께', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'pnlcntMin', label: 'PNL최소수량', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'pnlcntMax', label: 'PNL최대수량', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'holecntMin', label: '최소홀수', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'holecntMax', label: '최대홀수', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'm2Min', label: '최저면적', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'm2Max', label: '최대면적', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'wgtMin', label: '최소무게', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'wgtMax', label: '최대무게', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'cntMin', label: '최소수량', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'cntMax', label: '최대수량', widthType: 'third', type: 'input', inputType: 'number' },
          { name: 'useYn', label: '사용여부', widthType: 'third', type: 'select', option: [
            { value: true, label: '사용' },
            { value: false, label: '미사용' },
          ] },
          { name: 'appDt', label: '적용일', widthType: 'third', type: 'date' },
        ]
      },

    // 모델 단가 items 추가
    unitModelItems: {
      tableColumns: [],
      CUDPopItems: [
        { name:'layerEm', label:'레이어 유형', widthType:'half', type:'select', option:[{value:'L1', label:'L1'}] },
        { name:'minAmount', label:'최소 수량', widthType:'half', type:'input', inputType:'number' },
        { name:'maxAmount', label:'최대 수량', widthType:'half', type:'input', inputType:'number' },
        { name:'price', label:'가격', widthType:'half', type:'input', inputType:'number' },
        { name:'deliveryDays', label:'배송일', widthType:'half', type:'input', inputType:'number' },
        //{ name:'ordNo', label:'순번', widthType:'half', type:'input', inputType:'number' },
        { name:'useYn', label:'사용 여부', widthType:'half', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}] },
        { name:'remark', label:'비고', widthType:'half', type:'input' },
        { name:'appDt', label:'적용일', widthType:'half', type:'date' },
      ]
    },
    
    applyUnitModelItems: {
      tableColumns: [],
      CUDPopItems: [
        { name:'layerEm', label:'레이어 유형', widthType:'half', type:'select', option:[{value:'L1', label:'L1'}] },
        { name:'minAmount', label:'최소 수량', widthType:'half', type:'input', inputType:'number' },
        { name:'maxAmount', label:'최대 수량', widthType:'half', type:'input', inputType:'number' },
        { name:'price', label:'가격', widthType:'half', type:'input', inputType:'number' },
        { name:'deliveryDays', label:'배송일', widthType:'half', type:'input', inputType:'number' },
        { name:'useYn', label:'사용 여부', widthType:'half', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}] },
        { name:'remark', label:'비고', widthType:'half', type:'input' },
        { name:'appDt', label:'적용일', widthType:'half', type:'date' },
        { name:'applyAppDt', label:'단가 적용일', widthType:'half', type:'date' },
        { name:'applyPrice', label: '적용단가', widthType: 'half', type: 'input', inputType: 'number' },
      ]
    },

    // 추가비용(두께) items 추가
    unitThicknessItems: {
      tableColumns: [],
      CUDPopItems: [
        { name:'layerEm', label:'레이어 유형', widthType:'half', type:'select', option:[{value:'L1', label:'L1'}] },
        { name:'minThickness', label:'최소 두께', widthType:'half', type:'input', inputType:'number' },
        { name:'maxThickness', label:'최대 두께', widthType:'half', type:'input', inputType:'number' },
        { name:'weight', label:'가중치', widthType:'half', type:'input', inputType:'number' },
        { name:'addCost', label:'추가 비용', widthType:'half', type:'input', inputType:'number' },
        //{ name:'ordNo', label:'순번', widthType:'half', type:'input', inputType:'number' },
        { name:'useYn', label:'사용 여부', widthType:'half', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}] },
        { name:'remark', label:'비고', widthType:'half', type:'input' },
        { name:'appDt', label:'적용일', widthType:'half', type:'date' },
      ]
    },

    // 재질 items 추가
    unitTextureItems: {
      tableColumns: [],
      CUDPopItems: [
        { name:'texture', label:'재질', widthType:'half', type:'select', option:[{value:'FR-1',label:'FR-1'},{value:'FR-4',label:'FR-4'}] },
        { name:'weight', label:'가중치', widthType:'half', type:'input', inputType:'number' },
        { name:'addCost', label:'추가 비용', widthType:'half', type:'input', inputType:'number' },
        { name:'useYn', label:'사용 여부', widthType:'half', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}] },
        { name:'remark', label:'비고', widthType:'half', type:'input' },
        { name:'appDt', label:'적용일', widthType:'half', type:'date' },
      ]
    },

    // 특별사양 items 추가
    unitSpecialItems: {
      tableColumns: [],
      CUDPopItems: [
        { name:'process', label:'공정', widthType:'half', type:'select', option:[{value:'FR-1',label:'FR-1'},{value:'FR-4',label:'FR-4'}] },
        { name:'weight', label:'가중치', widthType:'half', type:'input', inputType:'number' },
        { name:'minRange', label:'최소 범위', widthType:'half', type:'input', inputType:'number' },
        { name:'maxRange', label:'최대 범위', widthType:'half', type:'input', inputType:'number' },
        { name:'unit', label:'단위', widthType:'half', type:'select', option:[{value:'FR-1',label:'FR-1'},{value:'FR-4',label:'FR-4'}] },
        //{ name:'ordNo', label:'순번', widthType:'half', type:'input', inputType:'number' },
        { name:'useYn', label:'사용 여부', widthType:'half', type:'select', option:[{value:true,label:"사용"},{value:false,label:"미사용"}] },
        { name:'remark', label:'비고', widthType:'half', type:'input' },
        { name:'appDt', label:'적용일', widthType:'half', type:'date' },
      ]
    },
      
    materialPriceItems: {
      CUDPopItems: [
        { name: 'materialIdx', label: '원자재', widthType: 'third', type: 'select', required: true },
        { name: 'partnerIdx', label: '공급처', widthType: 'third', type: 'select', required: true },
        { name: 'priceNm', label: '가격명', widthType: 'third', type: 'input', required: true },
        { name: 'priceUnit', label: '단가', widthType: 'third', type: 'input', inputType:'number', required: true },
        { name: 'materialType', label: '금속 타입', widthType: 'third', type: 'input' },
        { name: 'txturType', label: '재질 타입', widthType: 'third', type: 'input' },
        { name: 'thicMin', label: '최소 두께', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'thicMax', label: '최대 두께', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'sizeW', label: '가로(mm)', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'sizeH', label: '세로(mm)', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'cntMin', label: '최소 수량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'cntMax', label: '최대 수량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'wgtMin', label: '최소 중량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'wgtMax', label: '최대 중량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'unitType', label: '단위', widthType: 'third', type: 'input' },
        { name: 'remarks', label: '기타사항', widthType: 'third', type: 'input' },
        { name: 'safeInv', label: '안전재고', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'appDt', label: '적용일', widthType: 'third', type: 'date', required: true },
        { name: 'useYn', label: '사용 여부', widthType: 'third', type: 'select', option: [
          { value: true, label: '사용' },
          { value: false, label: '미사용' }
        ], required: true },
      ]  
    }, 

    ApplymaterialPriceItems: {
      CUDPopItems: [
        { name: 'materialIdx', label: '원자재', widthType: 'third', type: 'select', required: true },
        { name: 'partnerIdx', label: '공급처', widthType: 'third', type: 'select', required: true },
        { name: 'priceNm', label: '가격명', widthType: 'third', type: 'input', required: true },
        { name: 'priceUnit', label: '단가', widthType: 'third', type: 'input', inputType:'number', required: true },
        { name: 'materialType', label: '금속 타입', widthType: 'third', type: 'input' },
        { name: 'txturType', label: '재질 타입', widthType: 'third', type: 'input' },
        { name: 'thicMin', label: '최소 두께', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'thicMax', label: '최대 두께', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'sizeW', label: '가로(mm)', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'sizeH', label: '세로(mm)', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'cntMin', label: '최소 수량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'cntMax', label: '최대 수량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'wgtMin', label: '최소 중량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'wgtMax', label: '최대 중량', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'unitType', label: '단위', widthType: 'third', type: 'input' },
        { name: 'remarks', label: '기타사항', widthType: 'third', type: 'input' },
        { name: 'safeInv', label: '안전재고', widthType: 'third', type: 'input', inputType:'number' },
        { name: 'appDt', label: '설정적용일', widthType: 'third', type: 'date', required: true },
        { name: 'useYn', label: '사용 여부', widthType: 'third', type: 'select', option: [
          { value: true, label: '사용' },
          { value: false, label: '미사용' }
        ], required: true },
        { name: 'applyPrice', label: '예정단가', widthType: 'third', type: 'input', required: true },
        { name: 'applyPricedt', label: '단가적용일', widthType: 'third', type: 'date', required: true },
      ]  
    }, 
}

export { 
    MOCK
};