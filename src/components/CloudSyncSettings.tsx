import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { registerUser, loginUser, logoutUser, onAuthChange } from "../utils/firebase";
import type { User as FirebaseUser } from "firebase/auth";

export const CloudSyncSettings: React.FC = () => {
	const { currentUser, isCloudSyncEnabled } = useUsers();
	const [activeTab, setActiveTab] = useState<"status" | "auth">("status");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

	React.useEffect(() => {
		const unsubscribe = onAuthChange((user) => {
			setAuthUser(user);
		});
		return unsubscribe;
	}, []);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setMessage("Please enter email and password");
			return;
		}

		setLoading(true);
		setMessage("");
		try {
			await registerUser(email, password);
			setMessage("✓ Account created and cloud sync enabled!");
			setEmail("");
			setPassword("");
		} catch (error: any) {
			setMessage(`Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setMessage("Please enter email and password");
			return;
		}

		setLoading(true);
		setMessage("");
		try {
			await loginUser(email, password);
			setMessage("✓ Logged in and cloud sync enabled!");
			setEmail("");
			setPassword("");
		} catch (error: any) {
			setMessage(`Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		setLoading(true);
		try {
			await logoutUser();
			setMessage("✓ Logged out");
			setAuthUser(null);
		} catch (error: any) {
			setMessage(`Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-2xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					☁️ Cloud Sync Settings
				</h2>

				{/* Tabs */}
				<div className="flex gap-2 mb-6 border-b border-gray-200">
					<button
						onClick={() => setActiveTab("status")}
						className={`px-4 py-3 font-semibold transition duration-200 ${
							activeTab === "status"
								? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
								: "text-gray-600 hover:text-gray-800"
						}`}>
						Status
					</button>
					<button
						onClick={() => setActiveTab("auth")}
						className={`px-4 py-3 font-semibold transition duration-200 ${
							activeTab === "auth"
								? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
								: "text-gray-600 hover:text-gray-800"
						}`}>
						Account
					</button>
				</div>

				{/* Status Tab */}
				{activeTab === "status" && (
					<div className="space-y-4">
						<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
							<p className="text-sm text-gray-700">
								<span className="font-semibold">Cloud Sync Status:</span>
								<span className={`ml-2 font-bold ${isCloudSyncEnabled ? "text-emerald-600" : "text-gray-500"}`}>
									{isCloudSyncEnabled ? "✓ Enabled" : "○ Offline (localStorage only)"}
								</span>
							</p>
						</div>

						{authUser && (
							<div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
								<p className="text-sm text-gray-700">
									<span className="font-semibold">Logged In As:</span>
									<span className="ml-2 text-emerald-700 font-medium">{authUser.email}</span>
								</p>
								<p className="text-xs text-gray-600 mt-2">Your data will sync across all devices automatically.</p>
							</div>
						)}

						{!isCloudSyncEnabled && (
							<div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
								<p className="text-sm text-amber-800">
									<span className="font-semibold">ℹ️ Note:</span> Cloud sync is currently offline. Create an account to
									enable cross-device sync.
								</p>
								<p className="text-xs text-amber-700 mt-2">Your data will be saved locally on this device only.</p>
							</div>
						)}

						<div className="space-y-2 mt-6">
							<h3 className="font-semibold text-gray-800">Benefits of Cloud Sync:</h3>
							<ul className="text-sm text-gray-700 space-y-1 ml-4">
								<li>✓ Access your profile on desktop and mobile</li>
								<li>✓ Automatic backup of your data</li>
								<li>✓ Real-time sync across devices</li>
								<li>✓ Never lose your companion progress</li>
							</ul>
						</div>
					</div>
				)}

				{/* Auth Tab */}
				{activeTab === "auth" && (
					<div className="space-y-4">
						{authUser ? (
							<div className="space-y-4">
								<div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
									<p className="text-sm font-semibold text-emerald-900">Logged in as {authUser.email}</p>
									<p className="text-xs text-emerald-700 mt-1">Your data is being synced to the cloud.</p>
								</div>
								<button
									onClick={handleLogout}
									disabled={loading}
									className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50">
									{loading ? "Logging out..." : "🚪 Logout"}
								</button>
							</div>
						) : (
							<form onSubmit={handleLogin} className="space-y-4">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="your@email.com"
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="••••••••"
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								{message && (
									<div
										className={`p-3 rounded-lg text-sm font-medium ${
											message.startsWith("✓")
												? "bg-emerald-50 text-emerald-800 border border-emerald-200"
												: "bg-red-50 text-red-800 border border-red-200"
										}`}>
										{message}
									</div>
								)}

								<div className="flex gap-2 pt-2">
									<button
										type="submit"
										disabled={loading}
										className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50">
										{loading ? "Loading..." : "🔓 Login"}
									</button>
									<button
										type="button"
										onClick={handleRegister}
										disabled={loading}
										className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50">
										{loading ? "Loading..." : "✚ Create Account"}
									</button>
								</div>

								<p className="text-xs text-gray-600 text-center mt-4">
									No account needed to use Snowball. Cloud sync is optional!
								</p>
							</form>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
