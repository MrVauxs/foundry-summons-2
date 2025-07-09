# Foundry Summons 2

## API

```ts
foundrySummons: {
	SummonMenu: typeof SummonMenu;
	pick: typeof pick;
	settings: Settings;
};
```

- [SummonMenu](https://github.com/MrVauxs/foundry-summons-2/blob/main/src/module/SummonMenu/index.ts) is an AppV2 class which you can render whether through usual `new SummonMenu({ summonOptions: {...options} }).render()` method or by its static initializer, `SummonMenu.start(options)`.
- [pick](https://github.com/MrVauxs/foundry-summons-2/blob/main/src/module/SummonFunc/index.ts) is a function which takes in an uuid or actor document, and optionally actor update data, [Sequencer crosshair parameters, and callbacks](https://fantasycomputer.works/FoundryVTT-Sequencer/#/crosshair).

### SummonMenu Options
```ts
interface summonOptions {
	/** Creates a checkmark input filter */
	toggles?: {
		id: string;
		name: string;
		description?: string;
		func: (actor: CompendiumIndexData, input: boolean) => boolean;
		indexedFields?: string[];
	}[];

	/** Creates a text input filter */
	searches?: {
		id: string;
		name?: string;
		description?: string;
		placeholder?: string;
		func: (actor: CompendiumIndexData, input: string) => boolean;
		indexedFields?: string[];
	}[];

	/** Creates a dropdown select filter */
	dropdowns?: {
		id: string;
		name?: string;
		description?: string;
		options: { label: string; value: any }[];
		func: (actor: CompendiumIndexData, input: any) => boolean;
		indexedFields?: string[];
	}[];

	/**
	 * Which compendium packs to draw sources from.
	 * @example ["pf2e.pathfinder-npc-core"]
	 */
	packs?: string[];

	/**
	 * Close the menu once summoning begins.
	 * @default true
	*/
	once?: boolean;
}
```
