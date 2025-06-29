import { createQuery } from "react-query-kit";
import { supabase } from "@/api/supabase";

export const useGetUser = createQuery({
	queryKey: ["get-user"],
	fetcher: async () => {
		const { data } = await supabase.auth.getUser();
		return data.user;
	},
});
