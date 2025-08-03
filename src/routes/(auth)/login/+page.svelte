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
	let showPassword = $state(false);

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					showAlert.show = true;
					showAlert.type = 'success';
					showAlert.message = 'Login berhasil! Mengalihkan ke dashboard...';
					setTimeout(() => {
						window.location.href = '/dashboard';
					}, 1500);
					break;
				case 'failure':
					showAlert.show = true;
					showAlert.type = 'error';
					showAlert.message = result.data?.message || 'Username atau password salah!';
					break;
			}
			isLoading = false;
			await update();
		};
	};

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Login - Donasi Pribadi</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-light text-slate-800">Masuk</h1>
			<p class="text-sm text-slate-600">Masuk ke dashboard admin donasi</p>
		</div>

		<!-- Alert -->
		{#if showAlert.show}
			<div class="mb-6">
				<Alert type={showAlert.type} message={showAlert.message} />
			</div>
		{/if}

		<!-- Login Card -->
		<div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
			<form class="space-y-6" action="" method="post" use:enhance={handleSubmit}>
				<!-- Username -->
				<div class="space-y-2">
					<label for="username" class="block text-sm font-medium text-slate-700"> Username </label>
					<input
						type="text"
						name="username"
						id="username"
						class="w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
						placeholder="Masukkan username"
						required
						autocomplete="username"
					/>
				</div>

				<!-- Password -->
				<div class="space-y-2">
					<label for="password" class="block text-sm font-medium text-slate-700"> Password </label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							name="password"
							id="password"
							class="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 placeholder-slate-400 transition-colors focus:border-slate-400 focus:ring-0"
							placeholder="Masukkan password"
							required
							autocomplete="current-password"
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
						Masuk
					{/if}
				</button>
			</form>

			<!-- Register Link -->
			<div class="mt-6 text-center">
				<p class="text-sm text-slate-600">
					Belum punya akun?
					<a
						href="/register"
						class="font-medium text-slate-800 transition-colors hover:text-slate-900"
					>
						Daftar di sini
					</a>
				</p>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center">
			<p class="text-xs text-slate-500">Dashboard Admin Donasi Pribadi</p>
		</div>
	</div>
</div>
