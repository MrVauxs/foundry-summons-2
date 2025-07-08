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
	}
}
