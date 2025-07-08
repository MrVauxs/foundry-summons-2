import { sveltePreprocess } from "svelte-preprocess";
import moduleJSON from "./module.json" with { type: "json" };

export default {
	compilerOptions: {
		customElement: true,
		cssHash: ({ hash, css }) => `svelte-${moduleJSON.flags.css.shorthand}-${hash(css)}`,
	},
	preprocess: sveltePreprocess(),
};
