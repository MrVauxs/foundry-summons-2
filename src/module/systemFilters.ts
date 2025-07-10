import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";

export const systemFilters = {
	pf2e: (actor: CompendiumIndexData) => actor.type === "npc",
};
