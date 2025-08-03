<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Donasi Pribadi - Autentikasi</title>
</svelte:head>

<main class="min-h-screen bg-gray-50">
	{@render children()}
</main>
