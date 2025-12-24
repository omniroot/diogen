import {
	Button,
	Link as ChakraLink,
	HStack,
	Image,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useDebounceValue } from "@siberiacancode/reactuse";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { refetcher } from "@/api/api.ts";
import { usePosts } from "@/api/apis/posts.api.tsx";
// import { useGetPosts } from "@/api/appwrite.tsx";
// import { useGetPosts } from "@/api/utils.ts";
// import { tablesDB, useGetPosts } from "@/api/appwrite.ts";

export const Route = createFileRoute("/posts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounceValue(search, 600);
	const { posts, createPost } = usePosts({
		$limit: 1,
		$select: ["title"],
		$or: [
			{
				title: { contains: debouncedSearch },
			},
			{
				description: { contains: debouncedSearch },
			},
		],
	});

	const [searchType, setSearchType] = useState<"title" | "likes">("title");
	// const { data: posts, refetch } = useGetPosts(
	// 	searchType === "title"
	// 		? { title: debouncedSearch }
	// 		: { likes: Number(debouncedSearch) },
	// 	{ enabled: !!debouncedSearch },
	// );

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

	const onRefetchClick = () => {
		refetcher.posts.list({
			where: { description: { contains: debouncedSearch } },
			mode: "fuzzy",
		});
		// refetchQuery(
		// 	postsHooks.queryKeys.list({
		// 		$or: [
		// 			{
		// 				title: { contains: debouncedSearch },
		// 			},
		// 			{
		// 				description: { contains: debouncedSearch },
		// 			},
		// 		],
		// 	}),
		// );
		// refetch();
	};

	return (
		<>
			<Text>Posts</Text>
			<Button onClick={() => onRefetchClick()}>Refetch</Button>
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
						<VStack key={post.$id} w={"100%"} border={"2px solid outline"} asChild>
							<ChakraLink asChild>
								<Link
									to="/posts/$id"
									params={{
										id: post.$id,
									}}
								>
									<Image src={post.poster || ""} w={"250px"} h={"120px"} />
									<Text>{post.title}</Text>
									<Text>{post.description}</Text>
								</Link>
							</ChakraLink>
							{/* <Badge bg={"primary"}>{post.likes} likes</Badge> */}
						</VStack>
					);
				})}
			</VStack>
		</>
	);
}
