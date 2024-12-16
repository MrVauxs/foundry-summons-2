/* eslint-env node */
import { existsSync, mkdir, writeFileSync } from 'node:fs';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { terserConfig } from '@typhonjs-fvtt/runtime/rollup';
import autoprefixer from 'autoprefixer';
import minify from 'postcss-minify';
import { sveltePreprocess } from 'svelte-preprocess';
import tailwindcss from 'tailwindcss';
import nesting from 'tailwindcss/nesting';
import { defineConfig } from 'vite';
import moduleJSON from './module.json' with { type: 'json' };
import PrefixWrap from 'postcss-prefixwrap';

const s_PACKAGE_ID = `modules/${moduleJSON.id}`;
const s_SVELTE_HASH_ID = 'fsum';

export default defineConfig(({ mode }) => {
	const compilerOptions = mode === 'production'
		? { cssHash: ({ hash, css }) => `svelte-${s_SVELTE_HASH_ID}-${hash(css)}` }
		: {};

	return {
		root: 'src/', // Source location / esbuild root.
		base: `/${s_PACKAGE_ID}/dist`, // Base module path that 30001 / served dev directory.
		publicDir: false, // No public resources to copy.
		cacheDir: '../.vite-cache', // Relative from root directory.

		resolve: {
			conditions: ['browser', 'import'],
		},

		esbuild: {
			target: ['es2022'],
		},

		css: {
			postcss: {
				inject: false,
				sourceMap: true,
				plugins: [
					nesting,
					tailwindcss,
					autoprefixer,
					PrefixWrap('.fsum', { ignoredSelectors: ['.fsum'] }),
					minify,
				],
			},
		},

		server: {
			port: 30001,
			open: '/game',
			proxy: {
				// Serves static files from main Foundry server.
				[`^(/${s_PACKAGE_ID}/(assets|lang|packs|dist/${moduleJSON.id}.css))`]: 'http://localhost:30000',

				// All other paths besides package ID path are served from main Foundry server.
				[`^(?!/${s_PACKAGE_ID}/)`]: 'http://localhost:30000',

				// Rewrite incoming `module-id.js` request from Foundry to the dev server `index.ts`.
				[`/${s_PACKAGE_ID}/dist/${moduleJSON.id}.js`]: {
					target: `http://localhost:30001/${s_PACKAGE_ID}/dist`,
					rewrite: () => '/index.ts',
				},

				// Enable socket.io from main Foundry server.
				'/socket.io': { target: 'ws://localhost:30000', ws: true },
			},
		},
		build: {
			outDir: '../dist',
			emptyOutDir: false,
			sourcemap: true,
			brotliSize: true,
			minify: 'terser',
			target: ['es2022'],
			terserOptions: { ...terserConfig(), ecma: 2022 },
			lib: {
				entry: './index.ts',
				formats: ['es'],
				fileName: moduleJSON.id,
			},
			rollupOptions: {
				output: {
					// Rewrite the default style.css to a more recognizable file name.
					assetFileNames: assetInfo =>
						assetInfo.name === 'style.css' ? `${moduleJSON.id}.css` : assetInfo.name as string,
				},
			},
		},

		// Necessary when using the dev server for top-level await usage inside TRL.
		optimizeDeps: {
			esbuildOptions: {
				target: 'es2022',
			},
		},

		plugins: [
			svelte({
				compilerOptions,
				preprocess: sveltePreprocess(),
			}),
			{
				// A plugin to create dist/ files to make Foundry not complaing about missing files
				// Without it, you and any contributor would have to run the build command first.
				name: 'create-dist-files',
				apply: 'serve',
				buildStart() {
					if (!existsSync('dist')) {
						mkdir('dist', (err) => {
							if (err) throw err;
						});
					}

					const files = [...moduleJSON.esmodules, ...moduleJSON.styles];
					for (const name of files) {
						writeFileSync(name, '', { flag: 'a' });
					}
				},
			},
		],
	};
});
