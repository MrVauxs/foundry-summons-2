import { type SvelteApp, SvelteApplication } from '#runtime/svelte/application';
import BasicAppShell from './BasicAppShell.svelte';

class BasicApp extends SvelteApplication<BasicAppOptions> {
	constructor(options?: Partial<BasicAppOptions>) {
		super(options);
	}

	static get defaultOptions(): BasicAppOptions {
		return foundry.utils.mergeObject<SvelteApp.Options, Partial<BasicAppOptions>>(super.defaultOptions, {
			resizable: true,
			minimizable: true,
			width: '25%',
			top: '10%',
			left: '10%',

			id: 'foundry-summons',
			title: 'foundry-summons.title',

			svelte: {
				class: BasicAppShell,
				target: document.body,
			},

			extra: true, // Typed extra option from `BasicApp.Options` below.
		});
	}
}

export type BasicAppExternal = SvelteApp.Context.External<BasicApp>;
export interface BasicAppOptions extends SvelteApp.Options {
	/** An example of defining additional options */
	extra?: boolean;
}

export { BasicApp };
