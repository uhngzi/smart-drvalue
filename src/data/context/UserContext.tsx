import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { loginCheck } from "@/utils/signUtil";
import { MyMemoType } from "@/contents/footerBtn/MyMemo";
import { UserType } from "../type/auth/user";
import { patchAPI } from "@/api/patch";

export interface User {
  id: string;
  userId: string;
  userName: string;
  status: string;
}

interface UserContextType {
  me: User | null;
  meLoading: boolean;
  refetchUser: () => void;
  myMemo: MyMemoType[];
  myMemoLoading: boolean;
  refetchMyMemo: () => void;
  user: UserType | null;
  userRefetch: () => void;
  handleSubmitBookmark: (label: string, url: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [login, setLogin] = useState<boolean>(false);

  useEffect(() => {
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if (typeof window !== "undefined" && !loginCheck()) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  });

  // ------------- 내 정보 세팅 -------------- 시작
  const [me, setMe] = useState<User | null>(null);
  const [meLoading, setMeLoading] = useState<boolean>(true);

  const { refetch: refetchUser } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["me", login],
    queryFn: async () => {
      setMeLoading(true);
      const result = await getAPI({ type: "auth", url: "me/tenant" });
      if (result.resultCode === "OK_0000") {
        setMe(result.data);
        setMeLoading(false);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login,
  });
  // ------------- 내 정보 세팅 -------------- 끝

  // ------ 나의 메모, 자주 쓰는 문구 세팅 ------- 시작
  const [myMemo, setMyMemo] = useState<MyMemoType[]>([]);
  const [myMemoLoading, setMyMemoLoading] = useState<boolean>(true);
  const { refetch: refetchMyMemo } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["myMemo", login],
    queryFn: async () => {
      setMyMemoLoading(true);
      const result = await getAPI(
        {
          type: "core-d3",
          utype: "tenant/",
          url: "personal-memo/jsxcrud/me",
        },
        {
          sort: "orderNo,ASC",
        }
      );
      if (result.resultCode === "OK_0000") {
        setMyMemo(result.data.data);
        setMyMemoLoading(false);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
    enabled: login,
  });
  // ------ 나의 메모, 자주 쓰는 문구 세팅 ------- 끝

  // ----------- 즐겨찾는 메뉴 세팅 ------------ 시작
  const [user, setUser] = useState<UserType | null>(null);
  const { refetch: userRefetch } = useQuery({
    queryKey: ["user/jsxcrud/one", me?.id],
    queryFn: async () => {
      const result = await getAPI({
        type: "auth",
        utype: "tenant/",
        url: `user/jsxcrud/one/${me?.id}`,
      });

      if (result.resultCode === "OK_0000") {
        const entity = (result.data?.data as UserType) ?? null;
        setUser(entity);
        console.log(entity.detail?.metaData);
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
    enabled: !!me?.id,
  });

  const handleSubmitBookmarkAPI = async (label: string, url: string) => {
    try {
      const result = await patchAPI(
        {
          type: "auth",
          utype: "tenant/",
          jsx: "default",
          url: "user/default/update-meta-data",
          etc: true,
        },
        me?.id ?? "",
        {
          metaData: [
            {
              bookMarkMenu: [
                ...(user?.detail?.metaData?.[0]?.bookMarkMenu ?? []).map(
                  (item: any, index: number) => ({
                    index: index + 1,
                    label: item.label,
                    url: item.url,
                  })
                ),
                {
                  index:
                    (user?.detail?.metaData?.[0]?.bookMarkMenu?.length ?? 0) +
                    1,
                  label: label,
                  url: url,
                },
              ],
            },
          ],
        }
      );

      if (result.resultCode === "OK_0000") {
        userRefetch();
      } else {
        console.log("즐겨찾기 저장 ERROR:", result.response);
      }
    } catch (error) {
      console.error("즐겨찾기 저장 실패:", error);
    }
  };

  const handleSubmitBookmark = (label: string, url: string) => {
    console.log("즐겨찾기 저장", label, url);
    handleSubmitBookmarkAPI(label, url);
  };
  // ----------- 즐겨찾는 메뉴 세팅 ------------ 끝

  return (
    <UserContext.Provider
      value={{
        me,
        refetchUser,
        meLoading,
        myMemo,
        refetchMyMemo,
        myMemoLoading,
        user,
        userRefetch,
        handleSubmitBookmark,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
