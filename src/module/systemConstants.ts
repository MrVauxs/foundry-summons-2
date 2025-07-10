import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";

interface Content {
	indexedFields?: string[];
	filter?: (a: CompendiumIndexData) => boolean;
	sort?: (a: CompendiumIndexData, b: CompendiumIndexData) => number;
}

export const systemConstants: Record<string, Content> = {
	pf2e: {
		indexedFields: ["system.details.level.value"],
		filter: (actor: CompendiumIndexData) => actor.type === "npc",
		sort: (a: CompendiumIndexData, b: CompendiumIndexData) => b.system.details.level.value - a.system.details.level.value,
	},
};
