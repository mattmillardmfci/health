import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { DailyCheckIn, CompanionStats } from "../types";

interface DailyCheckInProps {
	onClose: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInProps> = ({ onClose }) => {
	const { currentUser, updateUser } = useUsers();
	const [mood, setMood] = useState(3);
	const [energy, setEnergy] = useState(3);
	const [stress, setStress] = useState(3);
	const [response, setResponse] = useState("");
	const [submitted, setSubmitted] = useState(false);

	if (!currentUser || !currentUser.companion) return null;

	const handleSubmit = () => {
		if (!response.trim()) return;

		const companion = currentUser.companion!;
		const bonusPoints = mood + energy + (5 - stress); // Higher mood/energy and lower stress = more points

		const checkIn: DailyCheckIn = {
			id: Date.now().toString(),
			userId: currentUser.id,
			date: new Date(),
			mood,
			energy,
			stress,
			response,
			companionBondPoints: bonusPoints,
		};

		// Update companion stats based on check-in
		const updatedCompanion: CompanionStats = {
			...companion,
			happiness: Math.min(100, companion.happiness + Math.floor(bonusPoints / 2)),
			energy: Math.min(100, companion.energy + energy * 5),
			experience: companion.experience + bonusPoints * 2,
			totalPoints: companion.totalPoints + bonusPoints,
			streakDays: isNewDay() ? companion.streakDays + 1 : companion.streakDays,
		};

		// Level up if XP >= 1000
		if (updatedCompanion.experience >= 1000) {
			updatedCompanion.level += 1;
			updatedCompanion.experience = updatedCompanion.experience - 1000;
		}

		const updated = {
			...currentUser,
			companion: updatedCompanion,
		};
		updateUser(updated);
		setSubmitted(true);
	};

	const isNewDay = () => {
		const lastCheckIn = new Date(currentUser.companion!.lastFed || new Date());
		const today = new Date();
		return lastCheckIn.toDateString() !== today.toDateString();
	};

	const getMoodEmoji = (value: number) => {
		switch (value) {
			case 1:
				return "😢";
			case 2:
				return "😕";
			case 3:
				return "😐";
			case 4:
				return "🙂";
			case 5:
				return "😄";
			default:
				return "😐";
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl">
				{!submitted ? (
					<>
						<h2 className="text-2xl font-bold text-gray-800 mb-2">Good morning! ☀️</h2>
						<p className="text-gray-600 text-sm mb-6">Let your bear know how you're doing today</p>

						{/* Mood */}
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<label className="font-semibold text-gray-700">How's your mood?</label>
								<span className="text-2xl">{getMoodEmoji(mood)}</span>
							</div>
							<input
								type="range"
								min="1"
								max="5"
								value={mood}
								onChange={(e) => setMood(parseInt(e.target.value))}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-600 mt-1">
								<span>Very sad</span>
								<span>Very happy</span>
							</div>
						</div>

						{/* Energy */}
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<label className="font-semibold text-gray-700">Energy level?</label>
								<span className="text-2xl">
									{energy === 1 ? "😴" : energy === 2 ? "🥱" : energy === 3 ? "😐" : energy === 4 ? "⚡" : "🚀"}
								</span>
							</div>
							<input
								type="range"
								min="1"
								max="5"
								value={energy}
								onChange={(e) => setEnergy(parseInt(e.target.value))}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-600 mt-1">
								<span>Very low</span>
								<span>Very high</span>
							</div>
						</div>

						{/* Stress */}
						<div className="mb-6">
							<div className="flex justify-between items-center mb-2">
								<label className="font-semibold text-gray-700">Stress level?</label>
								<span className="text-2xl">
									{stress === 1 ? "😌" : stress === 2 ? "🙂" : stress === 3 ? "😐" : stress === 4 ? "😰" : "😵"}
								</span>
							</div>
							<input
								type="range"
								min="1"
								max="5"
								value={stress}
								onChange={(e) => setStress(parseInt(e.target.value))}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-600 mt-1">
								<span>Very calm</span>
								<span>Very stressed</span>
							</div>
						</div>

						{/* Text Response */}
						<div className="mb-6">
							<label className="block font-semibold text-gray-700 mb-2">What's on your mind today?</label>
							<textarea
								value={response}
								onChange={(e) => setResponse(e.target.value)}
								placeholder="Tell your bear about your day, goals, or how you're feeling..."
								className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 h-20 resize-none text-sm"
							/>
						</div>

						{/* Buttons */}
						<div className="flex gap-2">
							<button
								onClick={onClose}
								className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition">
								Maybe later
							</button>
							<button
								onClick={handleSubmit}
								disabled={!response.trim()}
								className={`flex-1 px-4 py-2 rounded-lg transition font-semibold ${
									response.trim()
										? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
										: "bg-gray-200 text-gray-400 cursor-not-allowed"
								}`}>
								Submit Check-In
							</button>
						</div>
					</>
				) : (
					<div className="text-center py-8">
						<div className="text-5xl mb-4">🐻‍❄️💕</div>
						<h3 className="text-xl font-bold text-gray-800 mb-2">Great job!</h3>
						<p className="text-gray-600 mb-2">Your bear loved learning about your day!</p>
						<p className="text-sm text-cyan-600 font-semibold mb-6">+{mood + energy + (5 - stress)} companion points</p>
						<button
							onClick={onClose}
							className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition">
							Close
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
