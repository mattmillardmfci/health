import React, { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { BabyPolarBear } from "./BabyPolarBear";
import { DailyCheckInModal } from "./DailyCheckInModal";
import { QuestBoard } from "./QuestBoard";
import type { CompanionStats } from "../types";

type CompanionView = "bear" | "quests" | "stats";

export const CompanionHub: React.FC<{
	onQuestNavigate?: (section: "meal" | "activity" | "journal" | "weight" | "goal") => void;
}> = ({ onQuestNavigate }) => {
	const { currentUser, updateUser } = useUsers();
	const [view, setView] = useState<CompanionView>("bear");
	const [showCheckIn, setShowCheckIn] = useState(false);
	const [showNaming, setShowNaming] = useState(false);
	const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
	const [petName, setPetName] = useState("");

	useEffect(() => {
		// Check if user has checked in today
		if (currentUser?.companion) {
			const lastFed = new Date(currentUser.companion.lastFed || new Date());
			const today = new Date();
			setHasCheckedInToday(lastFed.toDateString() === today.toDateString());
		}
	}, [currentUser]);

	if (!currentUser) {
		return <div className="text-center text-gray-600 py-12">Please select a user</div>;
	}

	// Initialize companion on first load
	useEffect(() => {
		if (!currentUser.companion && currentUser) {
			setShowNaming(true); // Show naming modal on first load
			const newCompanion: CompanionStats = {
				id: `companion-${currentUser.id}`,
				userId: currentUser.id,
				name: "Frost",
				level: 1,
				experience: 0,
				stage: "cub",
				happiness: 70,
				hunger: 30,
				energy: 80,
				health: 90,
				cleanliness: 75,
				lastFed: new Date(),
				lastCaredFor: new Date(),
				adventureProgress: 0,
				currentAdventure: "Awakening",
				totalPoints: 0,
				streakDays: 0,
				unlockedAchievements: [],
				createdAt: new Date(),
			};

			// Generate initial quests using the same logic as QuestBoard
			const today = new Date();
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			
			const initialQuests = [
				{
					id: "daily-meal-1",
					userId: currentUser.id,
					title: "Nutritious Feast",
					description: "Log 3 meals today",
					type: "daily" as const,
					linkedActivity: "meal" as const,
					targetCount: 3,
					currentProgress: 0,
					rewardPoints: 30,
					rewardXP: 50,
					completed: false,
					expiresAt: tomorrow,
				},
				{
					id: "daily-activity-1",
					userId: currentUser.id,
					title: "Let's Move!",
					description: "Log an activity session",
					type: "daily" as const,
					linkedActivity: "activity" as const,
					targetCount: 1,
					currentProgress: 0,
					rewardPoints: 25,
					rewardXP: 40,
					completed: false,
					expiresAt: tomorrow,
				},
				{
					id: "daily-journal-1",
					userId: currentUser.id,
					title: "Share Your Thoughts",
					description: "Write a journal entry",
					type: "daily" as const,
					linkedActivity: "journal" as const,
					targetCount: 1,
					currentProgress: 0,
					rewardPoints: 20,
					rewardXP: 35,
					completed: false,
					expiresAt: tomorrow,
				},
				{
					id: "daily-weight-1",
					userId: currentUser.id,
					title: "Check In",
					description: "Log your weight",
					type: "daily" as const,
					linkedActivity: "weight" as const,
					targetCount: 1,
					currentProgress: 0,
					rewardPoints: 15,
					rewardXP: 25,
					completed: false,
					expiresAt: tomorrow,
				},
			];

			const updated = { ...currentUser, companion: newCompanion, quests: initialQuests };
			updateUser(updated);
		}
	}, [currentUser, updateUser]);

	// Auto-degrade companion stats and check evolution
	useEffect(() => {
		if (!currentUser?.companion) return;

		const interval = setInterval(() => {
			if (!currentUser?.companion) return;

			let newStage = currentUser.companion.stage;
			// Evolution based on level
			if (currentUser.companion.level >= 20 && currentUser.companion.stage === "cub") {
				newStage = "juvenile";
			} else if (currentUser.companion.level >= 40 && currentUser.companion.stage === "juvenile") {
				newStage = "adolescent";
			} else if (currentUser.companion.level >= 60 && currentUser.companion.stage === "adolescent") {
				newStage = "adult";
			}

			const updated = {
				...currentUser,
				companion: {
					...currentUser.companion,
					stage: newStage,
					hunger: Math.min(100, currentUser.companion.hunger + 1),
					energy: Math.max(0, currentUser.companion.energy - 0.5),
					happiness: Math.max(0, currentUser.companion.happiness - 0.5),
					health: Math.max(0, currentUser.companion.health - 0.3),
				},
			};
			updateUser(updated);
		}, 60000); // Every minute

		return () => clearInterval(interval);
	}, [currentUser, updateUser]);

	const handlePetNaming = (name: string) => {
		if (!currentUser?.companion) return;
		const updated = {
			...currentUser,
			companion: {
				...currentUser.companion,
				name,
			},
		};
		updateUser(updated);
		setShowNaming(false);
	};

	const companion = currentUser.companion;
	if (!companion) {
		return <div className="text-center text-gray-600 py-12">Initializing your companion...</div>;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 py-6 px-4">
			{/* Header Section */}
			<div className="max-w-7xl mx-auto">
				<div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white p-8 rounded-3xl mb-8 shadow-2xl">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="text-center md:text-left">
							<h1 className="text-4xl md:text-5xl font-black mb-2">❄️ {companion.name}'s Adventure Hub</h1>
							<p className="text-cyan-100 text-lg">
								Level {companion.level} {companion.stage.charAt(0).toUpperCase() + companion.stage.slice(1)} •{" "}
								{companion.totalPoints.toLocaleString()} Points
							</p>
						</div>
						{!hasCheckedInToday && (
							<button
								onClick={() => setShowCheckIn(true)}
								className="px-8 py-4 bg-white text-cyan-600 font-bold rounded-xl hover:bg-cyan-50 transition transform hover:scale-105 shadow-lg text-lg whitespace-nowrap">
								🎯 Daily Check-In
							</button>
						)}
						{hasCheckedInToday && (
							<div className="px-8 py-4 bg-emerald-400 text-white font-bold rounded-xl text-lg">
								✓ Checked In Today!
							</div>
						)}
					</div>
				</div>

				{/* Navigation Tabs */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					<button
						onClick={() => setView("bear")}
						className={`px-6 py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 shadow-lg ${
							view === "bear"
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl"
								: "bg-white text-gray-800 hover:bg-cyan-50 border-2 border-cyan-200"
						}`}>
						🐻‍❄️ Meet {companion.name}
					</button>
					<button
						onClick={() => setView("quests")}
						className={`px-6 py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 shadow-lg ${
							view === "quests"
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl"
								: "bg-white text-gray-800 hover:bg-cyan-50 border-2 border-cyan-200"
						}`}>
						📋 Quests & Challenges
					</button>
					<button
						onClick={() => setView("stats")}
						className={`px-6 py-4 rounded-2xl font-bold text-lg transition transform hover:scale-105 shadow-lg ${
							view === "stats"
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl"
								: "bg-white text-gray-800 hover:bg-cyan-50 border-2 border-cyan-200"
						}`}>
						📊 Statistics & Achievements
					</button>
				</div>

				{/* Content Area */}
				<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-cyan-100">
					{view === "bear" && (
						<div className="max-w-4xl mx-auto">
							<BabyPolarBear onQuest={() => setView("quests")} />
						</div>
					)}

					{view === "quests" && <QuestBoard onNavigate={onQuestNavigate} />}

					{view === "stats" && (
						<div className="max-w-4xl mx-auto">
							<h2 className="text-3xl md:text-4xl font-black mb-8 text-center bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
								🏆 Companion Statistics & Achievements
							</h2>

							{/* Main Stats Grid */}
							<div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-300 text-center shadow-lg transform hover:scale-105 transition">
									<p className="text-sm text-blue-600 font-bold uppercase tracking-wider">Level</p>
									<p className="text-4xl font-black text-blue-700 mt-2">{companion.level}</p>
									<p className="text-xs text-blue-500 mt-1">Current Level</p>
								</div>

								<div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl border-2 border-cyan-300 text-center shadow-lg transform hover:scale-105 transition">
									<p className="text-sm text-cyan-600 font-bold uppercase tracking-wider">Total Points</p>
									<p className="text-4xl font-black text-cyan-700 mt-2">{companion.totalPoints.toLocaleString()}</p>
									<p className="text-xs text-cyan-500 mt-1">Lifetime Earned</p>
								</div>

								<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border-2 border-yellow-300 text-center shadow-lg transform hover:scale-105 transition">
									<p className="text-sm text-yellow-600 font-bold uppercase tracking-wider">Streak</p>
									<p className="text-4xl font-black text-yellow-700 mt-2">{companion.streakDays}</p>
									<p className="text-xs text-yellow-500 mt-1">Days In A Row</p>
								</div>

								<div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border-2 border-pink-300 text-center shadow-lg transform hover:scale-105 transition">
									<p className="text-sm text-pink-600 font-bold uppercase tracking-wider">Happiness</p>
									<p className="text-4xl font-black text-pink-700 mt-2">{companion.happiness}</p>
									<p className="text-xs text-pink-500 mt-1">Out of 100</p>
								</div>

								<div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-300 text-center shadow-lg transform hover:scale-105 transition">
									<p className="text-sm text-orange-600 font-bold uppercase tracking-wider">Health</p>
									<p className="text-4xl font-black text-orange-700 mt-2">{companion.health}</p>
									<p className="text-xs text-orange-500 mt-1">Out of 100</p>
								</div>

								<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-300 text-center shadow-lg transform hover:scale-105 transition">
									<p className="text-sm text-purple-600 font-bold uppercase tracking-wider">Adventure</p>
									<p className="text-4xl font-black text-purple-700 mt-2">{companion.adventureProgress}%</p>
									<p className="text-xs text-purple-500 mt-1">Progress</p>
								</div>
							</div>

							{/* XP Progress Section */}
							<div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-2xl border-2 border-cyan-300 mb-10">
								<h3 className="text-xl font-bold text-gray-800 mb-4">📈 Experience to Next Level</h3>
								<div className="mb-4">
									<div className="flex justify-between mb-2">
										<span className="text-sm font-semibold text-gray-700">
											{companion.experience} / {100 * companion.level} XP
										</span>
										<span className="text-sm font-semibold text-cyan-600">
											{Math.round((companion.experience / (100 * companion.level)) * 100)}%
										</span>
									</div>
									<div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
										<div
											className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 shadow-lg"
											style={{
												width: `${Math.min((companion.experience / (100 * companion.level)) * 100, 100)}%`,
											}}
										/>
									</div>
								</div>
								<p className="text-sm text-gray-600">Earn more XP by completing quests and caring for your bear!</p>
							</div>

							{/* Achievements Section */}
							<div className="mb-10">
								<h3 className="text-2xl font-bold text-gray-800 mb-6">🏅 Unlocked Achievements</h3>
								{companion.unlockedAchievements && companion.unlockedAchievements.length > 0 ? (
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
										{companion.unlockedAchievements.map((achievement, idx) => (
											<div
												key={idx}
												className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl border-2 border-yellow-400 text-center shadow-lg transform hover:scale-110 transition">
												<p className="text-3xl mb-2">🏆</p>
												<p className="text-xs font-bold text-gray-800">{achievement}</p>
											</div>
										))}
									</div>
								) : (
									<div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border-2 border-gray-300 text-center">
										<p className="text-gray-600 font-semibold">
											No achievements yet. Complete quests and care for your bear to earn badges!
										</p>
									</div>
								)}
							</div>

							{/* Evolution Milestones */}
							<div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-300">
								<h3 className="text-2xl font-bold text-gray-800 mb-6">🎯 Evolution Milestones</h3>
								<div className="space-y-4">
									<div className="flex items-center gap-4 p-4 bg-white rounded-xl border-l-4 border-blue-500">
										<div
											className={`w-4 h-4 rounded-full ${companion.level >= 5 ? "bg-emerald-500" : "bg-gray-300"} flex-shrink-0`}></div>
										<div className="flex-1">
											<p className="font-semibold text-gray-800">Reach Level 5</p>
											<p className="text-sm text-gray-600">Evolve to Juvenile Stage</p>
										</div>
										{companion.level >= 5 && <span className="text-xl">✨</span>}
									</div>

									<div className="flex items-center gap-4 p-4 bg-white rounded-xl border-l-4 border-cyan-500">
										<div
											className={`w-4 h-4 rounded-full ${companion.level >= 10 ? "bg-emerald-500" : "bg-gray-300"} flex-shrink-0`}></div>
										<div className="flex-1">
											<p className="font-semibold text-gray-800">Reach Level 10</p>
											<p className="text-sm text-gray-600">Evolve to Adolescent Stage</p>
										</div>
										{companion.level >= 10 && <span className="text-xl">✨</span>}
									</div>

									<div className="flex items-center gap-4 p-4 bg-white rounded-xl border-l-4 border-indigo-500">
										<div
											className={`w-4 h-4 rounded-full ${companion.level >= 20 ? "bg-emerald-500" : "bg-gray-300"} flex-shrink-0`}></div>
										<div className="flex-1">
											<p className="font-semibold text-gray-800">Reach Level 20</p>
											<p className="text-sm text-gray-600">Evolve to Adult Stage - Ultimate Power!</p>
										</div>
										{companion.level >= 20 && <span className="text-xl">✨</span>}
									</div>

									<div className="flex items-center gap-4 p-4 bg-white rounded-xl border-l-4 border-yellow-500">
										<div
											className={`w-4 h-4 rounded-full ${companion.totalPoints >= 1000 ? "bg-emerald-500" : "bg-gray-300"} flex-shrink-0`}></div>
										<div className="flex-1">
											<p className="font-semibold text-gray-800">Earn 1,000 Points</p>
											<p className="text-sm text-gray-600">Become a Points Master!</p>
										</div>
										{companion.totalPoints >= 1000 && <span className="text-xl">✨</span>}
									</div>

									<div className="flex items-center gap-4 p-4 bg-white rounded-xl border-l-4 border-green-500">
										<div
											className={`w-4 h-4 rounded-full ${companion.streakDays >= 30 ? "bg-emerald-500" : "bg-gray-300"} flex-shrink-0`}></div>
										<div className="flex-1">
											<p className="font-semibold text-gray-800">30-Day Streak</p>
											<p className="text-sm text-gray-600">Unstoppable Commitment!</p>
										</div>
										{companion.streakDays >= 30 && <span className="text-xl">✨</span>}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Daily Check-In Modal */}
			{showCheckIn && <DailyCheckInModal onClose={() => setShowCheckIn(false)} />}

			{/* Pet Naming Modal */}
			{showNaming && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
					<div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 sm:p-12 max-w-sm w-full shadow-2xl border-3 border-cyan-300">
						<h2 className="text-3xl font-black text-center mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
							❄️ Name Your Polar Bear Cub
						</h2>
						<p className="text-gray-700 text-center mb-8 font-semibold">
							What would you like to call your adventure companion?
						</p>
						<input
							type="text"
							value={petName}
							onChange={(e) => setPetName(e.target.value)}
							placeholder="e.g., Snowball, Frostbite, Aurora"
							maxLength={20}
							className="w-full px-4 py-3 border-2 border-cyan-400 rounded-xl focus:ring-4 focus:ring-cyan-300 focus:border-transparent mb-6 font-semibold text-lg"
							onKeyDown={(e) => e.key === "Enter" && petName.trim() && handlePetNaming(petName)}
							autoFocus
						/>
						<button
							onClick={() => petName.trim() && handlePetNaming(petName)}
							disabled={!petName.trim()}
							className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition transform hover:scale-105 text-lg shadow-lg">
							🎉 Welcome {petName || "Your Cub"}!
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
