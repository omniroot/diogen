import type { Posts } from "@/api/types/appwrite.d.ts";

interface Props {
	post: Posts;
}
export const PostItem: React.FC<Props> = ({ post }) => {
	return <>{post.$id}</>;
};
