import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';
import {
	auth,
	loadRatings,
	loadSchedule,
	saveRating,
	addScheduleArtist,
	removeScheduleArtist
} from '$lib/firebase';

function createAuthStore() {
	let user = $state<User | null>(null);
	let loading = $state(true);
	let ratings = $state<Record<string, number>>({});
	let schedule = $state<string[]>([]);
	let authLoadId = 0;

	if (browser) {
		onAuthStateChanged(auth, async (u) => {
			const currentAuthLoadId = ++authLoadId;
			user = u;
			if (!u) {
				ratings = {};
				schedule = [];
				loading = false;
				return;
			}

			loading = true;
			try {
				const [loadedRatings, loadedSchedule] = await Promise.all([
					loadRatings(u.uid),
					loadSchedule(u.uid)
				]);
				if (currentAuthLoadId !== authLoadId) return;
				ratings = loadedRatings;
				schedule = loadedSchedule;
			} catch (error) {
				if (currentAuthLoadId !== authLoadId) return;
				console.error('Failed to load user state from Firestore', error);
				ratings = {};
				schedule = [];
			} finally {
				if (currentAuthLoadId === authLoadId) {
					loading = false;
				}
			}
		});
	}

	async function setRating(artistKey: string, rating: number) {
		if (!user) return;

		const previousRatings = ratings;
		const nextRatings = { ...ratings };
		if (rating > 0) {
			nextRatings[artistKey] = rating;
		} else {
			delete nextRatings[artistKey];
		}
		ratings = nextRatings;

		try {
			await saveRating(user.uid, artistKey, rating);
		} catch (error) {
			console.error('Failed to save rating', error);
			ratings = previousRatings;
		}
	}

	async function toggleSchedule(artistKey: string) {
		if (!user) return;

		const previousSchedule = schedule;
		const isInSchedule = schedule.includes(artistKey);
		schedule = isInSchedule
			? schedule.filter((k) => k !== artistKey)
			: [...schedule, artistKey];

		try {
			if (isInSchedule) {
				await removeScheduleArtist(user.uid, artistKey);
			} else {
				await addScheduleArtist(user.uid, artistKey);
			}
		} catch (error) {
			console.error('Failed to save schedule', error);
			schedule = previousSchedule;
		}
	}

	return {
		get user() {
			return user;
		},
		get loading() {
			return loading;
		},
		get ratings() {
			return ratings;
		},
		get schedule() {
			return schedule;
		},
		setRating,
		toggleSchedule
	};
}

export const authStore = createAuthStore();
