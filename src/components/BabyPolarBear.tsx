import React, { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import type { CompanionStats } from "../types";

export const BabyPolarBear: React.FC<{ onQuest?: () => void }> = ({ onQuest }) => {
	const { currentUser, updateUser } = useUsers();
	const [bearAnimation, setBearAnimation] = useState<"idle" | "happy" | "sad" | "hungry" | "sleeping">("idle");

	if (!currentUser) return null;

	const companion = currentUser.companion;
	if (!companion) return null;

	useEffect(() => {
		// Change bear mood based on stats
		if (companion.happiness > 80) {
			setBearAnimation("happy");
		} else if (companion.hunger > 80) {
			setBearAnimation("hungry");
		} else if (companion.energy < 20) {
			setBearAnimation("sleeping");
		} else if (companion.happiness < 30) {
			setBearAnimation("sad");
		} else {
			setBearAnimation("idle");
		}
	}, [companion.happiness, companion.hunger, companion.energy]);

	const handleFeed = () => {
		if (!companion) return;
		const updated = {
			...currentUser,
			companion: {
				...companion,
				hunger: Math.max(0, companion.hunger - 25),
				happiness: Math.min(100, companion.happiness + 10),
				lastFed: new Date(),
			},
		};
		updateUser(updated);
	};

	const handlePlay = () => {
		if (!companion) return;
		const updated = {
			...currentUser,
			companion: {
				...companion,
				happiness: Math.min(100, companion.happiness + 20),
				energy: Math.max(0, companion.energy - 15),
				hunger: Math.min(100, companion.hunger + 10),
			},
		};
		updateUser(updated);
	};

	const handleRest = () => {
		if (!companion) return;
		const updated = {
			...currentUser,
			companion: {
				...companion,
				energy: Math.min(100, companion.energy + 30),
				hunger: Math.min(100, companion.hunger + 5),
			},
		};
		updateUser(updated);
	};

	const getBearEmoji = () => {
		switch (bearAnimation) {
			case "happy":
				return "🐻‍❄️😄";
			case "hungry":
				return "🐻‍❄️😋";
			case "sad":
				return "🐻‍❄️😢";
			case "sleeping":
				return "🐻‍❄️😴";
			default:
				return "🐻‍❄️";
		}
	};

	const getPetGrowthEmoji = () => {
		switch (companion.stage) {
			case "cub":
				return "🐻‍❄️"; // Cub
			case "juvenile":
				return "🐻"; // Bigger bear
			case "adolescent":
				return "🐻‍❄️"; // Full bear
			case "adult":
				return "🦌"; // Majestic adult (different creature symbol)
			default:
				return "🐻‍❄️";
		}
	};

	const getGrowthText = () => {
		switch (companion.stage) {
			case "cub":
				return "Your Little Cub (Lvl 1-19)";
			case "juvenile":
				return "Growing Young Bear (Lvl 20-39)";
			case "adolescent":
				return "Maturing Adolescent (Lvl 40-59)";
			case "adult":
				return "Magnificent Adult (Lvl 60+)";
			default:
				return "Your Companion";
		}
	};

	const getStatColor = (value: number): string => {
		if (value >= 75) return "text-emerald-600";
		if (value >= 50) return "text-blue-600";
		if (value >= 25) return "text-orange-600";
		return "text-red-600";
	};

	const getStatBar = (value: number): string => {
		if (value >= 75) return "bg-emerald-500";
		if (value >= 50) return "bg-blue-500";
		if (value >= 25) return "bg-orange-500";
		return "bg-red-500";
	};

	return (
		<div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-6 rounded-2xl border-3 border-cyan-300 shadow-lg">
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<div>
					<h3 className="text-lg sm:text-xl font-bold text-gray-800">{companion.name}</h3>
					<p className="text-xs sm:text-sm text-gray-600">{getGrowthText()}</p>
				</div>
				<div className="text-right">
					<p className="text-sm font-semibold text-blue-600">{companion.totalPoints} pts</p>
					<p className="text-xs text-gray-600">{companion.streakDays} day streak 🔥</p>
				</div>
			</div>

			{/* Bear Display with Growth */}
			<div className="text-center py-6">
				<div
					className={`text-7xl sm:text-8xl transition-transform duration-300 ${bearAnimation === "happy" ? "scale-110" : ""}`}>
					{companion.stage === "cub"
						? "🐻‍❄️"
						: companion.stage === "juvenile"
							? "🐻"
							: companion.stage === "adolescent"
								? "🐻"
								: "🦌"}
				</div>
				<p className="text-sm sm:text-base text-gray-600 mt-2 h-5">
					{bearAnimation === "happy" && "Your bear is so happy! 💕"}
					{bearAnimation === "hungry" && "Your bear is starving... 🍖"}
					{bearAnimation === "sad" && "Your bear misses you... 🥺"}
					{bearAnimation === "sleeping" && "Your bear is taking a nap... 💤"}
					{bearAnimation === "idle" && "Your bear is waiting for you!"}
				</p>
				<p className="text-xs text-purple-600 font-semibold mt-2">
					{companion.stage === "cub" && "Keep caring for your cub! Level 20 → Juvenile"}
					{companion.stage === "juvenile" && "Growing strong! Level 40 → Adolescent"}
					{companion.stage === "adolescent" && "Almost there! Level 60 → Adult"}
					{companion.stage === "adult" && "Your companion has reached full glory! 👑"}
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-3 mb-6">
				{/* Happiness */}
				<div>
					<div className="flex justify-between items-center mb-1">
						<label className="text-xs font-semibold text-gray-700">Happiness</label>
						<span className={`text-xs font-bold ${getStatColor(companion.happiness)}`}>{companion.happiness}</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all ${getStatBar(companion.happiness)}`}
							style={{ width: `${companion.happiness}%` }}
						/>
					</div>
				</div>

				{/* Hunger */}
				<div>
					<div className="flex justify-between items-center mb-1">
						<label className="text-xs font-semibold text-gray-700">Hunger</label>
						<span className={`text-xs font-bold ${getStatColor(100 - companion.hunger)}`}>{companion.hunger}</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all ${getStatBar(100 - companion.hunger)}`}
							style={{ width: `${100 - companion.hunger}%` }}
						/>
					</div>
				</div>

				{/* Energy */}
				<div>
					<div className="flex justify-between items-center mb-1">
						<label className="text-xs font-semibold text-gray-700">Energy</label>
						<span className={`text-xs font-bold ${getStatColor(companion.energy)}`}>{companion.energy}</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all ${getStatBar(companion.energy)}`}
							style={{ width: `${companion.energy}%` }}
						/>
					</div>
				</div>

				{/* Health */}
				<div>
					<div className="flex justify-between items-center mb-1">
						<label className="text-xs font-semibold text-gray-700">Health</label>
						<span className={`text-xs font-bold ${getStatColor(companion.health)}`}>{companion.health}</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all ${getStatBar(companion.health)}`}
							style={{ width: `${companion.health}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Adventure Progress */}
			<div className="mb-6 p-3 bg-white rounded-lg border border-cyan-200">
				<div className="flex justify-between items-center mb-2">
					<p className="text-xs font-semibold text-gray-700">
						Adventure Progress: {companion.currentAdventure || "Waiting for first quest"}
					</p>
					<span className="text-xs font-bold text-cyan-600">{companion.adventureProgress}%</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div
						className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
						style={{ width: `${companion.adventureProgress}%` }}
					/>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="grid grid-cols-3 gap-2 mb-4">
				<button
					onClick={handleFeed}
					className="px-3 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg text-xs sm:text-sm transition">
					🍖 Feed
				</button>
				<button
					onClick={handlePlay}
					className="px-3 py-2 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-lg text-xs sm:text-sm transition">
					🎮 Play
				</button>
				<button
					onClick={handleRest}
					className="px-3 py-2 bg-purple-400 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs sm:text-sm transition">
					😴 Rest
				</button>
			</div>

			{/* Quest Button */}
			<button
				onClick={onQuest}
				className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition">
				📋 View Quests
			</button>

			{/* XP Progress */}
			<div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
				<div className="flex justify-between items-center mb-2">
					<p className="text-xs font-semibold text-gray-700">Next Level XP</p>
					<span className="text-xs font-bold text-blue-600">{companion.experience}/1000</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all"
						style={{ width: `${(companion.experience / 1000) * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
};
