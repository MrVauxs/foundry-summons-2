import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";

interface Content {
	indexedFields?: string[];
	filter?: (a: CompendiumIndexData) => boolean;
}

export const systemConstants: Record<string, Content> = {
	pf2e: {
		indexedFields: ["system.details.level.value"],
		filter: (actor: CompendiumIndexData) => actor.type === "npc",
	},
};
