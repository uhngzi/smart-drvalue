import { deleteAPI } from "@/api/delete";
import { patchAPI } from "@/api/patch";
import { postAPI } from "@/api/post";
import { CUtreeType } from "@/data/type/componentStyles";

export async function onTreeAdd(url: string, data: any){
  try { 
    
    const result = await postAPI({
      type: 'baseinfo', 
      utype: 'tenant/',
      url: url,
      jsx: 'jsxcrud'
    }, data);

    if(result.resultCode != 'OK_0000') {
      console.error("아이디 생성 실패 : ", data)
      return false;
    }
    return true;
  }catch(e){
    console.error('추가중 오류가 발생했습니다.');
    return false;
  }
}

export async function onTreeEdit(item: CUtreeType, url: string, data: any){
  try {
    const result = await patchAPI({
      type: 'baseinfo',
      utype: 'tenant/',
      url: url,
      jsx: 'jsxcrud',
    },
    item.id ?? "",
    data
    );
    if(result.resultCode != 'OK_0000') {
      console.error('error', '수정 실패', '수정중 오류가 발생했습니다.');
      return false;
    }
    console.log('success', '수정 성공', '수정가 완료되었습니다.');
    return true;
  }
  catch(e){
    console.error('error', '수정 실패', '수정중 오류가 발생했습니다.');
    return false;
  }
}

export async function onTreeDelete(item: {type: string, id: string}, url: string){
  try {
    const result = await deleteAPI({
      type: 'baseinfo',
      utype: 'tenant/',
      url: url,
      jsx: 'jsxcrud',
    },
    item.id ?? "",
    );
    if(result.resultCode != 'OK_0000') {
      console.error('error', '삭제 실패', '삭제중 오류가 발생했습니다.');
      return false;
    }
    console.log('success', '삭제 성공', '삭제가 완료되었습니다.');
    return true;
  }
  catch(e){
    console.error('error', '삭제 실패', '삭제중 오류가 발생했습니다.');
    return false;
  }
}

// 트리에서 아직 실제 저장하기 전에 데이터를 생성했다가 바로 수정, 삭제했을때 사용되는 함수
export function updateTreeDatas (
  addList: CUtreeType[],
  editList: CUtreeType[],
  deleteList: {type: string, id: string}[]
) {
  // 1. deleteList에 있는 id 값을 addList, editList에서 모두 제거
  const filteredAddList = addList.filter(
    (addItem) => !deleteList.some((deleteItem) => deleteItem.id === addItem.id)
  );
  const filteredEditList = editList.filter(
    (editItem) => !deleteList.some((deleteItem) => deleteItem.id === editItem.id)
  );
  console.log("!!!!!!!!!!!!!!", filteredAddList)
  // 2. editList에 있는 항목 중 addList와 id가 일치하는 항목을 찾아서 addList의 label을 덮어쓰고,
  // 해당 항목은 editList에서 제거
  const updatedAddList = filteredAddList.map((addItem) => {
    const editItem = filteredEditList.find((editItem) => editItem.id === addItem.id);
    if (editItem) {
      // id가 일치하면 addList의 label을 editItem의 label로 덮어쓴다
      return { ...addItem, label: editItem.label };
    }
    return addItem; // 일치하지 않으면 그대로 반환
  });

  // updatedAddList에서 덮어쓴 항목은 editList에서 삭제
  const finalEditList = filteredEditList.filter(
    (editItem) => !updatedAddList.some((addItem) => addItem.id === editItem.id)
  );

  // 3. deleteList는 실제 id만 삭제하므로 temp로 시작하는 id는 제거
  const updatedDeleteList = deleteList.filter((deleteItem) => !deleteItem.id.includes("temp"));
  
  // 새로운 addList, editList, deleteList 반환
  return {
    updatedAddList,
    finalEditList,
    updatedDeleteList
  };
};