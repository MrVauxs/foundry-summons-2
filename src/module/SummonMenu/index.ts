import type { SvelteApplicationRenderContext } from "$lib/SvelteMixin.svelte";
import type { ApplicationConfiguration } from "foundry-pf2e/foundry/client/applications/_types.mjs";
import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";
import { SvelteApplicationMixin } from "$lib/SvelteMixin.svelte";
import Root from "./app.svelte";

interface summonOptions {
	/** Creates a checkmark input filter */
	toggles?: {
		/** Unique ID across all types of filters */
		id: string;
		/** Display name for the filter */
		name: string;
		/** On hover tooltip description */
		description?: string;
		/** The .filter() function */
		func: (actor: CompendiumIndexData, input: boolean) => boolean;
		/**
		 * What fields to index when pulling actors. Follows basic dot notation such as `system.details.level.value`.
		 */
		indexedFields?: string[];
	}[];

	/** Creates a text input filter */
	searches?: {
		/** Unique ID across all types of filters */
		id: string;
		/** Display name for the filter */
		name: string;
		/** On hover tooltip description */
		description?: string;
		/** The .filter() function */
		func: (actor: CompendiumIndexData, input: boolean) => boolean;
		/**
		 * What fields to index when pulling actors. Follows basic dot notation such as `system.details.level.value`.
		 */
		indexedFields?: string[];
		/** Placeholder text inside the text input */
		placeholder?: string;
	}[];

	/** Creates a dropdown select filter */
	dropdowns?: {
		/** Unique ID across all types of filters */
		id: string;
		/** Display name for the filter */
		name: string;
		/** On hover tooltip description */
		description?: string;
		/** The .filter() function */
		func: (actor: CompendiumIndexData, input: boolean) => boolean;
		/**
		 * What fields to index when pulling actors. Follows basic dot notation such as `system.details.level.value`.
		 */
		indexedFields?: string[];
		/** The options to put inside the select dropdown and their respective values. */
		options: { label: string; value: any }[];
	}[];

	/**
	 * Which compendium packs to draw sources from.
	 * @example ["pf2e.pathfinder-npc-core"]
	 */
	packs?: string[];

	/**
	 * Close the menu once summoning begins.
	 * @default true
	*/
	once?: boolean;
}

export interface SummonMenuContext extends SvelteApplicationRenderContext {
	data: SummonMenuState;
}

interface SummonMenuState {
	options: summonOptions;
}

export class SummonMenu extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
	static override DEFAULT_OPTIONS = {
		position: {
			width: 650,
			height: 500,
		},
		window: {
			icon: "fa-solid fa-wand",
			title: "Foundry Summons",
			resizable: true,
		},
	};

	static start(options: summonOptions) {
		return new SummonMenu({ summonOptions: options }).render({ force: true });
	}

	summonOptions: summonOptions;

	constructor(options: DeepPartial<ApplicationConfiguration> & { summonOptions?: summonOptions }) {
		super(options);
		this.summonOptions = options?.summonOptions || {};
		this.summonOptions.packs ??= game.packs.contents.filter(x => x.metadata.type === "Actor").map(x => x.metadata.id);
		this.summonOptions.once ??= true;
	}

	protected override async _prepareContext(): Promise<SummonMenuContext> {
		return {
			foundryApp: this,
			data: {
				options: this.summonOptions,
			},
		};
	}

	protected override root = Root;
}

if (import.meta.hot) {
	import.meta.hot.accept(async (newModule) => {
		if (!newModule) return;

		const reopenedDocuments: SummonMenu[] = [];

		for (const [_id, docClass] of foundry.applications.instances) {
			if (docClass.constructor.name === SummonMenu.name) {
				await docClass.close();
				reopenedDocuments.push(docClass as SummonMenu);
			};
		}

		for (const doc of reopenedDocuments) {
			new newModule.SummonMenu(doc.options).render({ force: true });
		}
	});
}
