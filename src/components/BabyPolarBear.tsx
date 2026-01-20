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

	// SVG Bear component - much more realistic and detailed
	const PolarBearSVG: React.FC<{ stage: "cub" | "juvenile" | "adolescent" | "adult"; mood: string }> = ({
		stage,
		mood,
	}) => {
		const sizes = {
			cub: 120,
			juvenile: 160,
			adolescent: 200,
			adult: 240,
		};
		const size = sizes[stage];

		// Proportions scale with stage
		const scale = stage === "cub" ? 0.8 : stage === "juvenile" ? 1 : stage === "adolescent" ? 1.2 : 1.4;

		// Eyes & mood
		const eyeY = mood === "sleeping" ? 32 * scale : 28 * scale;
		const eyeX1 = 40 * scale;
		const eyeX2 = 60 * scale;

		// Mouth expression
		let mouthD = "M 48 50 Q 50 54 52 50"; // neutral smile
		if (mood === "happy") {
			mouthD = "M 45 50 Q 50 58 55 50"; // big happy smile
		} else if (mood === "sad") {
			mouthD = "M 45 56 Q 50 50 55 56"; // sad frown
		} else if (mood === "hungry") {
			mouthD = "M 50 48 L 50 58 M 47 53 L 53 53"; // surprised open O
		}

		return (
			<svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
				<defs>
					<radialGradient id="bodyGrad" cx="40%" cy="40%">
						<stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: "#f0f0f0", stopOpacity: 1 }} />
					</radialGradient>
					<radialGradient id="faceGrad" cx="45%" cy="45%">
						<stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: "#ebebeb", stopOpacity: 1 }} />
					</radialGradient>
				</defs>

				{/* Main Body - thick and stocky */}
				<ellipse cx="50" cy="65" rx={28 * scale} ry={32 * scale} fill="url(#bodyGrad)" stroke="#c0c0c0" strokeWidth="1" />

				{/* Neck connector */}
				<rect x="42" y={36 * scale} width={16 * scale} height={8 * scale} rx="4" fill="url(#bodyGrad)" />

				{/* Head - rounder and bigger for cub appeal */}
				<circle cx="50" cy={28 * scale} r={18 * scale} fill="url(#faceGrad)" stroke="#c0c0c0" strokeWidth="1" />

				{/* Ears - rounded and positioned higher */}
				<circle
					cx={35 * scale}
					cy={10 * scale}
					r={6 * scale}
					fill="url(#bodyGrad)"
					stroke="#c0c0c0"
					strokeWidth="0.8"
				/>
				<circle
					cx={65 * scale}
					cy={10 * scale}
					r={6 * scale}
					fill="url(#bodyGrad)"
					stroke="#c0c0c0"
					strokeWidth="0.8"
				/>

				{/* Inner ear details - pink */}
				<circle cx={35 * scale} cy={10 * scale} r={3 * scale} fill="#ffb3ba" opacity="0.7" />
				<circle cx={65 * scale} cy={10 * scale} r={3 * scale} fill="#ffb3ba" opacity="0.7" />

				{/* Snout/Muzzle - prominent and dark */}
				<ellipse cx="50" cy={42 * scale} rx={12 * scale} ry={10 * scale} fill="#e8e8e8" stroke="#b0b0b0" strokeWidth="0.8" />

				{/* Nose - black and prominent */}
				<ellipse cx="50" cy={44 * scale} rx={3.5 * scale} ry={4 * scale} fill="#000000" />

				{/* Eyes - large and expressive */}
				<circle cx={eyeX1} cy={eyeY} r={3.5 * scale} fill="#1a1a1a" />
				<circle cx={eyeX2} cy={eyeY} r={3.5 * scale} fill="#1a1a1a" />

				{/* Eye shine - adds life to the eyes */}
				<circle cx={eyeX1 - 1 * scale} cy={eyeY - 1 * scale} r={1 * scale} fill="white" opacity="0.8" />
				<circle cx={eyeX2 - 1 * scale} cy={eyeY - 1 * scale} r={1 * scale} fill="white" opacity="0.8" />

				{/* Eyebrows - for mood expression */}
				{mood === "happy" && (
					<>
						<path d={`M ${37 * scale} ${22 * scale} Q ${40 * scale} ${20 * scale} ${43 * scale} ${22 * scale}`} stroke="#999" strokeWidth="1" fill="none" strokeLinecap="round" />
						<path d={`M ${57 * scale} ${22 * scale} Q ${60 * scale} ${20 * scale} ${63 * scale} ${22 * scale}`} stroke="#999" strokeWidth="1" fill="none" strokeLinecap="round" />
					</>
				)}
				{mood === "sad" && (
					<>
						<path d={`M ${37 * scale} ${20 * scale} Q ${40 * scale} ${22 * scale} ${43 * scale} ${20 * scale}`} stroke="#999" strokeWidth="1" fill="none" strokeLinecap="round" />
						<path d={`M ${57 * scale} ${20 * scale} Q ${60 * scale} ${22 * scale} ${63 * scale} ${20 * scale}`} stroke="#999" strokeWidth="1" fill="none" strokeLinecap="round" />
					</>
				)}

				{/* Mouth */}
				<path d={mouthD} stroke="#333" strokeWidth={1.2 * scale} fill="none" strokeLinecap="round" strokeLinejoin="round" />

				{/* Front Paws - realistic and proportional */}
				{stage !== "cub" && (
					<>
						{/* Left paw */}
						<ellipse
							cx={32 * scale}
							cy={85 * scale}
							rx={8 * scale}
							ry={11 * scale}
							fill="url(#bodyGrad)"
							stroke="#c0c0c0"
							strokeWidth="0.8"
						/>
						{/* Paw pads - left */}
						<circle cx={32 * scale} cy={90 * scale} r={2 * scale} fill="#ffb3ba" opacity="0.6" />

						{/* Right paw */}
						<ellipse
							cx={68 * scale}
							cy={85 * scale}
							rx={8 * scale}
							ry={11 * scale}
							fill="url(#bodyGrad)"
							stroke="#c0c0c0"
							strokeWidth="0.8"
						/>
						{/* Paw pads - right */}
						<circle cx={68 * scale} cy={90 * scale} r={2 * scale} fill="#ffb3ba" opacity="0.6" />
					</>
				)}

				{/* Belly spot - grows with bear */}
				{(stage === "adolescent" || stage === "adult") && (
					<ellipse cx="50" cy={68 * scale} rx={13 * scale} ry={16 * scale} fill="#e0e0e0" opacity="0.6" />
				)}

				{/* Claws on paws - visible on larger bears */}
				{stage !== "cub" && (
					<>
						<line x1={32 * scale} y1={92 * scale} x2={32 * scale} y2={96 * scale} stroke="#999" strokeWidth="0.8" />
						<line x1={68 * scale} y1={92 * scale} x2={68 * scale} y2={96 * scale} stroke="#999" strokeWidth="0.8" />
					</>
				)}

				{/* Cheeks - adds cuteness */}
				<circle cx={28 * scale} cy={32 * scale} r={2.5 * scale} fill="#ffcccc" opacity="0.4" />
				<circle cx={72 * scale} cy={32 * scale} r={2.5 * scale} fill="#ffcccc" opacity="0.4" />
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
