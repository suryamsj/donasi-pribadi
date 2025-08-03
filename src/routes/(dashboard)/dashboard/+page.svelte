<script lang="ts">
	import type { Transaction } from '@prisma/client';

	let { data } = $props();
	let { transactions } = $derived(data);
	let filteredTransactions: Transaction[] = $state([]);
	let selectedStatus = $state('ALL');
	let searchQuery = $state('');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Statistics
	let stats = $state({
		totalTransactions: 0,
		totalAmount: 0,
		successfulTransactions: 0,
		pendingTransactions: 0,
		failedTransactions: 0
	});

	function calculateStats() {
		stats.totalTransactions = transactions.length;
		stats.totalAmount = transactions.reduce((sum, t) => sum + t.gross_amount, 0);
		stats.successfulTransactions = transactions.filter(
			(t) => t.transaction_status === 'SUCCESS'
		).length;
		stats.pendingTransactions = transactions.filter(
			(t) => t.transaction_status === 'PENDING'
		).length;
		stats.failedTransactions = transactions.filter((t) => t.transaction_status === 'FAILED').length;
	}

	function filterTransactions() {
		let filtered = transactions;

		// Filter by status
		if (selectedStatus !== 'ALL') {
			filtered = filtered.filter((t) => t.transaction_status === selectedStatus);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(t) =>
					t.customer_name.toLowerCase().includes(query) ||
					t.customer_email.toLowerCase().includes(query) ||
					t.order_id.toLowerCase().includes(query)
			);
		}

		filteredTransactions = filtered;
		currentPage = 1;
	}

	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'SUCCESS':
				return 'bg-emerald-100 text-emerald-800 border-emerald-200';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'FAILED':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-slate-100 text-slate-800 border-slate-200';
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Pagination
	let totalPages = $derived(Math.ceil(filteredTransactions.length / itemsPerPage));
	let paginatedTransactions = $derived(
		filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	// Reactive filtering
	$effect(() => {
		calculateStats();
		if (selectedStatus || searchQuery) {
			filterTransactions();
		}
	});
</script>

<svelte:head>
	<title>Dashboard - Donasi Pribadi</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
	<div class="mx-auto max-w-7xl">
		<!-- Header -->
		<div class="mb-8 flex items-start justify-between">
			<div>
				<h1 class="mb-2 text-3xl font-light text-slate-800">Dashboard Donasi</h1>
				<p class="text-slate-600">Kelola dan pantau transaksi donasi</p>
			</div>
			<a
				href="/logout"
				class="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					></path>
				</svg>
				Logout
			</a>
		</div>

		<!-- Statistics Cards -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<!-- Total Transaksi -->
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-slate-600">Total Transaksi</p>
						<p class="text-2xl font-semibold text-slate-800">{stats.totalTransactions}</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
						<svg
							class="h-6 w-6 text-slate-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Total Donasi -->
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-slate-600">Total Donasi</p>
						<p class="text-2xl font-semibold text-slate-800">
							{formatCurrency(stats.totalAmount)}
						</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
						<svg
							class="h-6 w-6 text-emerald-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
							></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Transaksi Berhasil -->
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-slate-600">Berhasil</p>
						<p class="text-2xl font-semibold text-emerald-600">{stats.successfulTransactions}</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
						<svg
							class="h-6 w-6 text-emerald-600"
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
					</div>
				</div>
			</div>

			<!-- Transaksi Pending -->
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-slate-600">Pending</p>
						<p class="text-2xl font-semibold text-yellow-600">{stats.pendingTransactions}</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
						<svg
							class="h-6 w-6 text-yellow-600"
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
					</div>
				</div>
			</div>
		</div>

		<!-- Filters and Search -->
		<div class="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex flex-col gap-4 md:flex-row">
				<!-- Search -->
				<div class="flex-1">
					<label for="search" class="mb-2 block text-sm font-medium text-slate-700">
						Cari Transaksi
					</label>
					<input
						type="text"
						id="search"
						bind:value={searchQuery}
						class="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
						placeholder="Cari berdasarkan nama, email, atau order ID..."
					/>
				</div>

				<!-- Status Filter -->
				<div class="md:w-48">
					<label for="status" class="mb-2 block text-sm font-medium text-slate-700">
						Filter Status
					</label>
					<select
						id="status"
						bind:value={selectedStatus}
						class="w-full rounded-xl border border-slate-200 px-4 py-3 transition-colors focus:border-slate-400 focus:ring-0"
					>
						<option value="ALL">Semua Status</option>
						<option value="SUCCESS">Berhasil</option>
						<option value="PENDING">Pending</option>
						<option value="FAILED">Gagal</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Transactions Table -->
		<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div class="border-b border-slate-200 px-6 py-4">
				<h2 class="text-lg font-semibold text-slate-800">Daftar Transaksi</h2>
				<p class="mt-1 text-sm text-slate-600">
					Menampilkan {paginatedTransactions.length} dari {filteredTransactions.length} transaksi
				</p>
			</div>

			{#if paginatedTransactions.length === 0}
				<div class="p-12 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"
					>
						<svg
							class="h-8 w-8 text-slate-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path>
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-medium text-slate-800">Tidak ada transaksi</h3>
					<p class="text-slate-600">Belum ada transaksi yang sesuai dengan filter yang dipilih.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-slate-50">
							<tr>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
								>
									Order ID
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
								>
									Donatur
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
								>
									Jumlah
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
								>
									Metode
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
								>
									Status
								</th>
								<th
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-slate-500 uppercase"
								>
									Tanggal
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200 bg-white">
							{#each paginatedTransactions as transaction}
								<tr class="transition-colors hover:bg-slate-50">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-slate-900">
											{transaction.order_id}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-slate-900">
											{transaction.customer_name}
										</div>
										<div class="text-sm text-slate-500">
											{transaction.customer_email}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-semibold text-slate-900">
											{formatCurrency(transaction.gross_amount)}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-slate-900 capitalize">
											{transaction.method}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span
											class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium {getStatusBadgeClass(
												transaction.transaction_status
											)}"
										>
											{transaction.transaction_status === 'SUCCESS'
												? 'Berhasil'
												: transaction.transaction_status === 'PENDING'
													? 'Pending'
													: 'Gagal'}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-slate-900">
											{formatDate(String(transaction.created_at))}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="border-t border-slate-200 px-6 py-4">
						<div class="flex items-center justify-between">
							<div class="text-sm text-slate-600">
								Halaman {currentPage} dari {totalPages}
							</div>
							<div class="flex space-x-2">
								<button
									onclick={() => (currentPage = Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Sebelumnya
								</button>
								<button
									onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Selanjutnya
								</button>
							</div>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
