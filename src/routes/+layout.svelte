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
        {href: '/nordisk', label: 'Nordisk'},
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
        <header class="bg-primary-500 text-white drop-shadow-2xl">
            <div class="max-w-2xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
                <a href="/artists" class="flex items-baseline gap-2 font-bold tracking-tight">
                    <span class="text-xl">NordPlan</span>
                    <span class="text-xs tracking-widest opacity-50">byBear</span>
                </a>
                <nav class="order-3 w-full flex flex-wrap gap-4 text-sm sm:order-0 sm:w-auto">
                    {#each navItems as item}
                        <a href={item.href} class="chip" class:preset-tonal-primary={page.url.pathname === item.href}
                           aria-current={page.url.pathname === item.href ? 'page' : undefined}>
                            {item.label}
                        </a>
                    {/each}
                </nav>
                <button onclick={signOutUser} class="btn btn-sm">
                    Sign out
                </button>
            </div>
        </header>
    {/if}

    <main class="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {#if authStore.loading}
            <div class="flex items-center justify-center h-40">
                <span class="text-surface-400">Loading…</span>
            </div>
        {:else}
            {@render children()}
        {/if}
    </main>
</div>
