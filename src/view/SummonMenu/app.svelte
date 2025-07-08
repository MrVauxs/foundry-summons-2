<script lang="ts">
	import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";
	import type { SummonMenuContext } from ".";
	import VirtualList from 'svelte-tiny-virtual-list';

	const { data }: SummonMenuContext = $props();

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
				actors = indices.flatMap(index => index?.contents || []);
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

		if (search.trim().length) {
			const regexp = new RegExp(RegExp.escape(search), "i");
			TBFActors = TBFActors.filter(x => regexp.test(x.name));
		}

		for (const filter of filters) {
			TBFActors = TBFActors.filter((actor) => filter.func(actor, filterState[filter.id] as never))
		}

		return TBFActors;
	})
</script>

<article class="root">
	<aside class="sidebar border">
		<label>
			<input type="search" bind:value={search} placeholder="Search by name..." name="search">
		</label>
		{#each (data.options.searches || []) as filter}
			<label data-tooltip={filter.description} data-tooltip-direction="LEFT">
				{#if filter.name}<span>{filter.name}</span>{/if}
				<input type="search" name={filter.name} bind:value={filterState[filter.id]} placeholder={filter.placeholder}>
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
		<footer class="footer">
			{finalActors.length} / {actors.length}
		</footer>
	</aside>
	<article class="main border" bind:clientHeight={height}>
		<VirtualList width="100%" height={height - 8} itemCount={finalActors.length} itemSize={30}>
			{#snippet item({ style, index })}
				{@const actor = finalActors[index]}
				<div {style}>
					<div class="option border hover" style:height={"28px"}>
						<svelte:boundary>
							{#snippet failed()}
								Failed to render {actor?.name ?? "???"} actor as an entry. See the console for details.
							{/snippet}

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
	.footer {
		margin-top: auto;
		font-size: 0.75rem;
		text-align: right;
		width: 100%;
	}

	.border {
		padding: 0 4px;
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

		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
			margin-left: auto;
			margin-right: 0.25rem;
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