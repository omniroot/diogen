import { Badge, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useDebounceState, useDebounceValue } from "@siberiacancode/reactuse";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGetPosts } from "@/api/appwrite.tsx";
// import { useGetPosts } from "@/api/utils.ts";
// import { tablesDB, useGetPosts } from "@/api/appwrite.ts";

export const Route = createFileRoute("/posts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounceValue(search, 600);

	const [searchType, setSearchType] = useState<"title" | "likes">("title");
	const { data: posts, refetch } = useGetPosts(
		searchType === "title"
			? { title: debouncedSearch }
			: { likes: Number(debouncedSearch) },
		{ enabled: !!debouncedSearch },
	);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const { rows, total } = await tablesDB.listRows({
	//
	//       queries:[""]
	// 		});

	// 		console.log("@@@ Rows", { rows, total });
	// 	};
	// 	fetchData();
	// }, []);
	// console.log();

	return (
		<>
			<Text>Posts</Text>
			<Button onClick={() => refetch()}>Refetch</Button>
			<Input value={search} onChange={(e) => setSearch(e.target.value)} />
			<HStack>
				<Text>Search type:</Text>
				<Button
					variant={searchType === "title" ? "primary" : "outline"}
					onClick={() => setSearchType("title")}
				>
					Title
				</Button>
				<Button
					variant={searchType === "likes" ? "primary" : "outline"}
					onClick={() => setSearchType("likes")}
				>
					Likes
				</Button>
			</HStack>
			<VStack gap={2} alignItems={"start"}>
				{posts?.map((post) => {
					return (
						<HStack key={post.$id} w={"100%"}>
							<Badge bg={"primary"}>{post.likes} likes</Badge>
							<Text>{post.title}</Text>
						</HStack>
					);
				})}
			</VStack>
		</>
	);
}
