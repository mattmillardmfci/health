import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, remove } from "firebase/database";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithCredential,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";

// Firebase configuration - using a public demo config
// In production, use environment variables
const firebaseConfig = {
	apiKey: "AIzaSyCC25LmN0miLYHMAjGgUyrD8rMXDxgUs5g",
	authDomain: "snowball-41437.firebaseapp.com",
	databaseURL: "https://snowball-41437-default-rtdb.firebaseio.com",
	projectId: "snowball-41437",
	storageBucket: "snowball-41437.firebasestorage.app",
	messagingSenderId: "421341361251",
	appId: "1:421341361251:web:1d1e1351779f493c7fb456",
	measurementId: "G-H9DS1HBE8Y",
};

// Initialize Firebase
let app: any;
let auth: any;
let database: any;
let isInitialized = false;

export const initializeFirebase = () => {
	if (isInitialized) return { app, auth, database };

	try {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);
		database = getDatabase(app);
		isInitialized = true;
		console.log("Firebase initialized successfully");
		return { app, auth, database };
	} catch (error) {
		console.warn("Firebase initialization failed - using localStorage only", error);
		return { app: null, auth: null, database: null };
	}
};

// Authentication functions
export const registerUser = async (email: string, password: string) => {
	if (!auth) throw new Error("Firebase not initialized");
	return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string) => {
	if (!auth) throw new Error("Firebase not initialized");
	return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
	if (!auth) throw new Error("Firebase not initialized");
	return signOut(auth);
};

export const signInWithGoogle = async (googleCredential: string) => {
	if (!auth) throw new Error("Firebase not initialized");
	try {
		const credential = GoogleAuthProvider.credential(googleCredential);
		return await signInWithCredential(auth, credential);
	} catch (error) {
		console.error("Google sign-in error:", error);
		throw error;
	}
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
	if (!auth) {
		callback(null);
		return () => {};
	}
	return onAuthStateChanged(auth, callback);
};

// Database functions
export const saveUserToDatabase = async (userId: string, userData: any) => {
	if (!database) return false;
	try {
		await set(ref(database, `users/${userId}`), userData);
		return true;
	} catch (error) {
		console.error("Error saving user to database:", error);
		return false;
	}
};

export const getUserFromDatabase = async (userId: string) => {
	if (!database) return null;
	try {
		const snapshot = await get(ref(database, `users/${userId}`));
		if (snapshot.exists()) {
			return snapshot.val();
		}
		return null;
	} catch (error) {
		console.error("Error fetching user from database:", error);
		return null;
	}
};

export const subscribeToUserUpdates = (userId: string, callback: (data: any) => void) => {
	if (!database) return () => {};

	const userRef = ref(database, `users/${userId}`);
	const unsubscribe = onValue(
		userRef,
		(snapshot) => {
			if (snapshot.exists()) {
				callback(snapshot.val());
			}
		},
		(error) => {
			console.error("Error subscribing to user updates:", error);
		},
	);

	return unsubscribe;
};

export const deleteUserFromDatabase = async (userId: string) => {
	if (!database) return false;
	try {
		await remove(ref(database, `users/${userId}`));
		return true;
	} catch (error) {
		console.error("Error deleting user from database:", error);
		return false;
	}
};
