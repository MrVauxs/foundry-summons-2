import type { ActorPF2e, TokenDocumentPF2e } from "foundry-pf2e";
import type { SummonMenu } from "./module/SummonMenu";

declare module "vite/types/customEvent.d.ts" {
	interface CustomEventMap {
		"foundryvtt-compendium-sync:vtt-update": { json: any; dir: string; once: boolean };
		"foundryvtt-compendium-sync:vtt-delete": { id: string; dir: string };
		// 'event-key': payload
	}
}

// Add window.foundrySync to the global scope
declare global {
	interface Window {
		foundrySync: Record<string, () => void>;
		foundrySummons: {
			SummonMenu: typeof SummonMenu;
			pick: (actor: ActorPF2e) => Promise<TokenDocumentPF2e>;
		};
	}
}
