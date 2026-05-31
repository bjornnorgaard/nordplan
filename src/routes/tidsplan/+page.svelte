<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {days, groupByDay, nordiskDansProgram, programKey} from '$lib/data/nordiskDansProgram';

    let selectedDay = $state('All days');

    let programEvents = $derived(
        nordiskDansProgram
            .filter((event) => selectedDay === 'All days' || event.day === selectedDay)
            .sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.startTime.localeCompare(b.startTime))
    );

    let programGroups = $derived(groupByDay(programEvents, selectedDay));
</script>

<Seo title="Tidsplan"
     description="Nordisk Dans program for NorthSide 2026."
     noindex={true}
/>

<div class="space-y-4">
    <div class="flex items-baseline justify-between">
        <h2 class="text-2xl font-bold">Tidsplan</h2>
        <span class="text-sm opacity-50">{programEvents.length} events</span>
    </div>

    <div class="flex gap-2">
        <button onclick={() => (selectedDay = 'All days')}
                class="btn btn-sm"
                class:preset-filled-tertiary-500={selectedDay === 'All days'}
                class:preset-tonal-tertiary={selectedDay !== 'All days'}
                aria-pressed={selectedDay === 'All days'}
        >
            All days
        </button>
        {#each days as day (day)}
            <button
                    onclick={() => (selectedDay = day)}
                    class="btn btn-sm grow"
                    class:preset-filled-tertiary-500={selectedDay === day}
                    class:preset-tonal-tertiary={selectedDay !== day}
                    aria-pressed={selectedDay === day}
            >
                {day}
            </button>
        {/each}
    </div>

    <div class="space-y-4">
        {#each programGroups as group (group.day)}
            <section class="space-y-2">
                <h3 class="text-sm font-semibold uppercase tracking-wide text-surface-400">{group.day}</h3>
                {#each group.items as event (programKey(event))}
                    <div class="card preset-tonal-primary p-4 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-1 items-baseline">
                        <p class="font-mono text-sm font-bold">{event.startTime}</p>
                        <p class="font-semibold">{event.name}</p>
                        <p class="font-mono text-sm opacity-70">{event.endTime}</p>
                        <p class="text-sm opacity-80">{event.stage}</p>
                    </div>
                {/each}
            </section>
        {/each}
    </div>
</div>
