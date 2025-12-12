# 2.5.2
- Made the list element component send console errors to the console when it says to check them.
- Made the level column only appear in the PF2e system.

# 2.5.1
- Fixed the module warning that updateData will not affect non-compendium actors when using compendium actors.

# 2.5.0
- Created a new user setting that allows players to choose a GM in an event there are multiple present.
  - The setting default is false, relying on whoever is the "active" GM as a default.
  - If enabled, the choice is made with every summoning request.
- Fixed a bug with `pick()` not returning the token document.

# 2.4.1
- Fixed possible discrepancy on which GM accepts summon requests between Foundry Summons and socketlib (#9)
  - This does not make it possible for more than one GM to control summoning requests.
- Added logs for when a GM has been denied to handle a summon request (usually in favor of another active GM).

# 2.4.0

- Added `tokenData` and `drawPing` summonOptions.
  - `tokenData` is the TokenDocument equivalent of `updateData`. It allows you to pass data that modifies the token created when summoning, such as `name` or `alpha`.
  - `drawPing` can be a boolean to toggle the default ping, or an object to customize the ping drawn when summoning. Default is true.

# 2.3.3

- Added handling for non-compendium actors when using `pick()`. Summon your Eidolons to your hearts content.

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
