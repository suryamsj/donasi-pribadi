<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Donasi Pribadi - Muhammad Surya J</title>
</svelte:head>

<main class="min-h-screen bg-gray-50">
	{@render children()}
</main>
