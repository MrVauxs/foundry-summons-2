/* eslint-disable no-console */
import { settings } from "./module/settings.svelte";
import { pick } from "./module/SummonFunc";
import { SummonMenu } from "./module/SummonMenu";
import "./styles/main.css";
import "./app.css";
import "./module/socket";

window.foundrySummons = {
	pick,
	SummonMenu,
	settings,
};

if (import.meta.hot) {
	import.meta.hot.accept(["./module/SummonFunc", "./module/SummonMenu"], async ([summonFunc, summonMenu]) => {
		if (summonFunc?.pick) {
			console.log("HMR pick function");
			window.foundrySummons.pick = summonFunc.pick;
		}
		if (summonMenu?.SummonMenu) {
			console.log("HMR SummonMenu class");
			window.foundrySummons.SummonMenu = summonMenu.summon;
		}
	});
}
