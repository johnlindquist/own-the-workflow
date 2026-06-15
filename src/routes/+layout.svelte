<script lang="ts">
	import favicon from '$lib/assets/egghead-favicon.ico';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} sizes="any" />
</svelte:head>

{@render children()}
