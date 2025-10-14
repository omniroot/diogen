// import { supabase } from "@/api/supabase.ts";
// import { useQuery } from "@tanstack/react-query";
// import { createQuery } from "react-query-kit";

// export const useGetUser = createQuery({
// 	queryKey: ["old-get-user"],
// 	fetcher: async () => {
// 		const { data } = await supabase.auth.getUser();
// 		return data.user;
// 	},
// });

// // interface IUseUser {
// //   id?: number;
// // }

// export const useUser = () => {
// 	return useQuery({
// 		queryKey: ["get-user"],
// 		queryFn: async () => {
// 			const { data } = await supabase.auth.getUser();
// 			return data.user;
// 		},
// 	});
// };
