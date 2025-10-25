import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import viteBundleAnalyzer from "vite-bundle-analyzer";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		viteBundleAnalyzer({}),
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
		compression({ algorithm: "brotliCompress" }),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./src/pages/",
			generatedRouteTree: "./.tanstack/routeTree.gen.ts",
		}),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"~": path.resolve(__dirname),
		},
	},
});
