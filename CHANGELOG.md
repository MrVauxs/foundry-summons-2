# 2.3.2

- Added the `default` optional property to filters, allowing you to preset what a given filter should start with.

# 2.3.1

- Added the `noSummon` summonOption, changing the `selection` getter to just the UUID of the actor. Allowing for different handling than the default summoning workflow.

# 2.3.0

- SummonMenu instances now have the selection getter which will asynchronously retrieve the selected TokenDocument.
  - The `SummonMenu.start()` static function will automatically return with the above promise, instead of returning the application itself.

# 2.2.1

- Slightly better compatibility with PF2e Toolbelt's Template Helper.

# 2.2.0

- Changed setup image from generic template to the original Foundry Summons image.
- Added `sort` to `systemConstants`.
- Added `sort` to dropdowns and toggles options.

# 2.1.0

- Added `updateData` and `actorLink` summonOptions.
  - `updateData` is 1:1 copy of what you'd pass into an actors `update` function.
  - `actorLink` is a shorthand for updating the actors "Link Actor Data" token setting true.