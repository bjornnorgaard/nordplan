import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	getDocs,
	collection
} from 'firebase/firestore';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	await signInWithPopup(auth, provider);
}

export async function signOutUser() {
	await signOut(auth);
}

export async function saveRatings(userId: string, ratings: Record<string, number>) {
	await setDoc(doc(db, 'ratings', userId), ratings);
}

export async function loadRatings(userId: string): Promise<Record<string, number>> {
	const snap = await getDoc(doc(db, 'ratings', userId));
	return snap.exists() ? (snap.data() as Record<string, number>) : {};
}

export async function saveSchedule(userId: string, schedule: string[]) {
	await setDoc(doc(db, 'schedules', userId), { artists: schedule });
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
