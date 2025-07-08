import { SummonMenu } from "./SummonMenu";

Hooks.on("ready", () => {
	new SummonMenu({
		summonOptions: {
			toggles: [{
				name: "Test",
				description: "Desc",
				func: _actor => true,
				indexedFields: ["level"],
			}, {
				name: "Test 2",
				description: "Desc 2",
				func: _actor => true,
				indexedFields: ["level"],
			}, {
				name: "Test 3",
				description: "Desc 3",
				func: _actor => true,
				indexedFields: ["level"],
			}],
			searches: [{
				name: "Test",
				description: "Desc",
				func: (_actor, _input) => true,
				indexedFields: ["level"],
			}],
			dropdowns: [{
				name: "Test",
				description: "Desc",
				options: [{ label: "Test 1", value: 1 }, { label: "Test 2", value: 2 }],
				func: (_actor, _input) => true,
				indexedFields: ["level"],
			}],
			packs: ["pf2e.abomination-vaults-bestiary"],
		},
	}).render({ force: true });
});

if (import.meta.hot) import.meta.hot.accept();
