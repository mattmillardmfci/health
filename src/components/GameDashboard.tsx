import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { User, Task } from "../types";
import { awardXpToCompanion, checkTaskQuests } from "../utils/taskUtils";

interface GameDashboardProps {
	currentUser: User;
	onNavigate: (view: string) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ currentUser, onNavigate }) => {
	const { updateUser } = useUsers();
	const [localUser, setLocalUser] = useState(currentUser);

	// Categorize tasks
	const morningRoutines =
		localUser.tasks.filter((t) => !t.isRecurring || t.isRecurring) &&
		localUser.tasks.filter((t) => t.category === "morning" || t.label?.includes("morning"));
	const anytimeTasks = localUser.tasks.filter(
		(t) => !t.isRecurring || (t.isRecurring && !t.label?.includes("morning")),
	);

	// Get today's date
	const today = new Date().toISOString().split("T")[0];

	// Count completed today
	const completedToday = localUser.tasks.filter((t) => {
		const completedDate = t.completedDate ? new Date(t.completedDate).toISOString().split("T")[0] : null;
		return completedDate === today;
	}).length;

	// Handle task completion with XP reward
	const handleTaskComplete = (task: Task) => {
		const updatedUser = { ...localUser };
		const taskIndex = updatedUser.tasks.findIndex((t) => t.id === task.id);

		if (taskIndex !== -1) {
			const xpReward = (task.reward || 10) + 10; // Base 10 + task reward

			// Update task
			updatedUser.tasks[taskIndex] = {
				...task,
				completed: true,
				completedDate: new Date(),
			};

			// Award XP to companion
			if (updatedUser.companion) {
				const { companion: updatedCompanion, leveledUp } = awardXpToCompanion(updatedUser.companion, xpReward);
				updatedUser.companion = updatedCompanion;
			}

			// Check quests
			const { updatedQuests } = checkTaskQuests(updatedUser, task.id, false);
			updatedUser.quests = updatedQuests;

			setLocalUser(updatedUser);
			updateUser(updatedUser);
		}
	};

	const companion = localUser.companion;
	const nextLevelXp = 100 * (companion.level || 1);
	const currentXp = companion.experience || 0;
	const xpProgress = (currentXp / nextLevelXp) * 100;

	// Get stage emoji
	const stageEmoji =
		{
			cub: "🐻‍❄️",
			juvenile: "❄️🐻",
			adolescent: "🐻‍❄️💪",
			adult: "🐻‍❄️👑",
		}[companion.stage || "cub"] || "🐻‍❄️";

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
			{/* Companion Status Card - Game Style */}
			<div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl border-4 border-purple-200 p-8 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
					{/* Bear Display */}
					<div className="text-center">
						<div className="text-8xl mb-4 animate-bounce">{stageEmoji}</div>
						<h1 className="text-3xl font-black text-slate-800">{companion.name}</h1>
						<p className="text-slate-600 text-lg mt-2">
							Level {companion.level || 1} {companion.stage}
						</p>
						<p className="text-slate-500 text-sm mt-1">
							Happiness: {"❤️".repeat(Math.ceil((companion.happiness || 50) / 20))}
						</p>
					</div>

					{/* Stats Panel */}
					<div className="space-y-4">
						{/* Level Progress */}
						<div>
							<div className="flex justify-between items-center mb-2">
								<span className="font-bold text-slate-800">XP Progress</span>
								<span className="text-sm text-slate-600">
									{Math.floor(currentXp)} / {nextLevelXp}
								</span>
							</div>
							<div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden border-2 border-slate-300">
								<div
									className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
									style={{ width: `${xpProgress}%` }}>
									{xpProgress > 10 && `${Math.round(xpProgress)}%`}
								</div>
							</div>
						</div>

						{/* Companion Stats Grid */}
						<div className="grid grid-cols-2 gap-3">
							<div className="bg-white rounded-xl p-3 border-2 border-red-200">
								<p className="text-xs text-slate-600">Hunger</p>
								<div className="text-xl font-bold text-red-600">{companion.hunger || 20}%</div>
							</div>
							<div className="bg-white rounded-xl p-3 border-2 border-blue-200">
								<p className="text-xs text-slate-600">Energy</p>
								<div className="text-xl font-bold text-blue-600">{companion.energy || 70}%</div>
							</div>
							<div className="bg-white rounded-xl p-3 border-2 border-green-200">
								<p className="text-xs text-slate-600">Health</p>
								<div className="text-xl font-bold text-green-600">{companion.health || 90}%</div>
							</div>
							<div className="bg-white rounded-xl p-3 border-2 border-purple-200">
								<p className="text-xs text-slate-600">Cleanliness</p>
								<div className="text-xl font-bold text-purple-600">{companion.cleanliness || 80}%</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Daily Challenge Section */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
					<span>🎮</span> Daily Challenges
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300">
						<p className="text-sm text-slate-600 mb-2">Morning Champion</p>
						<p className="text-2xl font-bold text-blue-700">3/5</p>
						<p className="text-xs text-slate-500 mt-2">Complete 5 morning routines</p>
					</div>
					<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-300">
						<p className="text-sm text-slate-600 mb-2">Task Master</p>
						<p className="text-2xl font-bold text-emerald-700">{completedToday}/10</p>
						<p className="text-xs text-slate-500 mt-2">Complete 10 tasks today</p>
					</div>
					<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
						<p className="text-sm text-slate-600 mb-2">Streak Bonus</p>
						<p className="text-2xl font-bold text-purple-700">{companion.streakDays || 0} 🔥</p>
						<p className="text-xs text-slate-500 mt-2">Days in a row</p>
					</div>
				</div>
			</div>

			{/* Tasks Grid - Game Style */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Morning Routines */}
				<div>
					<h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
						<span>🌅</span> Morning Routines
					</h3>
					<div className="space-y-3">
						{anytimeTasks
							.filter((t) => t.label?.includes("morning"))
							.slice(0, 5)
							.map((task) => (
								<TaskCard
									key={task.id}
									task={task}
									onComplete={() => handleTaskComplete(task)}
									xpReward={(task.reward || 10) + 10}
								/>
							))}
						{anytimeTasks.filter((t) => t.label?.includes("morning")).length === 0 && (
							<p className="text-slate-500 text-sm p-4 bg-slate-50 rounded-lg">No morning tasks yet</p>
						)}
					</div>
				</div>

				{/* Anytime Tasks */}
				<div>
					<h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
						<span>⭐</span> Quests
					</h3>
					<div className="space-y-3">
						{anytimeTasks
							.filter((t) => !t.label?.includes("morning"))
							.slice(0, 5)
							.map((task) => (
								<TaskCard
									key={task.id}
									task={task}
									onComplete={() => handleTaskComplete(task)}
									xpReward={(task.reward || 10) + 10}
								/>
							))}
						{anytimeTasks.filter((t) => !t.label?.includes("morning")).length === 0 && (
							<p className="text-slate-500 text-sm p-4 bg-slate-50 rounded-lg">No quests yet</p>
						)}
					</div>
					<button
						onClick={() => onNavigate("goals")}
						className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition transform hover:scale-105">
						📋 View All Tasks
					</button>
				</div>
			</div>

			{/* Power-ups & Actions */}
			<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
				<button
					onClick={() => onNavigate("companion")}
					className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-4 font-bold hover:shadow-lg transition transform hover:scale-105 text-center">
					<div className="text-2xl mb-2">🐻‍❄️</div>
					<div className="text-sm">Companion</div>
				</button>
				<button
					onClick={() => onNavigate("meals")}
					className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-4 font-bold hover:shadow-lg transition transform hover:scale-105 text-center">
					<div className="text-2xl mb-2">🍽️</div>
					<div className="text-sm">Meals</div>
				</button>
				<button
					onClick={() => onNavigate("results")}
					className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-4 font-bold hover:shadow-lg transition transform hover:scale-105 text-center">
					<div className="text-2xl mb-2">💪</div>
					<div className="text-sm">Nutrition</div>
				</button>
				<button
					onClick={() => onNavigate("activity")}
					className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-4 font-bold hover:shadow-lg transition transform hover:scale-105 text-center">
					<div className="text-2xl mb-2">🏃</div>
					<div className="text-sm">Activity</div>
				</button>
			</div>
		</div>
	);
};

interface TaskCardProps {
	task: Task;
	onComplete: () => void;
	xpReward: number;
}

function TaskCard({ task, onComplete, xpReward }: TaskCardProps) {
	return (
		<div
			className={`p-4 rounded-xl border-2 transition transform hover:scale-102 ${
				task.completed
					? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
					: "bg-white border-slate-300 hover:shadow-lg"
			}`}>
			<div className="flex items-center gap-3">
				<button
					onClick={onComplete}
					disabled={task.completed}
					className={`flex-shrink-0 w-8 h-8 rounded-lg font-bold text-lg transition ${
						task.completed ? "bg-green-500 text-white" : "bg-slate-200 hover:bg-blue-400 hover:text-white"
					}`}>
					{task.completed ? "✓" : "○"}
				</button>
				<div className="flex-1 min-w-0">
					<p className={`font-semibold text-sm ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
						{task.label}
					</p>
				</div>
				<div className="text-right flex-shrink-0">
					<div className="text-xs font-bold text-yellow-600">+{xpReward} XP</div>
				</div>
			</div>
		</div>
	);
}

export default GameDashboard;
