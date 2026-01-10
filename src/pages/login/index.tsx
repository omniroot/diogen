import { Button, Input } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { account, appwriteClient } from "@/api/appwrite";

export const Route = createFileRoute("/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onLoginClick = () => {
		account.createEmailPasswordSession({ email, password });
		// refetcher(["get", "session"]);
		// account.createOAuth2Session({
		//       provider: OAuthProvider.Github,
		//       success: "http://localhost:5173/", // redirect here on success
		//       // failure: "http://localhost:5173/", // redirect here on failure
		//       scopes: ["repo", "user"], // scopes (optional)
		//     });
	};
	const onDevApiKeyLoginClick = () => {
		appwriteClient.setDevKey(
			"0b8bf0cd4a4bfeb8c412cc100a05d0149d9e23975eb83818c228c0ba704e87ffcfc3b20830bdb9a04aedbeb73544e075e947167864b066f450c15c636dfa7d1ea22038ed834af908048a22fdd442581814b8088497c98dbe1d3c057959ef349dc6eccb3110418ea4a5c12547e72d64c03b6d7abfdc97e9b7806fe082ce258b78",
		);
	};

	return (
		<>
			<Input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
			/>
			<Input
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				type="password"
			/>
			<Button onClick={onLoginClick}>Login</Button>
			<Button variant={"ghost"} onClick={onDevApiKeyLoginClick}>
				Login with dev api key
			</Button>
		</>
	);
}
