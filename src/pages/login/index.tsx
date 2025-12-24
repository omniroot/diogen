import { Button, Input } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { refetchQuery } from "@/api/api.ts";
import { account } from "@/api/appwrite.tsx";

export const Route = createFileRoute("/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onLoginClick = () => {
		account.createEmailPasswordSession({ email, password });
		refetchQuery(["get", "session"]);
		// account.createOAuth2Session({
		//       provider: OAuthProvider.Github,
		//       success: "http://localhost:5173/", // redirect here on success
		//       // failure: "http://localhost:5173/", // redirect here on failure
		//       scopes: ["repo", "user"], // scopes (optional)
		//     });
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
		</>
	);
}
