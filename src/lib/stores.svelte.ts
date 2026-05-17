import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';
import { auth, loadRatings, loadSchedule, saveRatings, saveSchedule } from '$lib/firebase';

function createAuthStore() {
	let user = $state<User | null>(null);
	let loading = $state(true);
	let ratings = $state<Record<string, number>>({});
	let schedule = $state<string[]>([]);
	let authLoadVersion = 0;

	if (browser) {
		onAuthStateChanged(auth, async (u) => {
			const currentLoadVersion = ++authLoadVersion;
			loading = true;

			if (u) {
				const [nextRatings, nextSchedule] = await Promise.all([
					loadRatings(u.uid),
					loadSchedule(u.uid)
				]);

				if (currentLoadVersion !== authLoadVersion) return;

				user = u;
				ratings = nextRatings;
				schedule = nextSchedule;
			} else {
				if (currentLoadVersion !== authLoadVersion) return;

				user = null;
				ratings = {};
				schedule = [];
			}

			loading = false;
		});
	}

	async function setRating(artistKey: string, rating: number) {
		if (!user) return;
		const uid = user.uid;
		const previousRatings = ratings;
		const nextRatings = { ...ratings, [artistKey]: rating };
		ratings = nextRatings;

		try {
			await saveRatings(uid, nextRatings);
		} catch (error) {
			ratings = previousRatings;
			console.error('Failed to save ratings', error);
		}
	}

	async function toggleSchedule(artistKey: string) {
		if (!user) return;
		const uid = user.uid;
		const previousSchedule = schedule;
		const nextSchedule = schedule.includes(artistKey)
			? schedule.filter((k) => k !== artistKey)
			: [...schedule, artistKey];
		schedule = nextSchedule;

		try {
			await saveSchedule(uid, nextSchedule);
		} catch (error) {
			schedule = previousSchedule;
			console.error('Failed to save schedule', error);
		}
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
