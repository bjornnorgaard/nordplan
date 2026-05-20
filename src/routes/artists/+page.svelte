<script lang="ts">
    import Seo from '$lib/Seo.svelte';
    import {artists, days, stages, artistKey} from '$lib/data/artists';
    import {authStore} from '$lib/stores.svelte';
    import {RatingGroup} from '@skeletonlabs/skeleton-svelte';

    function timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function minutesToTime(totalMinutes: number): string {
        const safeMinutes = Math.min(Math.max(totalMinutes, 0), 23 * 60 + 59);
        const hours = Math.floor(safeMinutes / 60);
        const minutes = safeMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    let selectedDay = $state('Thursday');
    let selectedStage = $state('All scenes');
    let searchQuery = $state('');
    let nowMinutes = $state(new Date().getHours() * 60 + new Date().getMinutes());
    let currentWeekday = $state(new Date().toLocaleDateString('en-US', {weekday: 'long'}));
    let currentMonth = $state(new Date().getMonth());
    let currentDayOfMonth = $state(new Date().getDate());
    const assumedSetDurationMinutes = 60;
    const festivalDateByDay: Record<string, number> = {
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    };

    $effect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            nowMinutes = now.getHours() * 60 + now.getMinutes();
            currentWeekday = now.toLocaleDateString('en-US', {weekday: 'long'});
            currentMonth = now.getMonth();
            currentDayOfMonth = now.getDate();
        }, 60_000);

        return () => clearInterval(intervalId);
    });

    let filtered = $derived(
        artists
            .filter(
                (a) =>
                    a.day === selectedDay &&
                    (selectedStage === 'All scenes' || a.stage === selectedStage) &&
                    (searchQuery === '' ||
                        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.genre.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime) || a.name.localeCompare(b.name))
    );

    let nowLabel = $derived(minutesToTime(nowMinutes));
    let showNowInsert = $derived(
        currentMonth === 5 &&
        festivalDateByDay[selectedDay] === currentDayOfMonth &&
        currentWeekday === selectedDay
    );
    let nowInsertIndex = $derived(filtered.findIndex((artist) => timeToMinutes(artist.startTime) + assumedSetDurationMinutes > nowMinutes));
    let normalizedNowInsertIndex = $derived(nowInsertIndex === -1 ? filtered.length : nowInsertIndex);

    function handleRating(key: string, rating: number) {
        const current = authStore.ratings[key] ?? 0;
        authStore.setRating(key, current === rating ? 0 : rating);
    }

    function clearRatingOnRepeatClick(event: MouseEvent, key: string, rating: number) {
        const current = authStore.ratings[key] ?? 0;
        if (current !== rating) return;

        // Stop default item selection so an already-selected value can toggle off.
        event.preventDefault();
        event.stopPropagation();
        authStore.setRating(key, 0);
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
            {#each days as day (day)}
                <button onclick={() => (selectedDay = day)}
                        class="btn btn-sm"
                        class:preset-filled-primary-500={selectedDay === day}
                        class:preset-tonal-surface={selectedDay !== day}
                        aria-pressed={selectedDay === day}>
                    {day}
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
            {#each stages as stage (stage)}
                <button onclick={() => (selectedStage = stage)}
                        class="btn btn-sm"
                        class:preset-filled-secondary-500={selectedStage === stage}
                        class:preset-tonal-surface={selectedStage !== stage}
                        aria-pressed={selectedStage === stage}>
                    {stage}
                </button>
            {/each}
        </div>

        <input class="input"
               type="search"
               placeholder="Search artists or genres…"
               bind:value={searchQuery}
        />
    </div>

    <div class="space-y-2">
        {#each filtered as artist, index (artistKey(artist))}
            {#if showNowInsert && index === normalizedNowInsertIndex}
                <div class="card preset-filled-primary-500 p-3">
                    <p class="text-sm font-semibold">Now: {nowLabel}</p>
                    <p class="text-xs opacity-80">Artists below are likely still playing or upcoming.</p>
                </div>
            {/if}

            {@const key = artistKey(artist)}
            {@const myRating = authStore.ratings[key] ?? 0}
            {@const inSchedule = authStore.schedule.includes(key)}
            {@const isPlayed = showNowInsert && index < normalizedNowInsertIndex}
            {@const artistStartMinutes = timeToMinutes(artist.startTime)}
            {@const isLikelyPlaying = showNowInsert && artistStartMinutes <= nowMinutes && artistStartMinutes + assumedSetDurationMinutes > nowMinutes}
            <div class="card p-4 flex flex-col gap-2"
                 class:preset-tonal-surface={isPlayed}
                 class:preset-tonal-primary={!isPlayed}
                 class:opacity-75={isPlayed}
                 class:ring-1={isLikelyPlaying}
                 class:ring-primary-500={isLikelyPlaying}>
                <div class="flex items-start justify-between">
                    <div class="min-w-0">
                        <div class="flex items-center gap-2">
                            <p class="font-semibold leading-tight">{artist.name}</p>
                            {#if isLikelyPlaying}
                                <span class="badge preset-tonal text-xs uppercase tracking-wide">Playing now</span>
                            {/if}
                        </div>
                        <p class="text-xs opacity-60">{artist.genre}</p>
                    </div>
                    <div class="flex text-right text-xs opacity-70 gap-2 uppercase badge"
                         class:preset-tonal-primary={!isPlayed}
                         class:preset-tonal-surface={isPlayed}>
                        <p>{artist.startTime}</p>
                        <p class="font-bold">{artist.stage}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-2">
                    <RatingGroup count={5}
                                 value={myRating}
                                 onValueChange={(details) => handleRating(key, details.value)}>
                        <RatingGroup.Label class="sr-only">Rate {artist.name}</RatingGroup.Label>
                        <RatingGroup.Control>
                            <RatingGroup.Context>
                                {#snippet children(ratingGroup)}
                                    <div class="flex gap-1">
                                        {#each ratingGroup().items as index (index)}
                                            <RatingGroup.Item index={index} onclick={(event) => clearRatingOnRepeatClick(event, key, index)}/>
                                        {/each}
                                    </div>
                                {/snippet}
                            </RatingGroup.Context>
                        </RatingGroup.Control>
                        <RatingGroup.HiddenInput/>
                    </RatingGroup>
                    <button onclick={() => authStore.toggleSchedule(key)}
                            class="btn btn-sm"
                            class:preset-filled-success-500={inSchedule}
                            class:preset-tonal={!inSchedule}>
                        {inSchedule ? '✓ In schedule' : '+ Schedule'}
                    </button>
                </div>
            </div>
        {/each}

        {#if showNowInsert && filtered.length > 0 && normalizedNowInsertIndex === filtered.length}
            <div class="card preset-filled-primary-500 p-3">
                <p class="text-sm font-semibold">Now: {nowLabel}</p>
                <p class="text-xs opacity-80">All artists in this list have already played.</p>
            </div>
        {/if}

        {#if filtered.length === 0}
            <p class="text-center text-surface-400 py-8">No artists found.</p>
        {/if}
    </div>
</div>
