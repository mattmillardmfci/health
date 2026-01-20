import React, { createContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

interface UserContextType {
	users: User[];
	currentUser: User | null;
	addUser: (user: User) => void;
	updateUser: (user: User) => void;
	deleteUser: (id: string) => void;
	setCurrentUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

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

	const addUser = useCallback((user: User) => {
		setUsers((prev) => [...prev, user]);
	}, []);

	const updateUser = useCallback(
		(user: User) => {
			setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
			if (currentUser?.id === user.id) {
				setCurrentUser(user);
			}
		},
		[currentUser],
	);

	const deleteUser = useCallback(
		(id: string) => {
			setUsers((prev) => prev.filter((u) => u.id !== id));
			if (currentUser?.id === id) {
				setCurrentUser(null);
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
			}}>
			{children}
		</UserContext.Provider>
	);
};
