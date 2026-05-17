import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	getDocs,
	collection,
	deleteField,
	arrayUnion,
	arrayRemove
} from 'firebase/firestore';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_MEASUREMENT_ID
} from '$env/static/public';
import { browser } from '$app/environment';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
	measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

let analytics: Analytics | null = null;

// Analytics is only available in supported browser environments.
if (browser) {
	void isSupported().then((supported) => {
		if (supported) analytics = getAnalytics(app);
	});
}

export { auth, db, analytics };

export async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	await signInWithPopup(auth, provider);
}

export async function signOutUser() {
	await signOut(auth);
}

export async function saveRating(userId: string, artistKey: string, rating: number) {
	if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
		await setDoc(doc(db, 'ratings', userId), { [artistKey]: rating }, { merge: true });
		return;
	}
	await setDoc(doc(db, 'ratings', userId), { [artistKey]: deleteField() }, { merge: true });
}

export async function loadRatings(userId: string): Promise<Record<string, number>> {
	const snap = await getDoc(doc(db, 'ratings', userId));
	return snap.exists() ? (snap.data() as Record<string, number>) : {};
}

export async function addScheduleArtist(userId: string, artistKey: string) {
	await setDoc(doc(db, 'schedules', userId), { artists: arrayUnion(artistKey) }, { merge: true });
}

export async function removeScheduleArtist(userId: string, artistKey: string) {
	await setDoc(doc(db, 'schedules', userId), { artists: arrayRemove(artistKey) }, { merge: true });
}

export async function loadSchedule(userId: string): Promise<string[]> {
	const snap = await getDoc(doc(db, 'schedules', userId));
	return snap.exists() ? ((snap.data() as { artists: string[] }).artists ?? []) : [];
}

export async function loadAllRatings(): Promise<Record<string, Record<string, number>>> {
	const snap = await getDocs(collection(db, 'ratings'));
	const result: Record<string, Record<string, number>> = {};
	snap.forEach((d) => {
		result[d.id] = d.data() as Record<string, number>;
	});
	return result;
}
