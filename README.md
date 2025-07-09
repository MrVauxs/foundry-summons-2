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
Up to date type definitions can be found [here](https://github.com/MrVauxs/foundry-summons-2/blob/main/src/module/SummonMenu/index.ts#L7).
