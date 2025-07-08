import type { Plugin, UserConfig } from "vite";
import { existsSync, mkdir, writeFileSync } from "node:fs";
import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";
import vttSync from "foundryvtt-sync";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import moduleJSON from "./module.json" with { type: "json" };
import { transformEntry } from "./scripts/transformer.mjs";

// import PrefixWrap from "postcss-prefixwrap";
// import PostCSSReplace from "postcss-replace";

const modulePath = `modules/${moduleJSON.id}`;
// const cssId = moduleJSON.flags.css.id;

const entry = "index.ts";
const postcss = {
	inject: false,
	sourceMap: true,
	extensions: [".css"],
	plugins: [
		autoprefixer,
		postcssPresetEnv,
		/*
			// Tailwind Encapsulation
			PrefixWrap(`.${cssId}`, {
				ignoredSelectors: [`.${cssId}`],
				blacklist: ["globals.css"],
				nested: "&",
			}),
			// CSS Replacement (ex. styling specific Compendiums)
			PostCSSReplace({
				pattern: /\{\{\s?(\S+?)\s?\}\}/g,
				commentsOnly: false,
				data: {
					compendium: `${moduleJSON.id}.${moduleJSON.packs[0].name}`,
				},
			}),
		*/
	],
};

export default defineConfig(({ mode }) => {
	return {
		root: "src/", // Source location / esbuild root.
		base: `/${modulePath}/dist`, // Base module path that 30001 / served dev directory.
		publicDir: false, // No public resources to copy.
		cacheDir: "../.vite-cache", // Relative from root directory.

		resolve: {
			conditions: ["browser", "import"],
			alias: {
				$lib: path.resolve(__dirname, "./src/lib"),
				moduleJSON: path.resolve(__dirname, "./module.json"),
			},
		},

		esbuild: {
			target: ["es2024"],
		},

		css: { postcss },

		server: {
			port: 30001,
			open: "/join",
			proxy: {
				// Serves static files from main Foundry server.
				[`^(/${modulePath}/(assets|lang|packs))`]: "http://localhost:30000",

				// All other paths besides package ID path are served from main Foundry server.
				[`^(?!/${modulePath}/)`]: "http://localhost:30000",

				// Rewrite incoming `module-id.js` request from Foundry to the dev server `index.ts`.
				[`/${modulePath}/dist/${moduleJSON.id}.js`]: {
					target: `http://localhost:30001/${modulePath}/dist`,
					rewrite: () => `/${entry}`,
				},

				// Enable socket.io from main Foundry server.
				"/socket.io": { target: "ws://localhost:30000", ws: true },
			},
		},
		build: {
			outDir: "../dist",
			emptyOutDir: false,
			sourcemap: true,
			minify: "terser",
			target: ["es2024"],
			terserOptions: {
				compress: {
					passes: 3,
				},
				mangle: {
					toplevel: true,
					keep_classnames: true,
					keep_fnames: true,
				},
				module: true,
				ecma: 2024,
			},
			lib: {
				entry,
				formats: ["es"],
				fileName: moduleJSON.id,
			},
			rollupOptions: {
				output: {
					// Rewrite the default style.css to a more recognizable file name.
					assetFileNames: assetInfo =>
						assetInfo.name === "style.css" ? `${moduleJSON.id}.css` : assetInfo.name as string,
				},
			},
		},

		optimizeDeps: {
			esbuildOptions: {
				target: "es2024",
			},
		},

		plugins: [
			svelte({ configFile: "../svelte.config.js" }),
			tailwindcss(),
			vttSync(moduleJSON, { transformer: transformEntry }) as Plugin[],
			{
				name: "create-dist-files",
				apply: "serve",
				buildStart() {
					if (!existsSync("dist")) {
						mkdir("dist", (err) => {
							if (err) throw err;
						});
					}

					const files = [...moduleJSON.esmodules, ...moduleJSON.styles];
					for (const name of files) {
						writeFileSync(name, "", { flag: "a" });
					}
				},
			},
		],
	} satisfies UserConfig;
});
