import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';
import { auth, loadRatings, loadSchedule, saveRatings, saveSchedule } from '$lib/firebase';

function createAuthStore() {
	let user = $state<User | null>(null);
	let loading = $state(true);
	let ratings = $state<Record<string, number>>({});
	let schedule = $state<string[]>([]);

	if (browser) {
		onAuthStateChanged(auth, async (u) => {
			user = u;
			if (u) {
				ratings = await loadRatings(u.uid);
				schedule = await loadSchedule(u.uid);
			} else {
				ratings = {};
				schedule = [];
			}
			loading = false;
		});
	}

	async function setRating(artistKey: string, rating: number) {
		if (!user) return;
		ratings = { ...ratings, [artistKey]: rating };
		await saveRatings(user.uid, ratings);
	}

	async function toggleSchedule(artistKey: string) {
		if (!user) return;
		if (schedule.includes(artistKey)) {
			schedule = schedule.filter((k) => k !== artistKey);
		} else {
			schedule = [...schedule, artistKey];
		}
		await saveSchedule(user.uid, schedule);
	}

	return {
		get user() { return user; },
		get loading() { return loading; },
		get ratings() { return ratings; },
		get schedule() { return schedule; },
		setRating,
		toggleSchedule
	};
}

export const authStore = createAuthStore();
