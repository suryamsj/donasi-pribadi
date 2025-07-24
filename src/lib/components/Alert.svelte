<script lang="ts">
	let { type, message } = $props();

	function getAlertClass(type: string): string {
		switch (type) {
			case 'success':
				return 'bg-emerald-50 border-emerald-200 text-emerald-800';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800';
			default:
				return 'bg-slate-50 border-slate-200 text-slate-800';
		}
	}

	function getIconClass(type: string): string {
		switch (type) {
			case 'success':
				return 'text-emerald-600';
			case 'error':
				return 'text-red-600';
			default:
				return 'text-slate-600';
		}
	}
</script>

<div class="w-full rounded-xl border p-4 shadow-sm {getAlertClass(type)}">
	<div class="flex items-center space-x-3">
		{#if type === 'success'}
			<div class="flex-shrink-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 {getIconClass(type)}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
		{:else if type === 'error'}
			<div class="flex-shrink-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 {getIconClass(type)}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			</div>
		{/if}
		<div class="flex-1">
			<p class="text-sm font-medium">{message}</p>
		</div>
	</div>
</div>
