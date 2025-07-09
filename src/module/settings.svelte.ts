import type { SettingRegistration } from "foundry-pf2e/foundry/client/helpers/client-settings.mjs";
import { id } from "moduleJSON";

export interface Settings {
	permission: number;
}

const settings: Settings = $state({
	permission: 2,
});

const setData: (SettingRegistration & { key: string })[] = [
	{
		key: "permission",
		name: "Minimum Permissions",
		hint: "Which permission level at which an user is trusted to not have to prompt for summoning confirmations.",
		config: true,
		default: 2,
		type: Number,
		choices: {
			1: "Player",
			2: "Trusted Player",
			3: "Assistant GM",
			4: "Game Master",
		},
		onChange: (choice) => { settings.permission = choice as number; },
	},
];

Hooks.once("init", () => {
	for (const set of setData) {
		game.settings.register(id, set.key, set);
	}

	for (const set of setData) {
		settings[set.key as keyof Settings] = game.settings.get(id, set.key) as ValueOf<Settings>;
	}
});

export { settings };
