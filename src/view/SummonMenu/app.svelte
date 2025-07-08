<script lang="ts">
	import type { CompendiumIndexData } from "foundry-pf2e/foundry/client/documents/collections/compendium-collection.mjs";
	import type { SummonMenuContext } from ".";
	import { onMount } from "svelte";

	const { data, /* foundryApp */ }: SummonMenuContext = $props();

	let search = $state("");

	let actors: CompendiumIndexData[] = $state([])

	onMount(async () => {
		for (const pack of data.options.packs || game.packs.contents.map(x => x.id)) {
			const index = await game.packs.get(pack)?.getIndex()
			if (index) actors.push(...index);
		}
	})
</script>

<article class="root">
	<aside class="sidebar border">
		<label>
			<input type="search" bind:value={search} placeholder="Search by name..." name="search">
		</label>
		{#each (data.options.searches || []) as filter}
			<label data-tooltip={filter.description} data-tooltip-direction="LEFT">
				<span>{filter.name}</span>
				<input type="search" name={filter.name}>
			</label>
		{/each}
		{#each (data.options.dropdowns || []) as filter}
			<label data-tooltip={filter.description} data-tooltip-direction="LEFT">
				<span>{filter.name}</span>
				<select name={filter.name}>
					{#each filter.options as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>
		{/each}
		<div class="flexrow">
			{#each (data.options.toggles || []) as filter}
				<label class="flex-input border" data-tooltip={filter.description} data-tooltip-direction="UP">
					<span>{filter.name}</span>
					<input type="checkbox" name={filter.name}>
				</label>
			{/each}
		</div>
	</aside>
	<article class="main border">
		{#each actors as actor}
			<div class="option border">
				<span>{actor.name}</span>
			</div>
		{/each}
	</article>
</article>

<style lang="postcss">
	.border {
		padding: 0 4px;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		background:
			radial-gradient(circle at 50% 250%, #1ebcaa20, #4760da20) padding-box,
			linear-gradient(#1ebcaa20, #4760da20) border-box;
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
		overflow-y: scroll;
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
		width: 100%;
		text-align: center;
		padding: 0.25rem;
	}
</style>