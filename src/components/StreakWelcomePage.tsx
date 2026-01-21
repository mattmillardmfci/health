import React, { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { BabyPolarBear } from "./BabyPolarBear";

interface StreakWelcomePageProps {
	onContinue: () => void;
}

export const StreakWelcomePage: React.FC<StreakWelcomePageProps> = ({ onContinue }) => {
	const { currentUser } = useUsers();
	const [streak, setStreak] = useState(1);

	useEffect(() => {
		// Calculate streak from companion creation date
		if (currentUser?.companion) {
			const createdDate = new Date(currentUser.companion.createdAt);
			const today = new Date();
			const diffTime = today.getTime() - createdDate.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include creation day
			setStreak(Math.max(1, diffDays));
		}
	}, [currentUser]);

	const getDayOfWeek = (index: number) => {
		const days = ["T", "W", "T", "F", "S", "S", "M"];
		return days[index % 7];
	};

	const getWeekDays = () => {
		const days = [];
		for (let i = 0; i < 7; i++) {
			const isCompleted = i === 0; // Only first day is completed for now
			days.push({ day: getDayOfWeek(i), completed: isCompleted });
		}
		return days;
	};

	const weekDays = getWeekDays();

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
			{/* Radiant background effect */}
			<div className="absolute inset-0 opacity-30">
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl" />
			</div>

			<div className="relative z-10 w-full max-w-md text-center">
				{/* Companion */}
				<div className="mb-12 animate-bounce flex justify-center">
					<BabyPolarBear />
				</div>

				{/* Streak Display */}
				<div className="mb-8">
					<div className="text-8xl font-black text-white mb-2">{streak}</div>
					<h1 className="text-3xl font-black text-white tracking-wider">DAY STREAK</h1>
				</div>

				{/* Week Calendar */}
				<div className="bg-purple-600/50 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-purple-300">
					<div className="flex justify-between items-center gap-2">
						{weekDays.map((day, idx) => (
							<div key={idx} className="flex flex-col items-center gap-2">
								<span className="text-white text-sm font-semibold">{day.day}</span>
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
										day.completed
											? "bg-white shadow-lg"
											: idx === 2
												? "bg-purple-300 border-2 border-purple-200"
												: "bg-purple-400/40"
									}`}>
									{day.completed && <span className="text-2xl">✓</span>}
									{idx === 2 && !day.completed && <span className="text-xl">✨</span>}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Motivational Message */}
				<p className="text-white text-lg font-medium leading-relaxed mb-12">
					Great job! Open the app every day to maintain your self-care streak with{" "}
					<span className="font-bold">{currentUser?.companion?.name || "your cub"}</span>!
				</p>

				{/* Continue Button */}
				<button
					onClick={onContinue}
					className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 active:scale-95">
					Let's go!
				</button>
			</div>
		</div>
	);
};

export default StreakWelcomePage;
