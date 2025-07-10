/* eslint-disable no-console */
import { settings } from "./module/settings.svelte";
import { pick } from "./module/SummonFunc";
import { SummonMenu } from "./module/SummonMenu";
import { systemFilters } from "./module/systemFilters";
import "./styles/main.css";
import "./app.css";
import "./module/socket";

window.foundrySummons = {
	pick,
	SummonMenu,
	settings,
	systemFilters,
};

if (import.meta.hot) {
	import.meta.hot.accept([
		"./module/SummonFunc",
		"./module/SummonMenu",
		"./module/systemFilters",
	], async ([summonFunc, summonMenu, systemFilters]) => {
		if (summonFunc?.pick) {
			console.log("HMR pick function");
			window.foundrySummons.pick = summonFunc.pick;
		}
		if (summonMenu?.SummonMenu) {
			console.log("HMR SummonMenu class");
			window.foundrySummons.SummonMenu = summonMenu.summon;
		}
		if (systemFilters?.systemFilters) {
			console.log("HMR SummonMenu class");
			window.foundrySummons.systemFilters = systemFilters.systemFilters;
		}
	});
}
