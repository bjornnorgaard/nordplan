<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {days, groupByDay, nordiskDansProgram, programKey} from '$lib/data/nordiskDansProgram';

    let programEvents = $derived(
        [...nordiskDansProgram].sort(
            (a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.startTime.localeCompare(b.startTime)
        )
    );

    let programGroups = $derived(groupByDay(programEvents));
</script>

<Seo title="Tidsplan"
     description="Nordisk Dans program for NorthSide 2026."
     noindex={true}
/>

<div class="space-y-3">
    {#each programGroups as group (group.day)}
        <section class="space-y-1">
            <h3 class="text-sm font-bold uppercase tracking-wide">{group.day}</h3>
            {#each group.items as event (programKey(event))}
                <div class="card preset-tonal-primary px-3 py-2 grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 text-sm">
                    <p class="col-span-2 font-mono">{event.startTime} – {event.endTime}</p>
                    <p class="font-medium min-w-0 opacity-50">{event.name}</p>
                    <p class="text-xs opacity-60 justify-self-end">{event.stage}</p>
                </div>
            {/each}
        </section>
    {/each}
</div>
