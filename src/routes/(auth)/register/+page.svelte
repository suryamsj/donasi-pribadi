<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { form } = $props();
	let isLoading = $state(false);
	let showAlert = $state({
		show: false,
		type: '',
		message: ''
	});
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let password = $state('');
	let confirmPassword = $state('');

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					showAlert.show = true;
					showAlert.type = 'success';
					showAlert.message = result.data?.message || 'Registrasi berhasil!';
					break;
				case 'failure':
					showAlert.show = true;
					showAlert.type = 'error';
					showAlert.message = result.data?.message || 'Registrasi gagal!';
					break;
			}
			isLoading = false;
			await update();
		};
	};

	function togglePassword() {
		showPassword = !showPassword;
	}

	function toggleConfirmPassword() {
		showConfirmPassword = !showConfirmPassword;
	}
</script>

<svelte:head>
	<title>Register - Donasi Pribadi</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-light text-slate-800">Daftar</h1>
			<p class="text-sm text-slate-600">Buat akun admin untuk dashboard donasi</p>
		</div>

		<!-- Alert -->
		{#if showAlert.show}
			<div class="mb-6">
				<Alert type={showAlert.type} message={showAlert.message} />
			</div>
		{/if}

		<!-- Register Card -->
		<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<form class="space-y-6" method="post" use:enhance={handleSubmit}>
				<!-- Name -->
				<div class="space-y-2">
					<label for="name" class="block text-sm font-medium text-slate-700"> Nama Lengkap </label>
					<input
						type="text"
						name="name"
						id="name"
						class="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
						placeholder="Masukkan nama lengkap"
						autocomplete="name"
					/>
					{#if form?.errors?.name}
						<p class="text-xs text-red-500">{form?.errors?.name}</p>
					{:else}
						<p class="text-xs text-slate-500">Nama harus diisi</p>
					{/if}
				</div>

				<!-- Username -->
				<div class="space-y-2">
					<label for="username" class="block text-sm font-medium text-slate-700"> Username </label>
					<input
						type="text"
						name="username"
						id="username"
						class="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
						placeholder="Masukkan username"
						autocomplete="username"
						minlength="3"
					/>
					{#if form?.errors?.username}
						<p class="text-xs text-red-500">{form?.errors?.username}</p>
					{:else}
						<p class="text-xs text-slate-500">
							Minimal 3 karakter, hanya huruf, angka, dan underscore
						</p>
					{/if}
				</div>

				<!-- Password -->
				<div class="space-y-2">
					<label for="password" class="block text-sm font-medium text-slate-700"> Password </label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							name="password"
							id="password"
							bind:value={password}
							class="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 placeholder-slate-400
								transition-colors focus:border-slate-400"
							placeholder="Masukkan password"
							autocomplete="new-password"
							minlength="6"
						/>
						<button
							type="button"
							onclick={togglePassword}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 transition-colors hover:text-slate-600"
						>
							{#if showPassword}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									></path>
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									></path>
								</svg>
							{/if}
						</button>
					</div>
					{#if form?.errors?.password}
						<p class="text-xs text-red-500">{form?.errors?.password}</p>
					{:else}
						<p class="text-xs text-slate-500">Minimal 6 karakter</p>
					{/if}
				</div>

				<!-- Confirm Password -->
				<div class="space-y-2">
					<label for="confirmPassword" class="block text-sm font-medium text-slate-700">
						Konfirmasi Password
					</label>
					<div class="relative">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							name="confirmPassword"
							id="confirmPassword"
							bind:value={confirmPassword}
							class="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 placeholder-slate-400
								transition-colors focus:border-slate-400"
							placeholder="Konfirmasi password"
							autocomplete="new-password"
						/>
						<button
							type="button"
							onclick={toggleConfirmPassword}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 transition-colors hover:text-slate-600"
						>
							{#if showConfirmPassword}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									></path>
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									></path>
								</svg>
							{/if}
						</button>
					</div>
					{#if form?.errors?.confirmPassword}
						<p class="text-xs text-red-500">{form?.errors?.confirmPassword}</p>
					{:else}
						<p class="text-xs text-slate-500">Konfirmasi password harus sama dengan password</p>
					{/if}
				</div>

				<!-- Submit Button -->
				<button
					class="w-full rounded-xl px-6 py-4 font-medium transition-colors disabled:cursor-not-allowed
						{!isLoading
						? 'bg-slate-800 text-white hover:bg-slate-900'
						: 'cursor-not-allowed bg-slate-300 text-slate-500'}"
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
						Daftar
					{/if}
				</button>
			</form>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center">
			<p class="text-xs text-slate-500">Dashboard Admin Donasi Pribadi</p>
			<p class="mt-1 text-xs text-slate-400">Hanya admin yang dapat mengakses dashboard</p>
		</div>
	</div>
</div>
