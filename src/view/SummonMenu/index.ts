import type { SvelteApplicationRenderContext } from "$lib/SvelteMixin.svelte";
import type { ApplicationConfiguration } from "foundry-pf2e/foundry/client/applications/_types.mjs";
import { SvelteApplicationMixin } from "$lib/SvelteMixin.svelte";
import Root from "./app.svelte";

interface summonOptions {
	example?: string;
}

interface SummonMenuContext extends SvelteApplicationRenderContext {
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

	summonOptions: summonOptions;

	constructor(options: DeepPartial<ApplicationConfiguration> & { summonOptions?: summonOptions }) {
		super(options);
		this.summonOptions = options?.summonOptions || {};
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

// @ts-expect-error Ignore
window.foundrySummons = SummonMenu;

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
