<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores.svelte';

	$effect(() => {
		if (browser && !authStore.loading) {
			if (authStore.user) {
				goto('/artists');
			} else {
				goto('/login');
			}
		}
	});
</script>
