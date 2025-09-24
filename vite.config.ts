// import react from "@vitejs/plugin-react-swc";
import react from "@vitejs/plugin-react";

import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
// import analyzer from "vite-bundle-analyzer";
import compression from "vite-plugin-compression";
import unfonts from "unplugin-fonts/vite";
// import lazy_all from "./lazy_all.ts";
import lazy_input from "./lazy_input.ts";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"~": path.resolve(__dirname),
		},
	},
	esbuild: {
		drop: ["debugger"],
	},
	build: {
		cssMinify: "lightningcss",
		minify: "esbuild",
		target: "es2017",

		rollupOptions: {
			treeshake: "smallest",
			output: {
				manualChunks: {
					react: ["react", "react-dom"],
					chakra: ["@chakra-ui/react", "@emotion/react", "@tabler/icons-react"],
					dnd: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/modifiers"],
				},
			},
		},
	},
	plugins: [
		tsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		unfonts({
			google: {
				families: [
					{
						name: "Inter",
						styles: "wght@400;600;700",
					},
				],
			},
		}),
		lazy_input(["Sidebar"]),
		// lazy_all(),
		// analyzer({ openAnalyzer: false, }),
		compression({ algorithm: "brotliCompress" }),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler", {}]],
			},
		}),
	],
});
