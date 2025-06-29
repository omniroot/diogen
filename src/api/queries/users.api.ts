import { supabase } from "@/api/supabase";
import { createQuery } from "react-query-kit";

export const useGetUser = createQuery({
  queryKey: ["get-user"],
  fetcher: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
});
