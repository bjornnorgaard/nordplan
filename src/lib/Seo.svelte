<!--
	Seo.svelte
	Drop this into any page to set per-page SEO metadata.
	All props are optional; sensible defaults are applied automatically.
-->
<script lang="ts">
	interface Props {
		/** Page-level title. Rendered as "<title> | NordPlan" unless `titleFull` is set. */
		title?: string;
		/** Pass `true` to use `title` verbatim without the site suffix. */
		titleFull?: boolean;
		/** Short description shown in search results and OG previews (≤ 160 chars). */
		description?: string;
		/** Canonical URL for this page (absolute). Leave blank to omit the tag. */
		canonical?: string;
		/** Open Graph image URL. Falls back to the default OG image. */
		ogImage?: string;
		/** Page type passed to og:type. Defaults to "website". */
		ogType?: string;
		/** Set to true for private / auth-gated pages to prevent indexing. */
		noindex?: boolean;
	}

	let {
		title,
		titleFull = false,
		description = 'Your NorthSide 2026 planner — rate artists, build your personal schedule, and see what your group is excited about.',
		canonical,
		ogImage = '/og-image.png',
		ogType = 'website',
		noindex = false
	}: Props = $props();

	const siteName = 'NordPlan';
	const fullTitle = $derived(title ? (titleFull ? title : `${title} – ${siteName}`) : siteName);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={ogType} />
	<meta property="og:image" content={ogImage} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}

	<!-- Twitter / X Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>


