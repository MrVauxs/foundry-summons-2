<svelte:options customElement={{ tag: "test-app", shadow: "open" }} css="injected"></svelte:options>

<script lang="ts">
	import "./styles.css";

	let prop = $state("");
</script>

<div class="something-blue">
	Hi {prop}!
	<p class="red text-xl"> I am red </p>
	<input type="text" bind:value={prop} placeholder="reactive typing!" />

	<button> Default style buttons! </button>
</div>

<style lang="postcss">
	.something-blue {
		color: blue;
	}
</style>