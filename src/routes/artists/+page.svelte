<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {artists, days, artistKey} from '$lib/data/artists';
    import {authStore} from '$lib/stores.svelte';

    let selectedDay = $state('Thursday');
    let searchQuery = $state('');

    let filtered = $derived(
        artists.filter(
            (a) =>
                a.day === selectedDay &&
                (searchQuery === '' ||
                    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.genre.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    );

    function handleRating(key: string, rating: number) {
        const current = authStore.ratings[key] ?? 0;
        authStore.setRating(key, current === rating ? 0 : rating);
    }
</script>

<Seo title="Artists"
     description="Browse and rate all NorthSide 2026 artists by day. Add favourites to your personal schedule."
     noindex={true}
/>

<div class="space-y-4">
    <h2 class="text-2xl font-bold">Artists</h2>

    <div class="flex flex-col gap-4">
        <div class="flex gap-4">
            {#each days as day}
                <button onclick={() => (selectedDay = day)}
                        class="btn btn-sm"
                        class:preset-filled-primary-500={selectedDay === day}
                        class:preset-tonal-surface={selectedDay !== day}
                        aria-pressed={selectedDay === day}>
                    {day}
                </button>
            {/each}
        </div>

        <input class="input"
               type="search"
               placeholder="Search artists or genres…"
               bind:value={searchQuery}
        />
    </div>

    <div class="space-y-4">
        {#each filtered as artist}
            {@const key = artistKey(artist)}
            {@const myRating = authStore.ratings[key] ?? 0}
            {@const inSchedule = authStore.schedule.includes(key)}
            <div class="card preset-tonal-primary p-4 flex flex-col gap-1">
                <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                        <p class="font-semibold leading-tight">{artist.name}</p>
                        <p class="text-sm text-surface-500">{artist.genre}</p>
                    </div>
                    <div class="text-right text-xs text-surface-400 shrink-0">
                        <p>{artist.stage}</p>
                        <p>{artist.startTime}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-1">
                    <div class="flex gap-1" aria-label="Rate {artist.name}">
                        {#each [1, 2, 3, 4, 5] as star}
                            <button
                                    onclick={() => handleRating(key, star)}
                                    class="text-xl leading-none transition-transform hover:scale-110 {star <= myRating ? 'text-warning-500' : 'text-surface-300'}"
                                    aria-pressed={star === myRating}
                                    aria-label="Rate {artist.name} {star} star{star > 1 ? 's' : ''}"
                            >★
                            </button>
                        {/each}
                    </div>
                    <button
                            onclick={() => authStore.toggleSchedule(key)}
                            class="btn btn-sm {inSchedule ? 'preset-filled-success-500' : 'preset-tonal-surface'} text-xs"
                    >
                        {inSchedule ? '✓ In schedule' : '+ Schedule'}
                    </button>
                </div>
            </div>
        {/each}

        {#if filtered.length === 0}
            <p class="text-center text-surface-400 py-8">No artists found.</p>
        {/if}
    </div>
</div>
