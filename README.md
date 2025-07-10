# Foundry Summons 2

![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fversion%3Fstyle%3Dflat%26url%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2FMrVauxs%2Ffoundry-summons-2%2Fmain%2Fmodule.json)
![All Downloads](https://img.shields.io/github/downloads/MrVauxs/foundry-summons-2/total?color=purple&label=All%20Downloads)
![Latest Version Downloads](https://img.shields.io/github/downloads/MrVauxs/foundry-summons-2/latest/total?color=purple&label=Latest%20Version%20Downloads&sort=semver)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundry-summons&colorB=4aa94a)](https://forge-vtt.com/bazaar#package=foundry-summons)

An all-in-one solution to all your summoning needs with NO need to import Actors to place them on the map!
Should work on any system. V12 and V13 compatible.

## Quickstart

Create a macro with the following code to **open a summon menu**:

```js
foundrySummons.SummonMenu.start();
```

Create a macro with the following code to **start summoning a specific token**:

```js
foundrySummons.pick({ uuid: "UUID of Compendium Actor" });
```

See the [wiki](https://github.com/MrVauxs/foundry-summons-2/wiki) for more advanced macros.

## API

See the API here https://github.com/MrVauxs/foundry-summons-2/wiki/API
