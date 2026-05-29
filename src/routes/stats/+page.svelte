<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {onMount} from 'svelte';
    import {artists, days, stages, artistKey, groupByDay} from '$lib/data/artists';
    import {loadAllRatings} from '$lib/firebase';
    import {authStore} from '$lib/stores.svelte';
    import SpotifyArtistLink from '$lib/SpotifyArtistLink.svelte';

    let allRatings = $state<Record<string, Record<string, number>>>({});
    let loading = $state(true);
    let selectedDay = $state('All days');
    let selectedStage = $state('All scenes');
    let loadError = $state<string | null>(null);

    onMount(async () => {
        try {
            allRatings = await loadAllRatings();
            loadError = null;
        } catch (error) {
            console.error('Failed to load group ratings', error);
            loadError = 'Could not load group ratings right now. Please try again.';
            allRatings = {};
        } finally {
            loading = false;
        }
    });

    function toValidRating(value: unknown): number | null {
        if (typeof value !== 'number' || !Number.isFinite(value)) return null;
        const normalized = Math.round(value);
        if (normalized < 1 || normalized > 5) return null;
        return normalized;
    }

    type ArtistStat = {
        name: string;
        day: string;
        stage: string;
        startTime: string;
        genre: string;
        averageRating: number;
        raterCount: number;
        totalRaters: number;
        myRating: number;
        artistKey: string;
    };

    let stats = $derived<ArtistStat[]>(
        artists
            .filter((a) => (selectedDay === 'All days' || a.day === selectedDay) && (selectedStage === 'All scenes' || a.stage === selectedStage))
            .map((a) => {
                const key = artistKey(a);
                const userRatings = Object.values(allRatings)
                    .map((r) => toValidRating(r[key]))
                    .filter((r): r is number => r !== null);
                const average =
                    userRatings.length > 0
                        ? userRatings.reduce((sum, r) => sum + r, 0) / userRatings.length
                        : 0;
                return {
                    name: a.name,
                    day: a.day,
                    stage: a.stage,
                    startTime: a.startTime,
                    genre: a.genre,
                    averageRating: average,
                    raterCount: userRatings.length,
                    totalRaters: Object.keys(allRatings).length,
                    myRating: toValidRating(authStore.ratings[key]) ?? 0,
                    artistKey: key
                };
            })
            .sort((a, b) => b.averageRating - a.averageRating || b.raterCount - a.raterCount)
    );

    let groupHighlights = $derived(stats.filter((s) => s.raterCount >= 2).slice(0, 5));
    let statGroups = $derived(groupByDay(stats, selectedDay));
</script>

<Seo title="Stats"
     description="See which NorthSide 2026 artists are most popular. Aggregated ratings from all members."
     noindex={true}
/>

<div class="space-y-4">
    <h2 class="text-2xl font-bold">Artist Stats</h2>

    {#if loading}
        <p class="text-center text-surface-400 py-8">Loading ratings…</p>
    {:else if loadError}
        <p class="text-center text-error-500 py-8">{loadError}</p>
    {:else}
        <p class="text-sm text-surface-400">{Object.keys(allRatings).length} member(s) have rated artists.</p>

        {#if groupHighlights.length > 0}
            <div class="card preset-filled-primary-100-900 p-4 space-y-2">
                <p class="font-semibold text-sm uppercase tracking-wide">🔥 Group Favourites</p>
                {#each groupHighlights as s}
                    <div class="flex flex-col items-center justify-between text-sm">
                        <div class="flex items-center gap-2">
                            <span class="font-medium">{s.name}</span>
                            <SpotifyArtistLink name={s.name} />
                            <span class="text-surface-400">({s.day.slice(0, 3)}, {s.startTime}, {s.stage})</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-warning-500">{'★'.repeat(Math.round(s.averageRating))}</span>
                            <span class="text-surface-400 text-xs">{s.averageRating.toFixed(1)} · {s.raterCount} rated</span>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="flex gap-2">
            <button onclick={() => (selectedDay = 'All days')}
                    class="btn btn-sm"
                    class:preset-filled-tertiary-500={selectedDay === 'All days'}
                    class:preset-tonal-tertiary={selectedDay !== 'All days'}
                    aria-pressed={selectedDay === 'All days'}>
                All days
            </button>
            {#each days as day}
                <button onclick={() => (selectedDay = day)}
                        class="btn btn-sm grow"
                        class:preset-filled-tertiary-500={selectedDay === day}
                        class:preset-tonal-tertiary={selectedDay !== day}
                        aria-pressed={selectedDay === day}>
                    {day}
                </button>
            {/each}
        </div>

        <div class="flex flex-wrap gap-2">
            <button onclick={() => (selectedStage = 'All scenes')}
                    class="btn btn-sm"
                    class:preset-filled-secondary-500={selectedStage === 'All scenes'}
                    class:preset-tonal-secondary={selectedStage !== 'All scenes'}
                    aria-pressed={selectedStage === 'All scenes'}>
                All scenes
            </button>
            {#each stages as stage}
                <button onclick={() => (selectedStage = stage)}
                        class="btn btn-sm grow"
                        class:preset-filled-secondary-500={selectedStage === stage}
                        class:preset-tonal-secondary={selectedStage !== stage}
                        aria-pressed={selectedStage === stage}>
                    {stage}
                </button>
            {/each}
        </div>

        <div class="space-y-4">
            {#if stats.length === 0}
                <p class="text-center text-surface-400 py-8">
                    No artists{selectedDay !== 'All days' ? ` for ${selectedDay}` : ''}{selectedStage !== 'All scenes' ? ` at ${selectedStage}` : ''}.
                </p>
            {:else}
                {#each statGroups as group (group.day)}
                    <section class="space-y-2">
                        <h3 class="text-sm font-semibold uppercase tracking-wide text-surface-400">{group.day}</h3>
                        {#each group.items as s (s.artistKey)}
                            <div class="card preset-tonal p-4">
                                <div class="flex items-start justify-between gap-4">
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2">
                                            <p class="font-semibold leading-tight">{s.name}</p>
                                            <SpotifyArtistLink name={s.name} />
                                        </div>
                                        <p class="text-xs opacity-50">{s.genre} · {s.stage} · {s.day.slice(0, 3)} {s.startTime}</p>
                                    </div>
                                    <div class="text-right shrink-0">
                                        {#if s.averageRating > 0}
                                            <p class="text-warning-500 text-sm">{'★'.repeat(Math.round(s.averageRating))}</p>
                                            <p class="text-xs text-surface-400">{s.averageRating.toFixed(1)} avg · {s.raterCount}/{s.totalRaters}</p>
                                        {:else}
                                            <p class="text-xs text-surface-300">Not rated yet</p>
                                        {/if}
                                    </div>
                                </div>
                                {#if s.myRating > 0}
                                    <p class="text-xs text-surface-400 mt-1">You: {'★'.repeat(s.myRating)}</p>
                                {/if}
                            </div>
                        {/each}
                    </section>
                {/each}
            {/if}
        </div>
    {/if}
</div>
