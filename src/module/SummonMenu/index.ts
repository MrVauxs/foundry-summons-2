import type { SvelteApplicationRenderContext } from "$lib/SvelteMixin.svelte";
import type { TokenDocumentPF2e } from "foundry-pf2e";
import type { ApplicationConfiguration } from "foundry-pf2e/foundry/client/applications/_types.mjs";
import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";
import { SvelteApplicationMixin } from "$lib/SvelteMixin.svelte";
import Root from "./app.svelte";

interface summonOptions {
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

	/**
	 * Whether the "Link Actor Data" token setting is on.
	 * Useful when dealing with persistent summons that share HP across scenes.
	 * Disable when you just want to be able to copy paste the same summon. But then its better if you set "once": false instead.
	 * @default true
	 */
	actorLink?: boolean;

	/**
	 * Modification data to Pass when an actor is created. Same as .update().
	 */
	updateData?: object;

	/**
	 * Determines whether selecting a creature in the menu results in a summoning workflow or immediately exits, returning the UUID string instead in its `selection` property.
	 * @default false
	 */
	noSummon?: boolean;

	/**
	 * A default index filter that is applied no matter what.
	 * @example [PF2e] (a) => actor.type === "npc"
	 */
	filter?: (actor: CompendiumIndexData) => boolean;

	/** Creates a checkmark input filter */
	toggles?: {
		/** Unique ID across all types of filters */
		id: string;
		/** Display name for the filter */
		name: string;
		/** On hover tooltip description */
		description?: string;
		/** The default value the filter should begin with */
		default?: boolean;
		/** The .filter() function */
		func?: (actor: CompendiumIndexData, input: boolean) => boolean;
		/** The .toSorted() function */
		sort?: (a: CompendiumIndexData, b: CompendiumIndexData, input: boolean) => number;
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
		/** The default value the filter should begin with */
		default?: string;
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
		/** The default value the filter should begin with */
		default?: any;
		/** The .filter() function */
		func?: (actor: CompendiumIndexData, input: boolean) => boolean;
		/** The .toSorted() function */
		sort?: (a: CompendiumIndexData, b: CompendiumIndexData, input: boolean) => number;
		/**
		 * What fields to index when pulling actors. Follows basic dot notation such as `system.details.level.value`.
		 */
		indexedFields?: string[];
		/** The options to put inside the select dropdown and their respective values. */
		options: { label: string; value: any }[];
	}[];
}

export interface SummonMenuContext extends SvelteApplicationRenderContext {
	data: SummonMenuState;
	foundryApp: SummonMenu;
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

	static async start(options: summonOptions) {
		return new SummonMenu({ summonOptions: options }).render({ force: true }).then(app => app.selection);
	}

	summonOptions: summonOptions;
	private _selectionPromise: Promise<any> | null = null;
	private _resolveSelectionPromise: ((value: TokenDocumentPF2e | string) => void) | null = null;
	private _rejectSelectionPromise: ((reason?: any) => void) | null = null;

	constructor(options: DeepPartial<ApplicationConfiguration> & { summonOptions?: summonOptions }) {
		super(options);
		this.summonOptions = options?.summonOptions || {};
		this.summonOptions.packs ??= game.packs.contents.filter(x => x.metadata.type === "Actor").map(x => x.metadata.id);
		this.summonOptions.once ??= true;
		this.summonOptions.noSummon ??= false;
	}

	protected override async _prepareContext(): Promise<SummonMenuContext> {
		return {
			foundryApp: this,
			data: {
				options: this.summonOptions,
			},
		};
	}

	get selection(): Promise<any> {
		if (!this._selectionPromise) {
			this._selectionPromise = new Promise((resolve, reject) => {
				this._resolveSelectionPromise = resolve;
				this._rejectSelectionPromise = reject;
			});
		}
		return this._selectionPromise;
	}

	private _resetSelection() {
		this._selectionPromise = null;
		this._resolveSelectionPromise = null;
		this._rejectSelectionPromise = null;
	}

	protected override _onClose(options: fa.ApplicationClosingOptions): void;
	protected override _onClose(options: fa.ApplicationClosingOptions): void {
		super._onClose(options);
		this._cancelSelection("Closed Summon menu.");
	}

	/**
	 * Internal method to resolve the selection promise.
	 * This would be called when the popup completes its interaction (e.g., user clicks OK).
	 * @param value The value to resolve the promise with.
	 */
	_completeSelection(value: any) {
		if (this._resolveSelectionPromise) {
			this._resolveSelectionPromise(value);
			this._resetSelection();
		} else {
			console.warn("No active selection promise to resolve.");
		}
	}

	/**
	 * Internal method to reject the selection promise (e.g., if the popup is closed without selection).
	 * @param reason The reason for rejection.
	 */
	_cancelSelection(reason: any = "Selection cancelled") {
		if (this._rejectSelectionPromise) {
			this._rejectSelectionPromise(reason);
			this._resetSelection();
		} else {
			console.warn("No active selection promise to reject.");
		}
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
