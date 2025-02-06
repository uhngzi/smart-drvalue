import { getAPI } from "@/api/get";
import { apiGetResponseType } from "@/data/type/apiResponse";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const userData = () => {
  const [ me, setMe ] = useState<{
    id:string;
    userId: string;
    userName: string;
    status: string;
  } | null>(null);
  const { data:queryData, refetch } = useQuery<
    apiGetResponseType, Error
  >({
    queryKey: ['me'],
    queryFn: async () => {
      const result = await getAPI({
        type: 'auth',
        url: 'me/tenant'
      });

      if (result.resultCode === 'OK_0000') {
        setMe(result.data.data);
      } else {
        console.log('error:', result.response);
      }
      console.log(result.data);
      return result;
    },
  });

  return { me };
}

export default userData;