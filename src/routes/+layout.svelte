<script lang="ts">
    import './layout.css';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {browser} from '$app/environment';
    import {authStore} from '$lib/stores.svelte';
    import {signOutUser} from '$lib/firebase';
    import faviconByBear from '$lib/assets/favicon/favicon-bybear.png';

    let {children} = $props();

    const navItems = [
        {href: '/artists', label: 'Artists'},
        {href: '/schedule', label: 'My Schedule'},
        {href: '/stats', label: 'Stats'}
    ];

    $effect(() => {
        if (browser && !authStore.loading && !authStore.user && page.url.pathname !== '/login') {
            goto('/login');
        }
    });
</script>

<svelte:head>
    <link rel="icon" type="image/png" href={faviconByBear}/>
</svelte:head>

<div class="min-h-screen bg-surface-50-950 text-surface-950-50 flex flex-col">
    {#if authStore.user}
        <header class="bg-primary-500 text-white shadow-sm">
            <div class="max-w-2xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <a href="/artists" class="flex items-baseline gap-1 font-bold tracking-tight">
                    <span class="text-lg">NordPlan</span>
                    <span class="text-[0.65rem] font-medium uppercase tracking-[0.08em] opacity-75">by bear</span>
                </a>
                <nav class="order-3 w-full flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium sm:order-0 sm:w-auto">
                    {#each navItems as item}
                        <a href={item.href} class="hover:underline {page.url.pathname === item.href ? 'underline' : ''}" aria-current={page.url.pathname === item.href ? 'page' : undefined}>
                            {item.label}
                        </a>
                    {/each}
                </nav>
                <button onclick={signOutUser} class="btn btn-sm preset-tonal-surface text-white border border-white/30">
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
