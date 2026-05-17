<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores.svelte';
	import { signOutUser } from '$lib/firebase';

	let { children } = $props();

	const navItems = [
		{ href: '/artists', label: 'Artists' },
		{ href: '/schedule', label: 'My Schedule' },
		{ href: '/stats', label: 'Group Stats' }
	];

	$effect(() => {
		if (browser && !authStore.loading && !authStore.user && $page.url.pathname !== '/login') {
			goto('/login');
		}
	});
</script>

<div class="min-h-screen bg-surface-50-950 text-surface-950-50 flex flex-col">
	{#if authStore.user}
		<header class="bg-primary-500 text-white shadow-sm">
			<div class="max-w-2xl mx-auto px-4 py-3 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
				<a href="/artists" class="font-bold text-lg tracking-tight">nordplan 🎵</a>
				<nav class="flex flex-wrap justify-center gap-4 text-sm font-medium sm:justify-start">
					{#each navItems as item}
						<a
							href={item.href}
							aria-current={$page.url.pathname === item.href ? 'page' : undefined}
							class="hover:underline {$page.url.pathname === item.href ? 'underline' : ''}"
						>
							{item.label}
						</a>
					{/each}
				</nav>
				<button
					onclick={signOutUser}
					class="btn btn-sm preset-tonal-surface text-white border border-white/30"
				>
					Sign out
				</button>
			</div>
		</header>
	{/if}

	<main class="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
		{#if authStore.loading}
			<div class="flex items-center justify-center h-40">
				<span class="text-surface-400">Loading…</span>
			</div>
		{:else}
			{@render children()}
		{/if}
	</main>
</div>

