import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const THEME_CHECK_FILE = "./src/theme/index.ts";

function build() {
	if (existsSync(THEME_CHECK_FILE)) {
		console.log("Theme already exist, typegen types");
		execSync("bun run typegen:chakra", { stdio: "inherit" });
	} else {
		try {
			execSync("git submodule sync --recursive", { stdio: "inherit" });
			execSync("git submodule update --init --recursive", { stdio: "inherit" });
			execSync("bun run typegen:chakra", { stdio: "inherit" });
			console.log("OMNIKIT synced");
		} catch (error) {
			console.error("OMNIKIT sync error:", (error as Error).message);
			process.exit(1);
		}
	}

	try {
		execSync("tsc -b", { stdio: "inherit" });
		execSync("vite build", { stdio: "inherit" });
	} catch (error) {
		console.error("BUILD error:", (error as Error).message);
		process.exit(1);
	}
}

build();
