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

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					showAlert.show = true;
					showAlert.type = 'success';
					showAlert.message = result.data?.message || 'Form submitted successfully!';
					setTimeout(() => {
						window.location.href = result.data?.url;
					}, 2000);
					break;
				case 'failure':
					showAlert.show = true;
					showAlert.type = 'error';
					showAlert.message = result.data?.message || 'Form submitted successfully!';
					break;
			}
			isLoading = false;
			await update();
		};
	};
</script>

<section class="mx-auto max-w-xl p-4">
	<div class="flex min-h-screen items-center justify-center">
		{#if showAlert.show}
			<Alert type={showAlert.type} message={showAlert.message} />
		{/if}
		<form class="flex flex-col space-y-3" action="" method="post" use:enhance={handleSubmit}>
			<div class="flex flex-col space-y-2">
				<div class="flex flex-col space-y-2">
					<label for="customer">Nama Pengirim</label>
					<input
						type="text"
						name="customer_name"
						id="customer"
						class="w-full rounded border border-gray-300 p-2"
						placeholder="Masukkan nama Anda"
					/>
				</div>
				<p>Optional. Jika tidak di isi, maka akan menjadi Hamba Allah</p>
			</div>
			<!-- Email -->
			<div class="flex flex-col space-y-2">
				<label for="email">Email</label>
				<input
					type="email"
					name="customer_email"
					id="email"
					class="w-full rounded border border-gray-300 p-2"
					placeholder="Masukkan email Anda"
					required
				/>
			</div>
			<!-- Amount -->
			<div class="flex flex-col space-y-2">
				<label for="amount">Jumlah Donasi</label>
				<input
					type="number"
					name="amount"
					id="amount"
					class="w-full rounded border border-gray-300 p-2"
					placeholder="Masukkan jumlah donasi"
					min="10000"
					max="1000000"
					step="1000"
					required
				/>
				<p>Minimum 1000, Maksimum 1000000</p>
			</div>
			<button
				class="w-full rounded-lg bg-slate-700 p-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
				type="submit"
				disabled={isLoading}
			>
				{#if isLoading}
					Loading
				{:else}
					Submit
				{/if}
			</button>
		</form>
	</div>
</section>
