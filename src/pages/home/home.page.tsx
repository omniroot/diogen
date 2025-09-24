import { Link } from "@tanstack/react-router";

export const HomePage = () => {
	return (
		<div>
			home page
			<Link to="/test">Test page</Link>
		</div>
	);
};
