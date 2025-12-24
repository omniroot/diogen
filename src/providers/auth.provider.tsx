import type { ReactNode } from "react";

interface Props {
	children?: ReactNode;
}
export const AuthProvider: React.FC<Props> = ({ children }) => {
	// const { data: session } = useQuery({
	// 	queryKey: ["get", "session"],
	// 	queryFn: () => {
	// 		return account.get();
	// 	},
	// });

	return (
		<>
			{/* <Box>user: {session?.email}</Box> */}
			{children}
		</>
	);
};
