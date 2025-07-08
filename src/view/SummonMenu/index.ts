import { SvelteShadowApplicationMixin } from "$lib/SvelteShadowMixin.svelte";
import Root from "./app.svelte";

export class SummonMenu extends SvelteShadowApplicationMixin(foundry.applications.api.ApplicationV2) {
	elementId = "test-app";

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

	protected override root = Root;
}
