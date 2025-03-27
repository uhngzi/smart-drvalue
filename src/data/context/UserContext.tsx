import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { loginCheck } from "@/utils/signUtil";

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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [login, setLogin] = useState<boolean>(false);

  useEffect(()=>{
    // 로그인 안 했을 경우 로그인 페이지로 이동
    if(typeof window !== 'undefined' && !loginCheck()) {
      setLogin(false);
    } else {
      setLogin(true);
    }
  });


  const [me, setMe] = useState<User | null>(null);
  const [meLoading, setMeLoading] = useState<boolean>(true);

  const { refetch } = useQuery<apiAuthResponseType, Error>({
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
    enabled: login
  });

  return (
    <UserContext.Provider value={{ me, refetchUser: refetch, meLoading }}>
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
