<script lang="ts">
	let { type, message } = $props();

	function getAlertClass(type: string): string {
		switch (type) {
			case 'success':
				return 'bg-green-100 text-green-800';
			case 'error':
				return 'bg-red-100 text-red-800';
			default:
				return '';
		}
	}
</script>

<div class="w-full p-4 {getAlertClass(type)}">
	<div class="flex items-center">
		{#if type === 'success'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-green-600"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m5.293-1.293a1 1 0 00-1.414-1.414l-7.586 7.586a1 1 0 01-1.414 0L3.707 12.707a1 1 0 00-1.414 1.414l3.586 3.586a3 3 0 004.243 0l8.586-8.586z"
				/>
			</svg>
		{:else if type === 'error'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-red-600"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		{/if}
		<span class="ml-2">{message}</span>
	</div>
</div>
