import { useQuery } from "@tanstack/react-query";
import { account } from "@/api/appwrite.ts";
import { useGetUsers } from "@/features/users/api/users.api.ts";

export function useAuth() {
	// const [appwriteUser, setAppwriteUser] = useState<Models.User>();
	const { data: appwriteUser } = useQuery({
		queryKey: ["appwrite", "user"],
		queryFn: () => {
			return account.get();
		},
	});
	const { data: users, isLoading } = useGetUsers(
		{ user_id: { equal: appwriteUser?.$id } },
		{ enabled: !!appwriteUser?.$id },
	);

	return { user: users?.[0], isLoading };
}
