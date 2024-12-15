<script lang='ts'>
	import type { Filter } from './Filter';

	export let filter: Filter<any>;
</script>

<div>
	{filter.name}

	{#if filter.type === 'search'}
		<input bind:value={filter.value} />
	{:else if filter.type === 'checkbox'}
		<checkbox>
			a
		</checkbox>
	{/if}
</div>
