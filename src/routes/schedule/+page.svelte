<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {artists, days, stages, artistKey, groupByDay} from '$lib/data/artists';
    import {authStore} from '$lib/stores.svelte';

    let selectedDay = $state('All days');
    let selectedStage = $state('All scenes');

    let scheduleArtists = $derived(
        artists
            .filter(
                (a) =>
                    authStore.schedule.includes(artistKey(a)) &&
                    (selectedDay === 'All days' || a.day === selectedDay) &&
                    (selectedStage === 'All scenes' || a.stage === selectedStage)
            )
            .sort(
                (a, b) =>
                    days.indexOf(a.day) - days.indexOf(b.day) || a.startTime.localeCompare(b.startTime)
            )
    );

    let scheduleGroups = $derived(groupByDay(scheduleArtists, selectedDay));

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
            <button onclick={() => (selectedDay = 'All days')} class="btn btn-sm"
                    class:preset-filled-primary-500={selectedDay === 'All days'}
                    class:preset-tonal-surface={selectedDay !== 'All days'}
                    aria-pressed={selectedDay === 'All days'}>
                All days
            </button>
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

        <div class="flex flex-wrap gap-2">
            <button onclick={() => (selectedStage = 'All scenes')}
                    class="btn btn-sm"
                    class:preset-filled-secondary-500={selectedStage === 'All scenes'}
                    class:preset-tonal-surface={selectedStage !== 'All scenes'}
                    aria-pressed={selectedStage === 'All scenes'}>
                All scenes
            </button>
            {#each stages as stage}
                <button onclick={() => (selectedStage = stage)}
                        class="btn btn-sm"
                        class:preset-filled-secondary-500={selectedStage === stage}
                        class:preset-tonal-surface={selectedStage !== stage}
                        aria-pressed={selectedStage === stage}>
                    {stage}
                </button>
            {/each}
        </div>

        {#if scheduleArtists.length === 0}
            <p class="text-center text-surface-400 py-8">
                No artists{selectedDay !== 'All days' ? ` from ${selectedDay}` : ''}{selectedStage !== 'All scenes' ? ` at ${selectedStage}` : ''} in your schedule.
            </p>
        {:else}
            <div class="space-y-4">
                {#each scheduleGroups as group (group.day)}
                    <section class="space-y-2">
                        <h3 class="text-sm font-semibold uppercase tracking-wide text-surface-400">{group.day}</h3>
                        {#each group.items as artist (artistKey(artist))}
                            {@const key = artistKey(artist)}
                            {@const myRating = authStore.ratings[key] ?? 0}
                            <div class="card preset-tonal-primary p-4 flex items-center gap-4">
                                <div class="">
                                    <p class="font-mono text-sm font-bold">{artist.startTime}</p>
                                    <p class="text-sm opacity-80">{artist.stage}</p>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-semibold">{artist.name}</p>
                                    <p class="text-sm opacity-50">{artist.genre}</p>
                                </div>
                                <div class="flex items-center gap-4">
                                    {#if myRating > 0}
                                        <span class="text-sm">{'★'.repeat(myRating)}</span>
                                    {/if}
                                    <button onclick={() => authStore.toggleSchedule(key)}
                                            class="btn-icon btn-icon-sm preset-tonal-error"
                                            aria-label="Remove {artist.name} from schedule">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </section>
                {/each}
            </div>
        {/if}
    {/if}
</div>
