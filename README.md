# Foundry Summons 2

An all-in-one solution to all your summoning needs with NO need to import Actors to place them on the map!
Should work on any system. V12 and V13 compatible.

## Quickstart

Create a macro with the following code to **open a summon menu**:
```js
	foundrySummons.SummonMenu.start()
```

Create a macro with the following code to **start summoning a specific token**:
```js
	foundrySummons.pick({ uuid: "UUID of Compendium Actor" })
```

See the [wiki](https://github.com/MrVauxs/foundry-summons-2/wiki) for more advanced macros.

## API

```ts
interface Window {
	foundrySummons: {
		SummonMenu: typeof SummonMenu;
		pick: typeof pick;
		settings: Settings;
	};
}
```

- [SummonMenu](https://github.com/MrVauxs/foundry-summons-2/blob/main/src/module/SummonMenu/index.ts) is an AppV2 class which you can render whether through usual `new SummonMenu({ summonOptions: {...options} }).render()` method or by its static initializer, `SummonMenu.start(options)`.
- [pick](https://github.com/MrVauxs/foundry-summons-2/blob/main/src/module/SummonFunc/index.ts) is a function which takes in an uuid or actor document, and optionally actor update data, [Sequencer crosshair parameters, and callbacks](https://fantasycomputer.works/FoundryVTT-Sequencer/#/crosshair).

### SummonMenu Options
Up to date type definitions (such as filters, packs, and other options) can be found [here](https://github.com/MrVauxs/foundry-summons-2/blob/main/src/module/SummonMenu/index.ts#L7).
