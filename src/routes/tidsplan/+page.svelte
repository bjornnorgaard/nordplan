<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import {
		teamScheduleDays,
		teamScheduleDisclaimer,
		teamScheduleIntro,
		teamScheduleTasks
	} from '$lib/data/teamSchedule';

	let selectedDay = $state('All days');

	let visibleDays = $derived(
		selectedDay === 'All days'
			? teamScheduleDays
			: teamScheduleDays.filter((day) => day.id === selectedDay)
	);
</script>

<Seo
	title="Tidsplan"
	description="Nordisk Dans holdtidsplan for NorthSide 2026 — pop-up, workshops og opgaver pr. dag."
	noindex={true}
/>

<div class="space-y-6">
	<div class="space-y-2">
		<h2 class="text-2xl font-bold">Tidsplan</h2>
		<p class="text-sm text-surface-400 leading-relaxed">{teamScheduleIntro}</p>
	</div>

	<div class="flex flex-wrap gap-2">
		<button
			onclick={() => (selectedDay = 'All days')}
			class="btn btn-sm"
			class:preset-filled-tertiary-500={selectedDay === 'All days'}
			class:preset-tonal-tertiary={selectedDay !== 'All days'}
			aria-pressed={selectedDay === 'All days'}
		>
			Alle dage
		</button>
		{#each teamScheduleDays as day (day.id)}
			<button
				onclick={() => (selectedDay = day.id)}
				class="btn btn-sm grow"
				class:preset-filled-tertiary-500={selectedDay === day.id}
				class:preset-tonal-tertiary={selectedDay !== day.id}
				aria-pressed={selectedDay === day.id}
			>
				{day.label}
			</button>
		{/each}
	</div>

	<div class="space-y-6">
		{#each visibleDays as day (day.id)}
			<section class="space-y-2">
				<h3 class="text-sm font-semibold uppercase tracking-wide text-surface-400">{day.label}</h3>
				{#each day.items as entry, index (`${day.id}-${index}`)}
					<div
						class="card p-4 flex items-start gap-4"
						class:preset-tonal-primary={entry.urgency !== 'urgent'}
						class:preset-filled-warning-500={entry.urgency === 'urgent'}
					>
						<p class="font-mono text-sm font-bold shrink-0 w-28 leading-snug">{entry.time}</p>
						<div class="flex-1 min-w-0 space-y-1">
							<div class="flex flex-wrap items-center gap-2">
								<p class="font-semibold leading-snug">{entry.title}</p>
								{#if entry.urgency === 'urgent'}
									<span class="badge preset-filled-error-500 text-xs uppercase tracking-wide">
										Hurtig indsats
									</span>
								{/if}
							</div>
							{#if entry.detail}
								<p class="text-sm opacity-70">{entry.detail}</p>
							{/if}
						</div>
					</div>
				{/each}
			</section>
		{/each}
	</div>

	<div class="card preset-filled-surface-100-900 p-4 space-y-2">
		<p class="text-sm font-semibold text-warning-500">Bemærk</p>
		<p class="text-sm text-surface-400 leading-relaxed">{teamScheduleDisclaimer}</p>
	</div>

	<section class="space-y-3">
		<h3 class="text-sm font-semibold uppercase tracking-wide text-surface-400">
			Vigtige opgaver hvor der skal bruges hænder
		</h3>
		<ol class="space-y-2">
			{#each teamScheduleTasks as task, index (index)}
				<li class="card preset-tonal-secondary p-4 flex gap-3">
					<span class="font-mono text-sm font-bold text-secondary-500 shrink-0">{index + 1}.</span>
					<div>
						<p class="font-semibold">{task.title}</p>
						<p class="text-sm opacity-70 mt-1">{task.detail}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>
</div>
