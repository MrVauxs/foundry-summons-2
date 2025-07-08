<script lang="ts">
	let prop = $state("");
</script>

<div class="something-blue">
	Hi {prop}!
	<p class="red fsum-text-xl fsum-font-black"> I am red </p>
	<input type="text" bind:value={prop} placeholder="reactive typing!" />

	<button> Default style buttons! </button>
</div>

<style lang="postcss">
	.something-blue {
		color: blue;
	}
	.red {
		color: red;
	}
</style>