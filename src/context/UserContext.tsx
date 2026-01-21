import React, { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { initializeFirebase, saveUserToDatabase, subscribeToUserUpdates } from "../utils/firebase";

interface UserContextType {
	users: User[];
	currentUser: User | null;
	addUser: (user: User) => void;
	updateUser: (user: User) => void;
	deleteUser: (id: string) => void;
	setCurrentUser: (user: User | null) => void;
	isCloudSyncEnabled: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isCloudSyncEnabled, setIsCloudSyncEnabled] = useState(false);

	// Initialize Firebase on mount
	React.useEffect(() => {
		const { database } = initializeFirebase();
		setIsCloudSyncEnabled(!!database);
	}, []);

	// Load users from localStorage on mount
	React.useEffect(() => {
		const savedUsers = localStorage.getItem("health-app-users");
		if (savedUsers) {
			try {
				const parsed = JSON.parse(savedUsers);
				setUsers(parsed);

				// Set first user as current if no current user is set
				if (parsed.length > 0 && !currentUser) {
					const savedCurrentUser = localStorage.getItem("health-app-current-user");
					if (savedCurrentUser) {
						const current = JSON.parse(savedCurrentUser);
						setCurrentUser(current);
					} else {
						setCurrentUser(parsed[0]);
					}
				}
			} catch (error) {
				console.error("Failed to load users from localStorage", error);
			}
		}
	}, []);

	// Save users to localStorage when changed
	React.useEffect(() => {
		localStorage.setItem("health-app-users", JSON.stringify(users));
	}, [users]);

	// Save current user to localStorage when changed
	React.useEffect(() => {
		if (currentUser) {
			localStorage.setItem("health-app-current-user", JSON.stringify(currentUser));
		}
	}, [currentUser]);

	// Save to cloud database when user is updated (if enabled)
	React.useEffect(() => {
		if (currentUser && isCloudSyncEnabled) {
			saveUserToDatabase(currentUser.id, currentUser).catch((error) => {
				console.error("Failed to sync user to cloud:", error);
			});
		}
	}, [currentUser, isCloudSyncEnabled]);

	const addUser = useCallback(
		(user: User) => {
			setUsers((prev) => [...prev, user]);
			setCurrentUser(user);
			// Sync to cloud if enabled
			if (isCloudSyncEnabled) {
				saveUserToDatabase(user.id, user).catch((error) => {
					console.error("Failed to sync new user to cloud:", error);
				});
			}
		},
		[isCloudSyncEnabled],
	);

	const updateUser = useCallback(
		(user: User) => {
			setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
			if (currentUser?.id === user.id) {
				setCurrentUser(user);
			}
			// Sync to cloud if enabled
			if (isCloudSyncEnabled) {
				saveUserToDatabase(user.id, user).catch((error) => {
					console.error("Failed to sync user to cloud:", error);
				});
			}
		},
		[currentUser, isCloudSyncEnabled],
	);

	const deleteUser = useCallback(
		(id: string) => {
			setUsers((prev) => prev.filter((u) => u.id !== id));
			if (currentUser?.id === id) {
				setCurrentUser(null);
				// Clear from localStorage
				localStorage.removeItem("health-app-current-user");
			}
		},
		[currentUser],
	);

	return (
		<UserContext.Provider
			value={{
				users,
				currentUser,
				addUser,
				updateUser,
				deleteUser,
				setCurrentUser,
				isCloudSyncEnabled,
			}}>
			{children}
		</UserContext.Provider>
	);
};
