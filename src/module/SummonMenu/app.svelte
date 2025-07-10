<script lang="ts">
	import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";
	import type { SummonMenuContext } from ".";
	import VirtualList from 'svelte-tiny-virtual-list';
	import { pick } from "../SummonFunc";
	import { systemFilters } from "../systemFilters";
	import { FileUser } from '@lucide/svelte';
	import type { ActorPF2e } from "foundry-pf2e";

	const { data, foundryApp }: SummonMenuContext = $props();

	let search = $state("");
	let height = $state(0)

	let actors: CompendiumIndexData[] = $state([])

	const fields = Array.from(new Set([
		...(data.options.dropdowns?.flatMap(x=> x.indexedFields) || []),
		...(data.options.toggles?.flatMap(x=> x.indexedFields) || []),
		...(data.options.searches?.flatMap(x=> x.indexedFields) || []),
	].filter(x => x !== undefined)))

	$effect(() => {
		const loadActors = async () => {
			const promises = data.options.packs!.map(pack =>
				game.packs.get(pack)?.getIndex({fields: ['img', ...fields]})
			);

			try {
				const indices = await Promise.all(promises);
				actors = indices
					.flatMap(index => index?.contents || [])
					// The filter is here to not have finalActors and actors always mismatched in numbers, since the system filters should be always applied.
					.filter(
						window.foundrySummons.systemFilters[game.system.id as keyof typeof systemFilters]
						? window.foundrySummons.systemFilters[game.system.id as keyof typeof systemFilters]
						: () => true);
			} catch (err) {
				console.error(err);
			}
		};

		loadActors();
	});

	const filters = Array.from(new Set([
		...(data.options.dropdowns?.map(x=> ({id: x.id, func: x.func})) || []),
		...(data.options.toggles?.map(x=> ({id: x.id, func: x.func})) || []),
		...(data.options.searches?.map(x=> ({id: x.id, func: x.func})) || []),
	]))

	let filterState: Record<string, any> = $state({});

	for (const filter of filters) {
		filterState[filter.id] = undefined
	}

	const finalActors = $derived.by(() => {
		let TBFActors = actors;

		if (data.options.filter) {
			TBFActors = TBFActors.filter(data.options.filter)
		}

		if (search.trim().length) {
			const regexp = new RegExp(RegExp.escape(search), "i");
			TBFActors = TBFActors.filter(x => regexp.test(x.name));
		}

		for (const filter of filters) {
			TBFActors = TBFActors.filter((actor) => filter.func(actor, filterState[filter.id] as never))
		}

		return TBFActors;
	})

	async function startSummoning(uuid: string) {
		try {
			foundryApp.minimize();
			await pick({uuid})
			if (data.options.once) foundryApp.close();
		} catch {
			foundryApp.maximize();
		}
	}

	async function previewActor(ev: Event, uuid: string) {
		ev.stopPropagation();

		const actor: ActorPF2e | null = await fromUuid(uuid);
		if (!actor) throw ui.notifications.error("Somehow, this actor does not exist!")

		if (window.foundrySummons.settings.seeActors) {
			actor.getUserLevel = () => 3;
		}

		actor.sheet.render(true)
	}
</script>

<article class="root">
	<aside class="sidebar border">
		<div class="sidebar-contents">
		<label>
			<input autocomplete="off" type="search" bind:value={search} placeholder="Search by name..." name="search">
		</label>
		{#each (data.options.searches || []) as filter}
			<label data-tooltip={filter.description} data-tooltip-direction="LEFT">
				{#if filter.name}<span>{filter.name}</span>{/if}
				<input autocomplete="off" type="search" name={filter.name} bind:value={filterState[filter.id]} placeholder={filter.placeholder}>
			</label>
		{/each}
		{#each (data.options.dropdowns || []) as filter}
			<label data-tooltip={filter.description} data-tooltip-direction="LEFT">
				{#if filter.name}<span>{filter.name}</span>{/if}
				<select name={filter.name} bind:value={filterState[filter.id]}>
					{#each filter.options as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>
		{/each}
		<div class="flexrow">
			{#each (data.options.toggles || []) as filter}
				<label class="flex-input border" data-tooltip={filter.description} data-tooltip-direction="UP">
					{#if filter.name}<span>{filter.name}</span>{/if}
					<input type="checkbox" name={filter.name} bind:checked={filterState[filter.id]}>
				</label>
			{/each}
		</div>
		</div>
		<footer class="footer border">
			Showing {finalActors.length} out of {actors.length} Actors
		</footer>
	</aside>
	<article class="main border" bind:clientHeight={height}>
		<VirtualList width="100%" height={height - 8} itemCount={finalActors.length} itemSize={32}>
			{#snippet item({ style, index })}
				{@const actor = finalActors[index]}
				<div {style}>
					<div
						role="button"
						tabindex="0"
						onkeydown={() => startSummoning(actor.uuid)}
						onclick={() => startSummoning(actor.uuid)}
						class="option border hover"
					>
						<svelte:boundary>
							{#snippet failed()}
								Errored on {actor?.name ?? "???"}. See the console for details.
							{/snippet}

							<button
								aria-label="Preview"
								onclick={(ev) => previewActor(ev, actor.uuid)}
								class="btn-icon"
							>
								<FileUser />
							</button>
							<div>{actor.name}</div>
							<div class="level">{actor.system?.details?.level.value}</div>
						</svelte:boundary>
					</div>
				</div>
			{/snippet}
		</VirtualList>
	</article>
</article>

<style lang="postcss">
	.btn-icon {
		width: 1rem;
		height: 1rem;
		text-align: center;
		margin-right: 0.25rem;
		border: none;
		background: none;

		/* Reset */
		padding: 0;
	}

	.footer {
		position: sticky;
		bottom: 0;
		margin-top: auto;
		font-size: 0.75rem;
		text-align: center;
		width: 100%;
	}

	.border {
		padding-inline: 4px;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		background:
			radial-gradient(circle at 50% 250%, var(--fsum-primary), var(--fsum-secondary)) padding-box,
			linear-gradient(var(--fsum-primary), var(--fsum-secondary)) border-box;

		&.hover {
			&:hover {
				background:
					radial-gradient(circle at 50% 250%, var(--fsum-primary-highlight), var(--fsum-secondary-highlight)) padding-box,
					linear-gradient(var(--fsum-primary-highlight), var(--fsum-secondary-highlight)) border-box;
			}
		}
	}

	.root {
		display: flex;
		flex-direction: row;
		gap: 0.33rem;
		min-height: 100%;
		width: 100%;
	}

	.sidebar {
		flex: 0 0 33%;
		padding: 0.25rem;

		& .sidebar-contents {
			height: calc(100% - 1.2rem);
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			overflow-y: auto;
			overflow-x: clip;
		}
	}

	.main {
		flex: 1;
		padding: 0.25rem;
	}

	label span {
		padding: 0 0.25rem;
		min-width: fit-content;
	}

	.flexrow {
		gap: 0.25rem;
	}

	.flex-input {
		display: flex;
		flex-direction: row;
		align-items: center;
  		align-content: stretch;

		input {
			width: fit-content;
			&::before {
				display: inline-block;
				width: 1.5rem;
			}
			margin-left: auto;
		}
	}

	.option {
		display: flex;
		align-items: center;

		width: 100%;
		padding: 0.25rem;

		& .level {
			margin-left: auto;
			font-variant-numeric: tabular-nums;
		}
	}
</style>