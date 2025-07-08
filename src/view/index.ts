import { SummonMenu } from "./SummonMenu";

window.foundrySummons = SummonMenu;

Hooks.on("ready", () => {
	new SummonMenu().render({ force: true });
});
