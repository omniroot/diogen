import { useQuery } from "@tanstack/react-query";
import { account } from "@/api/appwrite.ts";
import { useGetUsers } from "@/features/users/api/users.api.ts";

export function useAuth() {
	// const [appwriteUser, setAppwriteUser] = useState<Models.User>();
	const {
		data: appwriteUser,
		isLoading,
		refetch: refetchAppwriteUser,
	} = useQuery({
		queryKey: ["appwrite", "user"],
		queryFn: () => {
			try {
				const result = account.get();
				console.log({ result });

				return result;
			} catch {
				throw new Error("User not found");
			}

			// if (!result)
		},
	});
	const { data: users } = useGetUsers(
		{ user_id: { equal: appwriteUser?.$id } },
		{ enabled: !!appwriteUser?.$id },
	);

	const refetch = () => {
		refetchAppwriteUser();
	};

	return { user: users?.[0], isLoading, refetch };
}
