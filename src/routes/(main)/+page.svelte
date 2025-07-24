<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	let isLoading = $state(false);
	let showAlert = $state({
		show: false,
		type: '',
		message: ''
	});
	let selectedAmount = $state('');
	let customAmount = $state('');

	const predefinedAmounts = [50000, 100000, 250000, 500000, 1000000];

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					showAlert.show = true;
					showAlert.type = 'success';
					showAlert.message = result.data?.message || 'Form submitted successfully!';
					selectedAmount = '';
					customAmount = '';
					setTimeout(() => {
						window.location.href = result.data?.url;
					}, 2000);
					break;
				case 'failure':
					showAlert.show = true;
					showAlert.type = 'error';
					showAlert.message = result.data?.message || 'Form submitted successfully!';
					selectedAmount = '';
					customAmount = '';
					break;
			}
			isLoading = false;
			await update();
		};
	};

	function handleAmountChange(amount: string) {
		selectedAmount = amount;
		if (amount !== 'custom') {
			customAmount = '';
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
	<div class="mx-auto max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-light text-slate-800">Donasi</h1>
			<p class="text-sm text-slate-600">Berbagi kebaikan untuk sesama</p>
		</div>

		<!-- Alert -->
		{#if showAlert.show}
			<div class="mb-6">
				<Alert type={showAlert.type} message={showAlert.message} />
			</div>
		{/if}

		<!-- Form Card -->
		<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<form class="space-y-6" action="" method="post" use:enhance={handleSubmit}>
				<!-- Nama Pengirim -->
				<div class="space-y-2">
					<label for="customer" class="block text-sm font-medium text-slate-700">
						Nama Pengirim
					</label>
					<input
						type="text"
						name="customer_name"
						id="customer"
						class="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
						placeholder="Masukkan nama Anda"
					/>
					<p class="text-xs text-slate-500">
						Opsional. Jika kosong, akan ditampilkan sebagai "Hamba Allah"
					</p>
				</div>

				<!-- Email -->
				<div class="space-y-2">
					<label for="email" class="block text-sm font-medium text-slate-700"> Email </label>
					<input
						type="email"
						name="customer_email"
						id="email"
						class="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
						placeholder="Masukkan email Anda"
						required
					/>
				</div>

				<!-- Jumlah Donasi -->
				<div class="space-y-4">
					<label for="" class="block text-sm font-medium text-slate-700"> Jumlah Donasi </label>

					<!-- Predefined Amounts -->
					<div class="grid grid-cols-2 gap-3">
						{#each predefinedAmounts as amount}
							<label class="relative cursor-pointer">
								<input
									type="radio"
									name="donation_type"
									value={amount}
									class="peer sr-only"
									disabled={selectedAmount === 'custom'}
									onchange={() => handleAmountChange(amount.toString())}
								/>
								<div
									class="w-full rounded-xl border-2 px-4 py-3 text-center transition-all
										{selectedAmount === 'custom'
										? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
										: 'border-slate-200 peer-checked:border-slate-600 peer-checked:bg-slate-50 hover:border-slate-300'}"
								>
									<span class="text-sm font-medium">
										Rp {amount.toLocaleString('id-ID')}
									</span>
								</div>
							</label>
						{/each}
					</div>

					<!-- Custom Amount Option -->
					<div class="space-y-3">
						<label class="relative cursor-pointer">
							<input
								type="radio"
								name="donation_type"
								value="custom"
								class="peer sr-only"
								disabled={selectedAmount !== '' && selectedAmount !== 'custom'}
								onchange={() => handleAmountChange('custom')}
							/>
							<div
								class="w-full rounded-xl border-2 px-4 py-3 text-center transition-all
									{selectedAmount !== '' && selectedAmount !== 'custom'
									? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
									: 'border-slate-200 peer-checked:border-slate-600 peer-checked:bg-slate-50 hover:border-slate-300'}"
							>
								<span class="text-sm font-medium">Jumlah Lainnya</span>
							</div>
						</label>

						{#if selectedAmount === 'custom'}
							<div class="mt-3">
								<input
									type="number"
									name="amount"
									bind:value={customAmount}
									class="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
									placeholder="Masukkan jumlah donasi"
									min="10000"
									max="1000000"
									step="1000"
									required
								/>
							</div>
						{/if}
					</div>

					<p class="pt-2 text-center text-xs text-slate-500">
						Minimum Rp 10.000 • Maksimum Rp 1.000.000
					</p>
				</div>

				<!-- Submit Button -->
				<button
					class="w-full rounded-xl bg-slate-800 px-6 py-4 font-medium text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
					type="submit"
					disabled={isLoading}
				>
					{#if isLoading}
						<div class="flex items-center justify-center space-x-2">
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
							<span>Memproses...</span>
						</div>
					{:else}
						Kirim Donasi
					{/if}
				</button>
			</form>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center">
			<p class="text-xs text-slate-500">Terima kasih atas kebaikan Anda</p>
		</div>
	</div>
</div>
