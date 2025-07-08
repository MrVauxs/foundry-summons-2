<script lang="ts">
	let { data, foundryApp } = $props();

	console.log(data, foundryApp);
</script>

<article class="root">
	<aside class="sidebar"> aside </aside>
	<article class="main"> main content </article>
</article>

<style lang="postcss">
	.root {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		min-height: 100%;
		width: 100%;
	}

	.sidebar {
		flex: 0 0 25%;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		background:
			radial-gradient(circle at 50% 250%, #0000007f, #ffffff7f) padding-box,
			linear-gradient(#000000, #ffffff) border-box;

		padding: 0.25rem;
	}

	.main {
		flex: 1;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		background:
			radial-gradient(circle at 50% 250%, #0000007f, #ffffff7f) padding-box,
			linear-gradient(#000000, #ffffff) border-box;

		padding: 0.25rem;

	}
</style>