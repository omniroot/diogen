// @ts-nocheck
import { Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
// import { usePosts } from "@/features/posts/controllers/usePosts.tsx";

export const Route = createFileRoute("/posts/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { id } = Route.useParams();

	// const { useOne, updatePost } = usePosts({});

	// const { data: post } = useOne({ $id: id });

	// const [content, setContent] = useState(post?.content || "Default text");

	// const [width] = useState("710px");

	// const onUpdateClick = () => {
	// 	updatePost({ $id: post?.$id, content: content });
	// };

	return <Text>post page</Text>;
}

// <VStack alignItems={"center"}>
// 	<Image w={width} h={"320px"} src={post?.banner_url || ""} borderRadius={"md"} />
// 	<VStack w={width} alignItems={"start"}>
// 		<HStack w={"100%"} justifyContent={"space-between"}>
// 			<Text fontSize={"3xl"} fontWeight={"bold"}>
// 				{post?.title}
// 			</Text>
// 			<Button variant={"primary"} onClick={onUpdateClick}>
// 				Update
// 			</Button>
// 		</HStack>

/* <div style={{ display: "flex", gap: 8 }}>
			<Button onClick={() => setWhich("tiptap")}>TipTap</Button>
			<Button onClick={() => setWhich("slate")}>Slate</Button>
		</div> */

// <HStack w={"100%"} p={0}>
// 	{post?.content && (
// 		<TextEditor
// 			initialContent={post?.content}
// 			onChange={(html) => setContent(html)}
// 		/>
// 	)}
// </HStack>

/* <HStack w={"100%"}>
			{post?.content && <TextEditor initialContent={post?.content} />}
		</HStack> */

/* {post?.content && <TextEditor   />} */

/* <Text fontSize={"md"}>{post?.content}</Text> */

// 	</VStack>
// </VStack>
