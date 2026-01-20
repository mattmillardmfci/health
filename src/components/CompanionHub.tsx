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

			const updated = { ...currentUser, companion: newCompanion, quests: [] };
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
		<div className="w-full">
			{/* Header */}
			<div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-2xl mb-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold mb-1">🐻‍❄️ {companion.name}'s Adventure</h1>
						<p className="text-cyan-100">Meet your life coach companion on this journey</p>
					</div>
					{!hasCheckedInToday && (
						<button
							onClick={() => setShowCheckIn(true)}
							className="px-6 py-3 bg-white text-cyan-600 font-bold rounded-lg hover:bg-cyan-50 transition">
							Daily Check-In
						</button>
					)}
				</div>
			</div>

			{/* Navigation */}
			<div className="flex gap-3 mb-6">
				<button
					onClick={() => setView("bear")}
					className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
						view === "bear" ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
					}`}>
					🐻‍❄️ Your Bear
				</button>
				<button
					onClick={() => setView("quests")}
					className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
						view === "quests" ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
					}`}>
					📋 Quests
				</button>
				<button
					onClick={() => setView("stats")}
					className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
						view === "stats" ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
					}`}>
					📊 Stats
				</button>
			</div>

			{/* Content */}
			{view === "bear" && (
				<div className="max-w-2xl">
					<BabyPolarBear onQuest={() => setView("quests")} />
				</div>
			)}

			{view === "quests" && <QuestBoard onNavigate={onQuestNavigate} />}

			{view === "stats" && (
				<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100 max-w-2xl">
					<h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">🏆 Companion Stats & Achievements</h2>

					{/* Main Stats Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
							<p className="text-xs text-gray-600 font-semibold">Level</p>
							<p className="text-3xl font-bold text-blue-600 mt-1">{companion.level}</p>
						</div>
						<div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
							<p className="text-xs text-gray-600 font-semibold">Total Points</p>
							<p className="text-3xl font-bold text-cyan-600 mt-1">{companion.totalPoints}</p>
						</div>
						<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
							<p className="text-xs text-gray-600 font-semibold">Streak Days</p>
							<p className="text-3xl font-bold text-yellow-600 mt-1">{companion.streakDays}</p>
						</div>
						<div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
							<p className="text-xs text-gray-600 font-semibold">Happiness</p>
							<p className="text-3xl font-bold text-pink-600 mt-1">{companion.happiness}/100</p>
						</div>
						<div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
							<p className="text-xs text-gray-600 font-semibold">Health</p>
							<p className="text-3xl font-bold text-orange-600 mt-1">{companion.health}/100</p>
						</div>
						<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
							<p className="text-xs text-gray-600 font-semibold">Adventure</p>
							<p className="text-3xl font-bold text-purple-600 mt-1">{companion.adventureProgress}%</p>
						</div>
					</div>

					{/* Achievements Section */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">🏅 Achievements</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
							{companion.unlockedAchievements && companion.unlockedAchievements.length > 0 ? (
								companion.unlockedAchievements.map((achievement, idx) => (
									<div
										key={idx}
										className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-300 text-center">
										<p className="text-2xl mb-1">🏆</p>
										<p className="text-xs font-semibold text-gray-800">{achievement}</p>
									</div>
								))
							) : (
								<p className="text-gray-600 col-span-full text-center py-4">
									No achievements yet. Complete quests and care for your bear!
								</p>
							)}
						</div>
					</div>

					{/* Milestones */}
					<div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-300">
						<h3 className="font-semibold text-gray-800 mb-3">🎯 Adventure Milestones</h3>
						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<div
									className={`w-3 h-3 rounded-full ${companion.level >= 5 ? "bg-emerald-500" : "bg-gray-300"}`}></div>
								<span className="text-sm text-gray-700">Reach Level 5</span>
								{companion.level >= 5 && <span className="text-xs text-emerald-600 font-bold">✓ COMPLETED</span>}
							</div>
							<div className="flex items-center gap-3">
								<div
									className={`w-3 h-3 rounded-full ${companion.totalPoints >= 500 ? "bg-emerald-500" : "bg-gray-300"}`}></div>
								<span className="text-sm text-gray-700">Earn 500 Points</span>
								{companion.totalPoints >= 500 && (
									<span className="text-xs text-emerald-600 font-bold">✓ COMPLETED</span>
								)}
							</div>
							<div className="flex items-center gap-3">
								<div
									className={`w-3 h-3 rounded-full ${companion.adventureProgress >= 100 ? "bg-emerald-500" : "bg-gray-300"}`}></div>
								<span className="text-sm text-gray-700">Complete Adventure (100%)</span>
								{companion.adventureProgress >= 100 && (
									<span className="text-xs text-emerald-600 font-bold">✓ COMPLETED</span>
								)}
							</div>
							<div className="flex items-center gap-3">
								<div
									className={`w-3 h-3 rounded-full ${companion.streakDays >= 30 ? "bg-emerald-500" : "bg-gray-300"}`}></div>
								<span className="text-sm text-gray-700">30-Day Streak</span>
								{companion.streakDays >= 30 && <span className="text-xs text-emerald-600 font-bold">✓ COMPLETED</span>}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Daily Check-In Modal */}
			{showCheckIn && <DailyCheckInModal onClose={() => setShowCheckIn(false)} />}

			{/* Pet Naming Modal */}
			{showNaming && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
						<h2 className="text-2xl font-bold text-center mb-4">🐻‍❄️ Name Your Polar Bear Cub</h2>
						<p className="text-gray-600 text-center mb-6">What would you like to call your companion?</p>
						<input
							type="text"
							value={petName}
							onChange={(e) => setPetName(e.target.value)}
							placeholder="e.g., Snowball, Frostbite, Aurora"
							maxLength={20}
							className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-4"
							onKeyDown={(e) => e.key === "Enter" && petName.trim() && handlePetNaming(petName)}
						/>
						<button
							onClick={() => petName.trim() && handlePetNaming(petName)}
							disabled={!petName.trim()}
							className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition">
							Welcome {petName || "Your Cub"}! 🎉
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
