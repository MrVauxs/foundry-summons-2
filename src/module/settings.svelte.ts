import type { SettingRegistration } from "foundry-pf2e/foundry/client/helpers/client-settings.mjs";
import { id } from "moduleJSON";

export interface Settings {
	permission: number;
	seeActors: boolean;
}

const settings: Settings = $state({
	permission: 2,
	seeActors: false,
});

const setData: (SettingRegistration & { key: string })[] = [
	{
		key: "permission",
		name: "Minimum Permissions",
		hint: "Which permission level at which an user is trusted to not have to prompt for summoning confirmations.",
		config: true,
		scope: "world",
		default: 2,
		type: Number,
		choices: {
			1: "Player",
			2: "Trusted Player",
			3: "Assistant GM",
			4: "Game Master",
		},
		onChange: (choice: any) => { settings.permission = choice; },
	},
	{
		key: "seeActors",
		name: "NPC Previews",
		hint: "Whether players can preview NPC statblocks when summoning a creature.",
		config: true,
		scope: "world",
		default: false,
		type: Boolean,
		onChange: (choice: any) => { settings.seeActors = choice; },
	},
];

Hooks.once("init", () => {
	for (const set of setData) {
		game.settings.register(id, set.key, set);
	}

	for (const set of setData) {
		// @ts-expect-error Never say never
		settings[set.key as keyof Settings] = game.settings.get(id, set.key);
	}
});

export { settings };
