import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useUsers } from "../hooks/useUsers";
import { onAuthChange, loginUser, registerUser, signInWithGoogle } from "../utils/firebase";

interface LoginScreenProps {
	onLoginSuccess: () => void;
}

// Animated cartoon polar bear face (shared component)
const PolarBearFace: React.FC<{ className?: string }> = ({ className }) => (
	<svg className={className} viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<defs>
			<style>{`
				@keyframes bounce {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-15px); }
				}
				@keyframes blink {
					0%, 49%, 100% { cy: 110; ry: 18; }
					50%, 98% { cy: 115; ry: 5; }
				}
				@keyframes wag {
					0%, 100% { transform: rotate(-15deg); }
					50% { transform: rotate(15deg); }
				}
				.bear-body {
					animation: bounce 2s ease-in-out infinite;
				}
				.bear-eye-left {
					animation: blink 3s ease-in-out infinite;
				}
				.bear-eye-right {
					animation: blink 3s ease-in-out infinite 0.1s;
				}
				.bear-ear-left {
					animation: wag 1.5s ease-in-out infinite;
					transform-origin: 65px 30px;
				}
				.bear-ear-right {
					animation: wag 1.5s ease-in-out infinite;
					transform-origin: 175px 30px;
				}
			`}</style>
		</defs>

		{/* Body -->*/}
		<g className="bear-body">
			{/* Main head circle */}
			<circle cx="120" cy="140" r="85" fill="#e8f0f7" stroke="#a0adc4" strokeWidth="3" />

			{/* Ears */}
			<circle cx="65" cy="60" r="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" className="bear-ear-left" />
			<circle cx="175" cy="60" r="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" className="bear-ear-right" />

			{/* Inner ears */}
			<circle cx="65" cy="65" r="16" fill="#c0c8d8" className="bear-ear-left" />
			<circle cx="175" cy="65" r="16" fill="#c0c8d8" className="bear-ear-right" />

			{/* Snout/muzzle */}
			<ellipse cx="120" cy="165" rx="45" ry="50" fill="#f0f5fa" stroke="#a0adc4" strokeWidth="2" />

			{/* Eyes */}
			<circle cx="95" cy="110" r="16" fill="#1a1a2e" />
			<circle cx="145" cy="110" r="16" fill="#1a1a2e" />

			{/* Eye shine/sparkle */}
			<circle cx="98" cy="107" r="6" fill="#ffffff" opacity="0.8" />
			<circle cx="148" cy="107" r="6" fill="#ffffff" opacity="0.8" />

			{/* Nose */}
			<ellipse cx="120" cy="145" rx="12" ry="15" fill="#1a1a2e" />

			{/* Smile/mouth */}
			<path d="M 120 155 Q 115 165 110 163" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
			<path d="M 120 155 Q 125 165 130 163" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

			{/* Cheeks - pink blush */}
			<ellipse cx="65" cy="140" rx="18" ry="22" fill="#ffc0cb" opacity="0.4" />
			<ellipse cx="175" cy="140" rx="18" ry="22" fill="#ffc0cb" opacity="0.4" />

			{/* Front paws */}
			<ellipse cx="85" cy="220" rx="20" ry="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" />
			<ellipse cx="155" cy="220" rx="20" ry="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" />

			{/* Paw pads */}
			<circle cx="85" cy="245" r="8" fill="#1a1a2e" />
			<circle cx="155" cy="245" r="8" fill="#1a1a2e" />

			{/* Belly spot */}
			<ellipse cx="120" cy="180" rx="35" ry="40" fill="#ffffff" opacity="0.6" />
		</g>
	</svg>
);

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
	const { addUser } = useUsers();
	const [tab, setTab] = useState<"local" | "cloud">("local");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLocalLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!name.trim()) {
			setError("Please enter a name");
			return;
		}

		try {
			// Create local user
			addUser({
				id: Date.now().toString(),
				name: name.trim(),
				gender: "male",
				weight: 180,
				height: 70,
				age: 30,
				activityLevel: "lightly-active",
				goal: "lose_weight",
				weeklyWeightLossTarget: 1,
				dietaryRestrictions: [],
				medicalConditions: [],
				mentalHealthChallenges: [],
				supportAreas: [],
				overwhelmTriggers: [],
				mealTypes: ["Meal 1", "Meal 2", "Meal 3", "Meal 4", "Snacks", "Supplements"],
				tasks: [],
				companion: {
					name: "Polar Bear",
					level: 1,
					experience: 0,
					stage: "cub",
					happiness: 80,
				},
				quests: [],
				mealLogs: [],
				activityLogs: [],
				journalEntries: [],
				supplementStacks: [],
			});

			setName("");
			onLoginSuccess();
		} catch (err) {
			setError("Failed to create user. Please try again.");
		}
	};

	const handleCloudLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		if (!email.trim() || !password.trim()) {
			setError("Please enter email and password");
			setIsLoading(false);
			return;
		}

		try {
			await loginUser(email, password);
			// Wait for auth state to update
			await new Promise((resolve) => {
				const unsubscribe = onAuthChange(() => {
					unsubscribe();
					resolve(null);
				});
				setTimeout(() => {
					unsubscribe();
					resolve(null);
				}, 2000);
			});

			setEmail("");
			setPassword("");
			onLoginSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloudSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		if (!email.trim() || !password.trim()) {
			setError("Please enter email and password");
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			setIsLoading(false);
			return;
		}

		try {
			await registerUser(email, password);
			// Create a default user profile
			addUser({
				id: email,
				name: email.split("@")[0],
				gender: "male",
				weight: 180,
				height: 70,
				age: 30,
				activityLevel: "lightly-active",
				goal: "lose_weight",
				weeklyWeightLossTarget: 1,
				dietaryRestrictions: [],
				medicalConditions: [],
				mentalHealthChallenges: [],
				supportAreas: [],
				overwhelmTriggers: [],
				mealTypes: ["Meal 1", "Meal 2", "Meal 3", "Meal 4", "Snacks", "Supplements"],
				tasks: [],
				companion: {
					name: "Polar Bear",
					level: 1,
					experience: 0,
					stage: "cub",
					happiness: 80,
				},
				quests: [],
				mealLogs: [],
				activityLogs: [],
				journalEntries: [],
				supplementStacks: [],
			});

			setEmail("");
			setPassword("");
			onLoginSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async (credentialResponse: any) => {
		setError("");
		setIsLoading(true);

		try {
			const result = await signInWithGoogle(credentialResponse.credential);
			const user = result.user;

			// Create or update user profile
			const nameFromEmail = user.email?.split("@")[0] || "User";
			addUser({
				id: user.uid,
				name: user.displayName || nameFromEmail,
				email: user.email || "",
				photoURL: user.photoURL || "",
				gender: "male",
				weight: 180,
				height: 70,
				age: 30,
				activityLevel: "lightly-active",
				goal: "lose_weight",
				weeklyWeightLossTarget: 1,
				dietaryRestrictions: [],
				medicalConditions: [],
				mentalHealthChallenges: [],
				supportAreas: [],
				overwhelmTriggers: [],
				mealTypes: ["Meal 1", "Meal 2", "Meal 3", "Meal 4", "Snacks", "Supplements"],
				tasks: [],
				companion: {
					name: "Polar Bear",
					level: 1,
					experience: 0,
					stage: "cub",
					happiness: 80,
				},
				quests: [],
				mealLogs: [],
				activityLogs: [],
				journalEntries: [],
				supplementStacks: [],
			});

			onLoginSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleError = () => {
		setError("Google sign-in failed. Please try again.");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<PolarBearFace className="w-40 h-48 mx-auto drop-shadow-xl mb-4" />
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Snowball</h1>
					<p className="text-gray-600">Your personal self-care companion</p>
				</div>

				{/* Tabs */}
				<div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
					<button
						onClick={() => setTab("local")}
						className={`flex-1 py-2 px-3 rounded font-semibold transition ${
							tab === "local" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-700"
						}`}>
						Quick Start
					</button>
					<button
						onClick={() => setTab("cloud")}
						className={`flex-1 py-2 px-3 rounded font-semibold transition ${
							tab === "cloud" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-700"
						}`}>
						☁️ Cloud Sync
					</button>
				</div>

				{/* Local Mode */}
				{tab === "local" && (
					<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
						<h2 className="text-xl font-bold text-gray-800 mb-4">Get Started Locally</h2>
						<p className="text-sm text-gray-600 mb-4">
							Create a local profile to use Snowball on this device. Data saves locally.
						</p>

						<form onSubmit={handleLocalLogin} className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g., Matt"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={isLoading}
								/>
							</div>

							{error && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
							)}

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
								{isLoading ? "Loading..." : "Start with Local Profile"}
							</button>
						</form>

						<div className="mt-6 pt-6 border-t border-gray-200">
							<p className="text-xs text-gray-500 mb-3">
								<strong>Local mode benefits:</strong>
							</p>
							<ul className="text-xs text-gray-600 space-y-1">
								<li>✓ Works immediately, no setup needed</li>
								<li>✓ Data stored locally on this device</li>
								<li>✓ No account required</li>
								<li>✗ Data doesn't sync to other devices</li>
							</ul>
						</div>
					</div>
				)}

				{/* Cloud Mode */}
				{tab === "cloud" && (
					<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
						<h2 className="text-xl font-bold text-gray-800 mb-4">☁️ Cloud Sync</h2>
						<p className="text-sm text-gray-600 mb-4">
							Create an account to sync your profile across all your devices.
						</p>

						{/* Google Sign-In */}
						<div className="mb-6">
							<div className="flex items-center gap-2 mb-4">
								<div className="flex-1 h-px bg-gray-300"></div>
								<span className="text-xs text-gray-500 font-semibold">SIGN IN WITH</span>
								<div className="flex-1 h-px bg-gray-300"></div>
							</div>
							<div className="flex justify-center mb-6">
								<GoogleLogin onSuccess={handleGoogleSignIn} onError={handleGoogleError} text="signin" width="280" />
							</div>
							<div className="flex items-center gap-2">
								<div className="flex-1 h-px bg-gray-300"></div>
								<span className="text-xs text-gray-500 font-semibold">OR</span>
								<div className="flex-1 h-px bg-gray-300"></div>
							</div>
						</div>

						<form onSubmit={handleCloudLogin} className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={isLoading}
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={isLoading}
								/>
							</div>

							{error && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
							)}

							<div className="flex gap-2">
								<button
									type="button"
									onClick={handleCloudSignup}
									disabled={isLoading}
									className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
									{isLoading ? "Loading..." : "Sign Up"}
								</button>
								<button
									type="submit"
									disabled={isLoading}
									className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
									{isLoading ? "Loading..." : "Login"}
								</button>
							</div>
						</form>

						<div className="mt-6 pt-6 border-t border-gray-200">
							<p className="text-xs text-gray-500 mb-3">
								<strong>Cloud sync benefits:</strong>
							</p>
							<ul className="text-xs text-gray-600 space-y-1">
								<li>✓ Use profile on any device (desktop/mobile)</li>
								<li>✓ Real-time data synchronization</li>
								<li>✓ Cloud backup of all data</li>
								<li>✓ Multiple profiles per account</li>
								<li>✓ Change device, data follows you</li>
							</ul>

							<p className="text-xs text-gray-500 mt-4">
								Don't have an account? Click <strong>Sign Up</strong> first.
							</p>
						</div>
					</div>
				)}

				{/* Footer */}
				<div className="text-center text-xs text-gray-500">
					<p>Snowball uses localStorage for local data and Firebase for cloud sync.</p>
				</div>
			</div>
		</div>
	);
}
