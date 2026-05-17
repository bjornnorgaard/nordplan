<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {artists, days, artistKey} from '$lib/data/artists';
    import {authStore} from '$lib/stores.svelte';

    let selectedDay = $state('Thursday');

    let scheduleArtists = $derived(
        artists.filter((a) => authStore.schedule.includes(artistKey(a)) && a.day === selectedDay)
    );

    let scheduleCount = $derived(authStore.schedule.length);
</script>

<Seo title="My Schedule"
     description="Your personal NorthSide 2026 schedule. See all the artists you've saved, sorted by day and time."
     noindex={true}
/>

<div class="space-y-4">
    <div class="flex items-baseline justify-between">
        <h2 class="text-2xl font-bold">My Schedule</h2>
        <span class="text-sm opacity-50">{scheduleCount} total</span>
    </div>

    {#if scheduleCount === 0}
        <div class="card preset-filled-surface-100-900 p-8 text-center text-surface-400">
            <p>Your schedule is empty.</p>
            <p class="text-sm mt-1">Go to Artists and tap <em>+ Schedule</em> to add artists.</p>
        </div>
    {:else}
        <div class="flex gap-4">
            {#each days as day}
                {@const count = artists.filter((a) => authStore.schedule.includes(artistKey(a)) && a.day === day).length}
                <button onclick={() => (selectedDay = day)} class="btn btn-sm"
                        class:preset-filled-primary-500={selectedDay === day}
                        class:preset-tonal-surface={selectedDay !== day}
                        aria-pressed={selectedDay === day}>
                    {day} {count > 0 ? `(${count})` : ''}
                </button>
            {/each}
        </div>

        {#if scheduleArtists.length === 0}
            <p class="text-center text-surface-400 py-8">No artists from {selectedDay} in your schedule.</p>
        {:else}
            <div class="space-y-4">
                {#each scheduleArtists.sort((a, b) => a.startTime.localeCompare(b.startTime)) as artist}
                    {@const key = artistKey(artist)}
                    {@const myRating = authStore.ratings[key] ?? 0}
                    <div class="card preset-filled-surface-100-900 p-4 flex items-center gap-3">
                        <div class="text-center shrink-0 w-12">
                            <p class="font-mono text-sm font-bold">{artist.startTime}</p>
                            <p class="text-xs text-surface-400">{artist.stage}</p>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold leading-tight">{artist.name}</p>
                            <p class="text-sm text-surface-500">{artist.genre}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            {#if myRating > 0}
                                <span class="text-warning-500 text-sm">{'★'.repeat(myRating)}</span>
                            {/if}
                            <button
                                    onclick={() => authStore.toggleSchedule(key)}
                                    class="btn btn-sm preset-tonal-error text-xs"
                                    aria-label="Remove {artist.name} from schedule"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>
