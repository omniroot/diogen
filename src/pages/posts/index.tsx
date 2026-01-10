import { Separator, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
// import { useGetPosts } from "@/api/appwrite.tsx";
// import { useGetPosts } from "@/api/utils.ts";
// import { tablesDB, useGetPosts } from "@/api/appwrite.ts";

export const Route = createFileRoute("/posts/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const [search] = useState("");
	// const debouncedSearch = useDebounceValue(search, 600);
	// const { posts } = usePosts({
	// 	$limit: 1,
	// 	$or: [
	// 		{
	// 			title: { contains: debouncedSearch },
	// 		},
	// 		{
	// 			author_id: { contains: debouncedSearch },
	// 		},
	// 	],
	// });

	// const onRefetchClick = () => {
	// 	refetcher.posts.list();
	// };

	return (
		<>
			<Text fontSize={"2xl"} fontWeight={"bold"}>
				Posts
			</Text>
			<Text fontSize={"lg"}>Posts, news and changelog</Text>
			<Separator h={"3"} size={"md"} />

			<VStack gap={2} alignItems={"start"}>
				{/* {posts?.map((post) => {
					return (
						<VStack
							key={post.$id}
							w={"350px"}
							// h={"250px"}
							border={`2px solid {colors.outline_variant}`}
							alignItems={"start"}
							p={4}
							borderRadius={"md"}
							bg={{ _hover: "surface_container_high" }}
							transition={"backgrounds"}
							asChild
						>
							<ChakraLink asChild textDecoration={"none"}>
								<Link
									to="/posts/$id"
									params={{
										id: post.$id,
									}}
								>
									<Image
										src={post.banner_url || ""}
										w={"100%"}
										h={"180px"}
										borderRadius={"md"}
									/>
									<HStack w={"100%"} justifyContent={"space-between"}>
										<Text fontSize={"lg"} fontWeight={"bold"}>
											{post.title}
										</Text>
									</HStack>
									<HStack w={"100%"} justifyContent={"space-between"}>
										<Text>{post.author_id?.slice(0, 8)}</Text>
										<Badge
											size={"lg"}
											bg={"blue.300"}
											color={"black"}
											variant={"outline"}
										>
											{ddate.getDate(post.$createdAt)}
										</Badge>
									</HStack>
								</Link>
							</ChakraLink>
						</VStack>
					);
				})} */}
			</VStack>
		</>
	);
}
