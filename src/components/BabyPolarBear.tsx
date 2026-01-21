import React, { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { SnowballCub } from "./SnowballCub";

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

	return (
		<div className="w-full max-w-2xl mx-auto">
			{/* Title Section */}
			<div className="text-center mb-8">
				<h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Meet {companion.name}!</h2>
				<p className="text-gray-600">
					Level {companion.level} {companion.stage.charAt(0).toUpperCase() + companion.stage.slice(1)}
				</p>
			</div>

			{/* Bear Display */}
			<div className="bg-gradient-to-b from-blue-100 to-blue-50 rounded-3xl p-8 sm:p-12 mb-8 flex justify-center items-center min-h-[300px]">
				<div className="text-center">
					<SnowballCub stage={companion.stage} mood={bearAnimation} className="drop-shadow-2xl" />
					<p className="text-sm text-gray-600 mt-4 font-medium">
						{companion.stage === "cub" && "🐻‍❄️ A tiny cub learning about the world"}
						{companion.stage === "juvenile" && "🐻‍❄️ Growing stronger each day!"}
						{companion.stage === "adolescent" && "🐻‍❄️ A strong young bear"}
						{companion.stage === "adult" && "🐻‍❄️ A mighty polar bear!"}
					</p>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
				{/* Level & XP */}
				<div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
					<p className="text-xs text-purple-600 font-semibold uppercase mb-1">Level</p>
					<p className="text-2xl font-bold text-purple-700">{companion.level}</p>
				</div>

				{/* Experience */}
				<div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
					<p className="text-xs text-blue-600 font-semibold uppercase mb-1">XP</p>
					<p className="text-2xl font-bold text-blue-700">
						{companion.experience}/{100 * companion.level}
					</p>
				</div>

				{/* Happiness */}
				<div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
					<p className="text-xs text-pink-600 font-semibold uppercase mb-1">Happiness</p>
					<p className="text-2xl font-bold text-pink-700">{companion.happiness}%</p>
				</div>

				{/* Hunger */}
				<div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
					<p className="text-xs text-orange-600 font-semibold uppercase mb-1">Hunger</p>
					<p className="text-2xl font-bold text-orange-700">{companion.hunger}%</p>
				</div>

				{/* Energy */}
				<div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
					<p className="text-xs text-yellow-600 font-semibold uppercase mb-1">Energy</p>
					<p className="text-2xl font-bold text-yellow-700">{companion.energy}%</p>
				</div>

				{/* Total Points */}
				<div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
					<p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Total Points</p>
					<p className="text-2xl font-bold text-emerald-700">{companion.totalPoints}</p>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				<button
					onClick={handleFeed}
					className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition duration-200 shadow-md">
					🍖 Feed
				</button>
				<button
					onClick={handlePlay}
					className="px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-semibold transition duration-200 shadow-md">
					🎮 Play
				</button>
				<button
					onClick={handleRest}
					className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition duration-200 shadow-md">
					😴 Rest
				</button>
			</div>

			{/* Status and Info */}
			<div className="space-y-3 mb-8">
				<div className="bg-white rounded-lg p-4 border border-gray-200">
					<p className="text-sm text-gray-600 mb-2 font-semibold">Progress to Next Level:</p>
					<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
						<div
							className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
							style={{
								width: `${(companion.experience / (100 * companion.level)) * 100}%`,
							}}
						/>
					</div>
					<p className="text-xs text-gray-500 mt-2">
						{companion.experience} / {100 * companion.level} XP
					</p>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
						<p className="text-xs text-gray-500 font-semibold">Streak</p>
						<p className="text-lg font-bold text-blue-600">{companion.streakDays} days</p>
					</div>
					<div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
						<p className="text-xs text-gray-500 font-semibold">Current Quest</p>
						<p className="text-xs font-semibold text-gray-700">{companion.currentAdventure}</p>
					</div>
				</div>
			</div>

			{/* Quest Button */}
			<button
				onClick={onQuest}
				className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
				<span className="text-xl">📋</span>
				<span>View Quests & Challenges</span>
			</button>

			{/* Evolution Hint */}
			{companion.level >= 5 && companion.stage === "cub" && (
				<div className="mt-6 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 border border-blue-300 rounded-lg text-center">
					<p className="text-sm font-semibold text-blue-900">
						🎉 Your cub is ready to grow! Keep earning XP to evolve!
					</p>
				</div>
			)}
			{companion.level >= 10 && companion.stage === "juvenile" && (
				<div className="mt-6 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 border border-blue-300 rounded-lg text-center">
					<p className="text-sm font-semibold text-blue-900">
						🎉 Your bear is maturing! Reach level 10 for the Adolescent stage!
					</p>
				</div>
			)}
			{companion.level >= 20 && companion.stage === "adolescent" && (
				<div className="mt-6 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 border border-blue-300 rounded-lg text-center">
					<p className="text-sm font-semibold text-blue-900">
						🎉 Almost there! Reach level 20 to become a mighty Adult bear!
					</p>
				</div>
			)}
		</div>
	);
};
