<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import { onMount } from 'svelte';
	import { artists, days, artistKey } from '$lib/data/artists';
	import { loadAllRatings } from '$lib/firebase';
	import { authStore } from '$lib/stores.svelte';

	let allRatings = $state<Record<string, Record<string, number>>>({});
	let loading = $state(true);
	let selectedDay = $state('Thursday');
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
			.filter((a) => a.day === selectedDay)
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
</script>

<Seo
	title="Group Stats"
	description="See which NorthSide 2026 artists are most popular in your group. Aggregated ratings from all members."
	noindex={true}
/>

<div class="space-y-4">
	<h2 class="text-2xl font-bold">Group Stats</h2>

	{#if loading}
		<p class="text-center text-surface-400 py-8">Loading ratings…</p>
	{:else if loadError}
		<p class="text-center text-error-500 py-8">{loadError}</p>
	{:else}
		<p class="text-sm text-surface-400">{Object.keys(allRatings).length} group member(s) have rated artists.</p>

		{#if groupHighlights.length > 0}
			<div class="card preset-filled-primary-100-900 p-4 space-y-2">
				<p class="font-semibold text-sm uppercase tracking-wide">🔥 Group Favourites</p>
				{#each groupHighlights as s}
					<div class="flex items-center justify-between text-sm">
						<div>
							<span class="font-medium">{s.name}</span>
							<span class="text-surface-400 ml-1">({s.stage}, {s.startTime})</span>
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
			{#each days as day}
				<button
					onclick={() => (selectedDay = day)}
					class="btn btn-sm {selectedDay === day ? 'preset-filled-primary-500' : 'preset-tonal-surface'}"
					aria-pressed={selectedDay === day}
				>
					{day}
				</button>
			{/each}
		</div>

		<div class="space-y-2">
			{#each stats as s}
				<div class="card preset-filled-surface-100-900 p-3">
					<div class="flex items-start justify-between gap-2">
						<div class="min-w-0">
							<p class="font-semibold leading-tight text-sm">{s.name}</p>
							<p class="text-xs text-surface-500">{s.genre} · {s.stage} {s.startTime}</p>
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
		</div>
	{/if}
</div>
