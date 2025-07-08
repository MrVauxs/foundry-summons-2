import { SummonMenu } from "./SummonMenu";

Hooks.on("ready", () => {
	new SummonMenu({}).render({ force: true });
});
