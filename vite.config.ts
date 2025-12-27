import path from "node:path";
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import viteBundleAnalyzer from "vite-bundle-analyzer";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		viteBundleAnalyzer({ summary: true, analyzerMode: "json" }),
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
	css: {
		postcss: {
			plugins: [
				purgeCSSPlugin({
					content: ["./**/*.html", "./src/**/*.tsx", "./src/**/*.jsx"],
					defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
				}),
			],
		},
	},
	build: {
		rollupOptions: {
			treeshake: { preset: "smallest" },
			output: {
				// manualChunks: (id) => {
				// 	if (id.includes("node_modules")) {
				// 		if (id.includes("chakra")) return "chakra-vendor";
				// 		if (id.includes("@tanstack")) return "tanstack-vendor";
				// 		if (id.includes("appwrite")) return "appwrite-vendor";
				// 		return "vendor";
				// 	}
				// },
				manualChunks: {
					"chakra-core": ["@chakra-ui/react", "@emotion/react"],
					"tiptap-core": ["@tiptap/core"],
					"tiptap-extensions": [
						"@tiptap/starter-kit",
						// "@tiptap/extension-*", // Все расширения отдельно
					],
					"tabler-icons": ["@tabler/icons-react"],
					"tanstack-core": ["@tanstack/react-query", "@tanstack/react-router"],
					editor: ["react-calendar", "marked", "turndown"],
					utils: ["dayjs", "lodash.throttle", "magic-string"],
					appwrite: ["appwrite"],
					zustand: ["zustand"],
					"react-vendor": ["react", "react-dom"],
				},

				entryFileNames: "assets/[name]-[hash].js",
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash].[ext]",
				experimentalMinChunkSize: 10000,
			},
		},
		target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
		minify: "esbuild",
		cssMinify: "lightningcss",
	},
	esbuild: {
		drop: ["debugger"],
	},
	optimizeDeps: {
		include: [
			"react",
			"react-dom",
			"@tanstack/react-query",
			"@chakra-ui/react",
			"@tabler/icons-react",
		],
		exclude: ["@tiptap/*", "react-calendar", "@biomejs/biome"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"~": path.resolve(__dirname),
		},
	},
});
