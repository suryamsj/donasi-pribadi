<script lang="ts">
	import { page } from '$app/state';

	let url = $derived(page.url);
	let order_id = $derived(url.searchParams.get('order_id'));
	let transaction_status = $derived(url.searchParams.get('transaction_status'));

	let isSuccess = $derived(transaction_status === 'settlement' || transaction_status === 'capture');
	let isPending = $derived(transaction_status === 'pending');
	let isFailed = $derived(!isSuccess && !isPending);

	function getStatusInfo() {
		if (isSuccess) {
			return {
				title: 'Donasi Berhasil!',
				message: 'Terima kasih atas kebaikan Anda. Donasi telah berhasil diproses.',
				type: 'success',
				icon: 'check-circle'
			};
		} else if (isPending) {
			return {
				title: 'Donasi Sedang Diproses',
				message: 'Donasi Anda sedang dalam proses verifikasi. Mohon tunggu beberapa saat.',
				type: 'warning',
				icon: 'clock'
			};
		} else {
			return {
				title: 'Donasi Gagal',
				message: 'Maaf, terjadi kesalahan dalam memproses donasi Anda. Silakan coba lagi.',
				type: 'error',
				icon: 'x-circle'
			};
		}
	}

	let statusInfo = $derived(getStatusInfo());
</script>

<svelte:head>
	<title>Notifikasi Donasi - {statusInfo.title}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
	<div class="mx-auto max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full {isSuccess
					? 'bg-emerald-100'
					: isPending
						? 'bg-yellow-100'
						: 'bg-red-100'}"
			>
				{#if statusInfo.icon === 'check-circle'}
					<svg
						class="h-8 w-8 text-emerald-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				{:else if statusInfo.icon === 'clock'}
					<svg
						class="h-8 w-8 text-yellow-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				{:else}
					<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				{/if}
			</div>
			<h1 class="mb-2 text-3xl font-light text-slate-800">{statusInfo.title}</h1>
			<p class="text-sm text-slate-600">{statusInfo.message}</p>
		</div>

		<!-- Status Card -->
		<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<div class="space-y-6">
				<!-- Transaction Details -->
				<div class="space-y-4">
					<div class="flex items-center justify-between border-b border-slate-100 pb-3">
						<span class="text-sm font-medium text-slate-600">Nomor Transaksi</span>
						<span class="font-mono text-sm text-slate-800">{order_id || 'N/A'}</span>
					</div>
					<div class="flex items-center justify-between border-b border-slate-100 pb-3">
						<span class="text-sm font-medium text-slate-600">Status Transaksi</span>
						<span
							class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium {isSuccess
								? 'border-emerald-200 bg-emerald-100 text-emerald-800'
								: isPending
									? 'border-yellow-200 bg-yellow-100 text-yellow-800'
									: 'border-red-200 bg-red-100 text-red-800'}"
						>
							{isSuccess ? 'Berhasil' : isPending ? 'Pending' : 'Gagal'}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-slate-600">Waktu</span>
						<span class="text-sm text-slate-800"
							>{new Date().toLocaleDateString('id-ID', {
								day: '2-digit',
								month: 'long',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}</span
						>
					</div>
				</div>

				<!-- Additional Info -->
				{#if isSuccess}
					<div class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
						<div class="flex items-start space-x-3">
							<svg
								class="mt-0.5 h-5 w-5 text-emerald-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<div>
								<p class="text-sm font-medium text-emerald-800">Donasi Berhasil Diterima</p>
								<p class="mt-1 text-xs text-emerald-700">
									Donasi Anda telah berhasil diproses. Terima kasih atas donasi Anda!
								</p>
							</div>
						</div>
					</div>
				{:else if isPending}
					<div class="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
						<div class="flex items-start space-x-3">
							<svg
								class="mt-0.5 h-5 w-5 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<div>
								<p class="text-sm font-medium text-yellow-800">Sedang Diproses</p>
								<p class="mt-1 text-xs text-yellow-700">
									Transaksi Anda sedang dalam proses verifikasi. Kami akan mengirimkan notifikasi
									setelah proses selesai.
								</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="rounded-xl border border-red-200 bg-red-50 p-4">
						<div class="flex items-start space-x-3">
							<svg
								class="mt-0.5 h-5 w-5 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
								></path>
							</svg>
							<div>
								<p class="text-sm font-medium text-red-800">Transaksi Gagal</p>
								<p class="mt-1 text-xs text-red-700">
									Terjadi kesalahan dalam memproses donasi. Silakan hubungi kami jika masalah
									berlanjut.
								</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex flex-col space-y-3 pt-4">
					<a
						href="/"
						class="w-full rounded-xl bg-slate-800 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-700"
					>
						Kembali ke Halaman Utama
					</a>
					{#if isFailed}
						<a
							href="/"
							class="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
						>
							Coba Donasi Lagi
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center">
			<p class="text-xs text-slate-500">Donasi Pribadi</p>
			<p class="mt-1 text-xs text-slate-400">Berbagi kebaikan untuk sesama</p>
		</div>
	</div>
</div>
