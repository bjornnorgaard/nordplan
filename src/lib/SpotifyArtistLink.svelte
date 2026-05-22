<script lang="ts">
    let {name}: { name: string } = $props();

    function spotifyArtistAppUrl(artistName: string): string {
        return `spotify:search:${encodeURIComponent(artistName)}`;
    }
</script>

<a href={spotifyArtistAppUrl(name)} target={undefined} rel={undefined} title="Open in Spotify"
   class="btn-icon btn-icon-sm preset-tonal shrink-0" aria-label="Open {name} in Spotify">
    <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.28c-.19.31-.59.41-.9.22-2.48-1.52-5.6-1.86-9.28-1.02-.35.08-.7-.14-.78-.49-.08-.35.14-.7.49-.78 4.02-.92 7.54-.54 10.29 1.15.31.19.41.59.22.9zm1.47-3.27c-.24.38-.74.5-1.12.26-2.84-1.74-7.17-2.25-10.54-1.23-.43.13-.89-.11-1.02-.54-.13-.43.11-.89.54-1.02 3.84-1.16 8.62-.6 11.87 1.42.38.24.5.74.26 1.12zm.13-3.4C14.36 6.48 8.45 6.26 5.01 7.33c-.51.16-1.05-.13-1.21-.64-.16-.51.13-1.05.64-1.21 3.92-1.2 10.46-.95 14.85 1.4.46.27.61.86.34 1.32-.27.46-.86.61-1.32.34z"/>
    </svg>
</a>
