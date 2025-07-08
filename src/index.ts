/* eslint-disable no-console */
import { pick } from "./module/SummonFunc";
import { SummonMenu } from "./module/SummonMenu";
import "./styles/main.css";
import "./app.css";

window.foundrySummons = {
	pick,
	SummonMenu,
};

if (import.meta.hot) {
	import.meta.hot.accept(["./module/SummonFunc", "./module/SummonMenu"], async ([summonFunc, summonMenu]) => {
		if (summonFunc?.pick) {
			console.log("Replacing pick function");
			window.foundrySummons.pick = summonFunc.pick;
		}
		if (summonMenu?.SummonMenu) {
			console.log("Replacing SummonMenu class");
			window.foundrySummons.SummonMenu = summonMenu.summon;
		}
	});
}
