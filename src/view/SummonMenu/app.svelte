<script lang="ts">
	let { data, foundryApp } = $props();

	console.log(data, foundryApp);
</script>

<article class="root">
	<aside class="sidebar"> aside </aside>
	<article class="main"> a </article>
</article>

<style lang="postcss">
	.root {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	.sidebar {

	}

	.main {

	}
</style>