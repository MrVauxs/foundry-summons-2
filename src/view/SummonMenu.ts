import { type SvelteApp, SvelteApplication } from '#runtime/svelte/application';
import type { Filter } from './Components/Filter';
import SvelteShell from './SummonMenu.svelte';

// TODO: Move to another file
function getSystemBestiaries() {
	switch (game.system.id) {
		case "pf2e":
		default: {
			return game.packs.filter(x => x.metadata.type === "Actor").flatMap(x => Array.from(x.index))
		}
	}
}

class BasicApp extends SvelteApplication<BasicAppOptions> {
	constructor(options?: Partial<BasicAppOptions>) {
		super(options);
	}

	static get defaultOptions(): BasicAppOptions {
		return foundry.utils.mergeObject<SvelteApp.Options, Partial<BasicAppOptions>>(super.defaultOptions, {
			resizable: true,
			minimizable: true,

			width: '60%',
			left: '20%',

			height: '50%',
			top: '25%',

			id: 'foundry-summons',
			title: 'foundry-summons.title',
			classes: ['fsum'],

			svelte: {
				class: SvelteShell,
				target: document.body,
			},

			fsummons: {
				actors: getSystemBestiaries(),
				filters: []
			}
		});
	}
}

export type BasicAppExternal = SvelteApp.Context.External<BasicApp>;
export interface BasicAppOptions extends SvelteApp.Options {
	/** An example of defining additional options */
	fsummons?: {
		actors?: (Actor | CompendiumIndexData)[];
		filters?: Filter<any>[];
	}
}

export { BasicApp };
