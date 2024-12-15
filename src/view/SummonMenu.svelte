<script lang='ts'>
	import { ApplicationShell } from '#runtime/svelte/component/application';
	import * as R from 'remeda';
	import { getContext } from 'svelte';
	import Filter from './Components/Filter.svelte';
	import { type BasicAppExternal } from './SummonMenu';

	export let elementRoot: HTMLElement;
	const { application } = getContext<BasicAppExternal>('#external');

	const creatures = application.options.fsummons?.actors ?? [];
	const filters = (application.options.fsummons?.filters ?? []).concat([
		{
			name: 'Search',
			type: 'search',
			id: 'search',
			function: (npcs: Actor[], search: string) =>
				npcs.filter(x => x.name.includes(search || '')),
		},
	]);

	let filtered = creatures;
	$: {
		filtered = creatures;
		filters.forEach((filter) => {
			filtered = filter.function(filtered, filter.value);
		});
	}
</script>

<svelte:options accessors={true} />

<ApplicationShell bind:elementRoot>
	<div class='flex flex-row flex-nowrap justify-start gap-2 max-h-full h-full'>
		<aside class='
			p-4 min-w-[35%]
			rounded border-solid
			border shadow-md
		'>
			<h3 class='border-b-0'>Filters</h3>
			{#each filters as filter}
				<Filter bind:filter />
			{/each}
		</aside>
		<main class='
			flex-1 flex flex-col
			overflow-y-scroll
		'>
			{#each R.sortBy(filtered, R.prop('name')) as creature}
				<div class='
					p-2
					border-solid border-x border-y-0
					first:border-t border-b
				'>
					{creature.name}
				</div>
			{/each}
		</main>
	</div>
</ApplicationShell>
