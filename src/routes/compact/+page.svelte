<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {artists, days, stages, artistKey, groupByDay} from '$lib/data/artists';

    let selectedDay = $state('All days');
    let selectedStage = $state('All scenes');

    let filtered = $derived(
        artists
            .filter(
                (a) =>
                    (selectedDay === 'All days' || a.day === selectedDay) &&
                    (selectedStage === 'All scenes' || a.stage === selectedStage)
            )
            .sort(
                (a, b) =>
                    days.indexOf(a.day) - days.indexOf(b.day) ||
                    a.startTime.localeCompare(b.startTime) ||
                    a.name.localeCompare(b.name)
            )
    );

    let dayGroups = $derived(groupByDay(filtered, selectedDay));
</script>

<Seo title="Compact"
     description="Compact NorthSide 2026 artist list by day, time, and stage."
     noindex={true}
/>

<div class="space-y-4">
    <div class="flex items-baseline justify-between gap-4">
        <h2 class="text-2xl font-bold">Compact</h2>
        <a href="/artists" class="anchor text-sm">artist view</a>
    </div>

    <div class="flex flex-col gap-4">
        <div class="flex gap-2">
            <button onclick={() => (selectedDay = 'All days')}
                    class="btn btn-sm"
                    class:preset-filled-tertiary-500={selectedDay === 'All days'}
                    class:preset-tonal-tertiary={selectedDay !== 'All days'}
                    aria-pressed={selectedDay === 'All days'}>
                All days
            </button>
            {#each days as day (day)}
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
            {#each stages as stage (stage)}
                <button onclick={() => (selectedStage = stage)}
                        class="btn btn-sm grow"
                        class:preset-filled-secondary-500={selectedStage === stage}
                        class:preset-tonal-secondary={selectedStage !== stage}
                        aria-pressed={selectedStage === stage}>
                    {stage}
                </button>
            {/each}
        </div>
    </div>

    <div class="space-y-3 p-4">
        {#each dayGroups as group (group.day)}
            <section class="flex flex-col items-center">
                <h3 class="font-bold uppercase tracking-wider opacity-50">{group.day}</h3>
                {#each group.items as artist (artistKey(artist))}
                    <p class="text-sm truncate">
                        <span class="font-medium">{artist.name}</span>
                        <span class="text-surface-400"> · {artist.startTime} · {artist.stage}</span>
                    </p>
                {/each}
            </section>
        {/each}

        {#if filtered.length === 0}
            <p class="text-center text-surface-400 py-8">No artists found.</p>
        {/if}
    </div>
</div>
