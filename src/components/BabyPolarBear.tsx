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

	// SVG Bear component - realistic polar bear with proper proportions
	const PolarBearSVG: React.FC<{ stage: "cub" | "juvenile" | "adolescent" | "adult"; mood: string }> = ({
		stage,
		mood,
	}) => {
		const sizes = {
			cub: 140,
			juvenile: 180,
			adolescent: 220,
			adult: 260,
		};
		const size = sizes[stage];
		const scale = stage === "cub" ? 0.8 : stage === "juvenile" ? 1 : stage === "adolescent" ? 1.2 : 1.4;

		return (
			<svg width={size} height={size} viewBox="0 0 200 200" className="drop-shadow-2xl">
				<defs>
					<linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
						<stop offset="50%" style={{ stopColor: "#f5f5f5", stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: "#e8e8e8", stopOpacity: 1 }} />
					</linearGradient>
					<radialGradient id="faceGrad" cx="35%" cy="35%">
						<stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: "#f0f0f0", stopOpacity: 1 }} />
					</radialGradient>
					<filter id="shadow">
						<feGaussianBlur in="SourceGraphic" stdDeviation="2" />
					</filter>
				</defs>

				{/* Back Legs */}
				<ellipse
					cx={70 * scale}
					cy={160 * scale}
					rx={18 * scale}
					ry={20 * scale}
					fill="url(#bodyGrad)"
					stroke="#d0d0d0"
					strokeWidth="1.5"
				/>
				<ellipse
					cx={130 * scale}
					cy={160 * scale}
					rx={18 * scale}
					ry={20 * scale}
					fill="url(#bodyGrad)"
					stroke="#d0d0d0"
					strokeWidth="1.5"
				/>

				{/* Main Body - large and chunky like real polar bears */}
				<ellipse
					cx={100 * scale}
					cy={120 * scale}
					rx={40 * scale}
					ry={45 * scale}
					fill="url(#bodyGrad)"
					stroke="#d0d0d0"
					strokeWidth="1.5"
				/>

				{/* Front Legs */}
				<ellipse
					cx={70 * scale}
					cy={140 * scale}
					rx={16 * scale}
					ry={22 * scale}
					fill="url(#bodyGrad)"
					stroke="#d0d0d0"
					strokeWidth="1.5"
				/>
				<ellipse
					cx={130 * scale}
					cy={140 * scale}
					rx={16 * scale}
					ry={22 * scale}
					fill="url(#bodyGrad)"
					stroke="#d0d0d0"
					strokeWidth="1.5"
				/>

				{/* Paw pads on front legs */}
				<ellipse cx={70 * scale} cy={158 * scale} rx={8 * scale} ry={10 * scale} fill="#f5d5d8" opacity="0.7" />
				<ellipse cx={130 * scale} cy={158 * scale} rx={8 * scale} ry={10 * scale} fill="#f5d5d8" opacity="0.7" />

				{/* Neck */}
				<ellipse
					cx={100 * scale}
					cy={80 * scale}
					rx={28 * scale}
					ry={32 * scale}
					fill="url(#bodyGrad)"
					stroke="#d0d0d0"
					strokeWidth="1.5"
				/>

				{/* Head - realistic polar bear head shape */}
				<ellipse
					cx={100 * scale}
					cy={45 * scale}
					rx={32 * scale}
					ry={35 * scale}
					fill="url(#faceGrad)"
					stroke="#d0d0d0"
					strokeWidth="1.5"
				/>

				{/* Snout/Muzzle - extended like real polar bears */}
				<ellipse
					cx={100 * scale}
					cy={55 * scale}
					rx={22 * scale}
					ry={18 * scale}
					fill="#f5f5f5"
					stroke="#c0c0c0"
					strokeWidth="1"
				/>

				{/* Nose - black and realistic */}
				<ellipse cx={100 * scale} cy={60 * scale} rx={5.5 * scale} ry={6 * scale} fill="#000000" />

				{/* Mouth line */}
				<path
					d={`M ${100 * scale} ${60 * scale} Q ${100 * scale} ${68 * scale} ${100 * scale} ${72 * scale}`}
					stroke="#333"
					strokeWidth={1.5 * scale}
					fill="none"
					strokeLinecap="round"
				/>

				{/* Ears - positioned naturally on head */}
				<circle cx={72 * scale} cy={18 * scale} r={8 * scale} fill="url(#bodyGrad)" stroke="#d0d0d0" strokeWidth="1" />
				<circle cx={128 * scale} cy={18 * scale} r={8 * scale} fill="url(#bodyGrad)" stroke="#d0d0d0" strokeWidth="1" />

				{/* Inner ear details */}
				<circle cx={72 * scale} cy={18 * scale} r={4 * scale} fill="#e8d0d5" opacity="0.8" />
				<circle cx={128 * scale} cy={18 * scale} r={4 * scale} fill="#e8d0d5" opacity="0.8" />

				{/* Eyes - realistic and expressive */}
				<circle cx={82 * scale} cy={38 * scale} r={4.5 * scale} fill="#1a1a1a" stroke="#333" strokeWidth="0.8" />
				<circle cx={118 * scale} cy={38 * scale} r={4.5 * scale} fill="#1a1a1a" stroke="#333" strokeWidth="0.8" />

				{/* Eye highlights - gives life and dimension */}
				<circle cx={83 * scale} cy={36 * scale} r={1.8 * scale} fill="white" opacity="0.9" />
				<circle cx={119 * scale} cy={36 * scale} r={1.8 * scale} fill="white" opacity="0.9" />

				{/* Eyebrows for mood - subtle */}
				{mood === "happy" && (
					<>
						<path
							d={`M ${74 * scale} ${30 * scale} Q ${82 * scale} ${26 * scale} ${90 * scale} ${30 * scale}`}
							stroke="#888"
							strokeWidth={1.2 * scale}
							fill="none"
							strokeLinecap="round"
						/>
						<path
							d={`M ${110 * scale} ${30 * scale} Q ${118 * scale} ${26 * scale} ${126 * scale} ${30 * scale}`}
							stroke="#888"
							strokeWidth={1.2 * scale}
							fill="none"
							strokeLinecap="round"
						/>
					</>
				)}
				{mood === "sad" && (
					<>
						<path
							d={`M ${74 * scale} ${28 * scale} Q ${82 * scale} ${32 * scale} ${90 * scale} ${28 * scale}`}
							stroke="#888"
							strokeWidth={1.2 * scale}
							fill="none"
							strokeLinecap="round"
						/>
						<path
							d={`M ${110 * scale} ${28 * scale} Q ${118 * scale} ${32 * scale} ${126 * scale} ${28 * scale}`}
							stroke="#888"
							strokeWidth={1.2 * scale}
							fill="none"
							strokeLinecap="round"
						/>
					</>
				)}

				{/* Belly spot - lighter colored patch */}
				<ellipse cx={100 * scale} cy={125 * scale} rx={22 * scale} ry={28 * scale} fill="#ffffff" opacity="0.5" />
			</svg>
		);
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
					<PolarBearSVG stage={companion.stage} mood={bearAnimation} />
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
