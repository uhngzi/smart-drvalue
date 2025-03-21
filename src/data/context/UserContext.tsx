import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";

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
  const [me, setMe] = useState<User | null>(null);
  const [meLoading, setMeLoading] = useState<boolean>(true);

  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["me"],
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
