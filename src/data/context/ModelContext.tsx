import { createContext, useContext, useEffect, useState } from "react";
import { getAPI } from "@/api/get";
import { apiAuthResponseType, apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { modelsType } from "../type/sayang/models";

interface ModelContextType {
  models: modelsType[];
  modelsLoading: boolean;
  refetchModels: () => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<modelsType[]>([]);
  const [modelsLoading, setModelsLoading] = useState<boolean>(true);

  const { refetch } = useQuery<apiAuthResponseType, Error>({
    queryKey: ["models"],
    queryFn: async () => {
      setModelsLoading(true);
      const result = await getAPI({ type: "core-d1", utype: "tenant/", url: "models/jsxcrud/many" });
      if (result.resultCode === "OK_0000") {
        setModels(result.data.data ?? []);
        setModelsLoading(false);
      } else {
        console.log("MODELS ERROR:", result.response);
      }
      return result;
    },
  });

  return (
    <ModelContext.Provider value={{ models, modelsLoading, refetchModels:refetch }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModels = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("MODELS must be used within a ModelsProvider");
  }
  return context;
};
