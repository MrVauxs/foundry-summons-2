import { SummonMenu } from "./SummonMenu";

const test = () => new SummonMenu({
		summonOptions: {
			toggles: [
				{
					id: 'test1',
					name: "Has \"A\"",
					description: "Desc",
					func: (_actor, _input) => _input ? _actor.name.toLocaleLowerCase().includes("a") : true,
					indexedFields: ["system.details.level.value"],
				},
				{
					id: 'test2',
					name: "Has \"B\"",
					description: "Desc 2",
					func: (_actor, _input) => _input ? _actor.name.toLocaleLowerCase().includes("b") : true,
				},
				{
					id: 'test3',
					name: "Has \"C\"",
					description: "Desc 3",
					func: (_actor, _input) => _input ? _actor.name.toLocaleLowerCase().includes("c") : true,
				},
			],
			searches: [
				{
					id: 'test4',
					placeholder: "Doesn't Have...",
					description: "Desc",
					func: (_actor, _input) => _input ? !_actor.name.toLocaleLowerCase().includes(_input.toLocaleLowerCase()) : true,
				},
			],
			dropdowns: [
				{
					id: 'test5',
					name: "Something",
					description: "Desc",
					options: [
						{ label: "Test 1", value: 1 },
						{ label: "Test 2", value: 2 },
					],
					func: (_actor, _input) => true,
				},
			],
			packs: ["pf2e.pathfinder-npc-core"]
		},
	}).render({ force: true });

Hooks.on("ready", () => {
	test()
});
