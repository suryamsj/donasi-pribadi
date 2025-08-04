<script lang="ts">
	import {
		PUBLIC_PUSHER_CHANNEL,
		PUBLIC_PUSHER_CLUSTER,
		PUBLIC_PUSHER_KEY
	} from '$env/static/public';
	import Pusher from 'pusher-js';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let statusMessage = $state({
		showMessage: false,
		message: '',
		amount: 0
	});
	let audio: HTMLAudioElement;
	let audioAllowed = $state(false);

	const enableAudio = () => {
		audio
			.play()
			.then(() => {
				audio.pause();
				audioAllowed = true;
			})
			.catch((err) => {
				console.warn('User belum mengizinkan audio:', err);
			});
	};

	$effect(() => {
		const pusher = new Pusher(PUBLIC_PUSHER_KEY, {
			cluster: PUBLIC_PUSHER_CLUSTER
		});
		const channel = pusher.subscribe(PUBLIC_PUSHER_CHANNEL);
		channel.bind('notification', (data: { message: string; amount?: number }) => {
			statusMessage = {
				showMessage: true,
				message: data.message,
				amount: data.amount || 0
			};

			try {
				audio.play();
			} catch (error) {
				console.log('Audio play failed:', error);
			}

			// Hide after 8 seconds
			setTimeout(() => {
				statusMessage = {
					showMessage: false,
					message: '',
					amount: 0
				};
			}, 8000);
		});

		return () => {
			channel.unbind_all();
			pusher.unsubscribe(PUBLIC_PUSHER_CHANNEL);
		};
	});

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Donation Overlay</title>
</svelte:head>

<!-- Audio Permission Banner -->
{#if !audioAllowed}
	<div class="fixed top-0 left-0 z-50 w-full border-b border-yellow-200 bg-yellow-100 py-3">
		<div class="text-center">
			<p class="mb-2 text-sm text-yellow-800">
				Klik tombol di bawah untuk mengaktifkan suara notifikasi donasi
			</p>
			<button
				onclick={enableAudio}
				class="inline-flex items-center gap-2 rounded-xl bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a1 1 0 01-1-1V9a1 1 0 011-1h1a1 1 0 011 1v2a1 1 0 01-1 1H9z"
					></path>
				</svg>
				Aktifkan Suara Donasi
			</button>
		</div>
	</div>
{/if}

<!-- Main Overlay Container -->
<div class="pointer-events-none fixed inset-0">
	{#if statusMessage.showMessage}
		<div
			class="pointer-events-auto fixed top-8 right-8 z-50"
			transition:fly={{ x: 300, duration: 500, easing: quintOut }}
		>
			<!-- Notification Card -->
			<div class="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<!-- Header Section -->
				<div class="mb-6 flex items-center space-x-3">
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
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							></path>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-slate-800">Donasi Baru!</h3>
						<p class="text-sm text-slate-600">Terima kasih atas kebaikan Anda</p>
					</div>
				</div>

				<!-- Donation Information Section -->
				<div class="space-y-4">
					{#if statusMessage.amount > 0}
						<div class="flex items-center justify-between border-b border-slate-100 pb-3">
							<span class="text-sm font-medium text-slate-600">Jumlah:</span>
							<span class="text-lg font-bold text-emerald-600">
								{formatCurrency(statusMessage.amount)}
							</span>
						</div>
					{/if}

					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-slate-600">Waktu:</span>
						<span class="text-sm text-slate-800">
							{new Date().toLocaleTimeString('id-ID', {
								hour: '2-digit',
								minute: '2-digit'
							})}
						</span>
					</div>
				</div>

				<!-- Message Section -->
				{#if statusMessage.message}
					<div class="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
						<p class="text-center text-sm text-slate-700 italic">
							\"{statusMessage.message}\"
						</p>
					</div>
				{/if}

				<!-- Status Badge Section -->
				<div class="mt-6 flex justify-center">
					<span
						class="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-xs font-medium text-emerald-800"
					>
						<svg class="mr-2 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						Donasi Diterima
					</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Audio Element -->
<audio bind:this={audio} src="/audio/donasi-sound.mp3" preload="auto" hidden></audio>

<!-- Development Debug Info -->
{#if import.meta.env.DEV}
	<div class="fixed bottom-4 left-4 rounded-xl bg-slate-800 px-4 py-2 text-xs text-white shadow-sm">
		<div class="flex items-center space-x-2">
			<div class="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
			<span>OBS Overlay Ready - Waiting for donations...</span>
		</div>
	</div>
{/if}
