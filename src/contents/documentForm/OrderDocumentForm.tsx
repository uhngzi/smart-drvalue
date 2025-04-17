// 완제 발주서: 강재혁

import React from 'react';

const OrderDocumentForm = () => {

  return (
    <div className="flex flex-col gap-15 px-20 py-30">
      
      {/* 타이틀 영역 */}
      <div className="v-between-h-center">
        <div className="v-h-center w-75 h-40 bg-[#000] text-[#fff]">임시 로고</div>

        <div>
          <p className="text-20 text-[#000] font-medium">발주서</p>
        </div>

        <div>
          <table>
            <tr></tr>
            <tr></tr>
          </table>
        </div>
      </div> {/* 타이틀 영역 end */}

    </div>
  )
}

export default OrderDocumentForm;