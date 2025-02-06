import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  userId: string;
  userName: string;
  status: string;
}

interface UserContextType {
  me: User | null;
  refetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [me, setMe] = useState<User | null>(null);

  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const result = await getAPI({ type: "auth", url: "me/tenant" });
      if (result.resultCode === "OK_0000") {
        setMe(result.data);
        console.log(result.data);
      } else {
        console.log("error:", result.response);
      }
      return result;
    },
  });

  useEffect(()=>{console.log(me)},[me]);

  return (
    <UserContext.Provider value={{ me, refetchUser: refetch }}>
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
