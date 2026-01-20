import React, { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import type { Quest, CompanionStats } from "../types";

type QuestNavigationCallback = (section: "meal" | "activity" | "journal" | "weight" | "goal") => void;

const generateQuests = (userId: string): Quest[] => {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	return [
		{
			id: "daily-meal-1",
			userId,
			title: "Nutritious Feast",
			description: "Log 3 meals today",
			type: "daily",
			linkedActivity: "meal",
			targetCount: 3,
			currentProgress: 0,
			rewardPoints: 30,
			rewardXP: 50,
			completed: false,
			expiresAt: tomorrow,
		},
		{
			id: "daily-activity-1",
			userId,
			title: "Let's Move!",
			description: "Log an activity session",
			type: "daily",
			linkedActivity: "activity",
			targetCount: 1,
			currentProgress: 0,
			rewardPoints: 25,
			rewardXP: 40,
			completed: false,
			expiresAt: tomorrow,
		},
		{
			id: "daily-journal-1",
			userId,
			title: "Share Your Thoughts",
			description: "Write a journal entry",
			type: "daily",
			linkedActivity: "journal",
			targetCount: 1,
			currentProgress: 0,
			rewardPoints: 20,
			rewardXP: 35,
			completed: false,
			expiresAt: tomorrow,
		},
		{
			id: "daily-weight-1",
			userId,
			title: "Check In",
			description: "Log your weight",
			type: "daily",
			linkedActivity: "weight",
			targetCount: 1,
			currentProgress: 0,
			rewardPoints: 15,
			rewardXP: 25,
			completed: false,
			expiresAt: tomorrow,
		},
		{
			id: "weekly-goal-1",
			userId,
			title: "Milestone March",
			description: "Make progress on a goal",
			type: "weekly",
			linkedActivity: "goal",
			targetCount: 1,
			currentProgress: 0,
			rewardPoints: 50,
			rewardXP: 100,
			completed: false,
			expiresAt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
		},
		{
			id: "challenge-streak-1",
			userId,
			title: "Week Warrior",
			description: "Check in for 7 days straight",
			type: "challenge",
			linkedActivity: "journal",
			targetCount: 7,
			currentProgress: 0,
			rewardPoints: 100,
			rewardXP: 250,
			completed: false,
			expiresAt: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
		},
		// Task-based quests
		{
			id: "task-morning-1",
			userId,
			title: "🌅 Morning Champion",
			description: "Complete 5 morning routine tasks",
			type: "task-chain",
			linkedActivity: "task",
			taskCategory: "morning",
			requiredTaskCompletions: 5,
			targetCount: 5,
			currentProgress: 0,
			rewardPoints: 50,
			rewardXP: 75,
			completed: false,
			expiresAt: tomorrow,
		},
		{
			id: "task-progression-1",
			userId,
			title: "⚡ Progressive Warrior",
			description: "Complete a progression chain (10→20→40 reps)",
			type: "task-chain",
			linkedActivity: "task",
			targetCount: 3,
			currentProgress: 0,
			rewardPoints: 100,
			rewardXP: 150,
			completed: false,
			expiresAt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
		},
		{
			id: "task-anytime-1",
			userId,
			title: "🎯 Task Master",
			description: "Complete 10 anytime tasks in a day",
			type: "task-chain",
			linkedActivity: "task",
			taskCategory: "anytime",
			requiredTaskCompletions: 10,
			targetCount: 10,
			currentProgress: 0,
			rewardPoints: 75,
			rewardXP: 120,
			completed: false,
			expiresAt: tomorrow,
		},
	];
};

export const QuestBoard: React.FC<{ onNavigate?: QuestNavigationCallback }> = ({ onNavigate }) => {
	const { currentUser, updateUser } = useUsers();
	const [quests, setQuests] = useState<Quest[]>([]);

	if (!currentUser || !currentUser.companion) return null;

	useEffect(() => {
		// Generate quests if not exists
		if (!currentUser.quests || currentUser.quests.length === 0) {
			const newQuests = generateQuests(currentUser.id);
			setQuests(newQuests);
		} else {
			setQuests(currentUser.quests);
		}
	}, [currentUser]);

	const handleCompleteQuest = (questId: string) => {
		const quest = quests.find((q) => q.id === questId);
		if (!quest) return;

		const companion = currentUser.companion!;
		const updatedCompanion: CompanionStats = {
			...companion,
			totalPoints: companion.totalPoints + quest.rewardPoints,
			experience: companion.experience + quest.rewardXP,
			happiness: Math.min(100, companion.happiness + 15),
			adventureProgress: Math.min(100, companion.adventureProgress + 10),
		};

		// Level up if XP >= 1000
		if (updatedCompanion.experience >= 1000) {
			updatedCompanion.level += 1;
			updatedCompanion.experience = updatedCompanion.experience - 1000;
		}

		const updatedQuests = quests.map((q) =>
			q.id === questId ? { ...q, completed: true, completedDate: new Date() } : q,
		);

		const updated = {
			...currentUser,
			companion: updatedCompanion,
			quests: updatedQuests,
		};

		updateUser(updated);
		setQuests(updatedQuests);
	};

	const getActivityIcon = (activity: string): string => {
		switch (activity) {
			case "meal":
				return "🍽️";
			case "activity":
				return "🏃";
			case "journal":
				return "📔";
			case "weight":
				return "⚖️";
			case "goal":
				return "🎯";
			default:
				return "📋";
		}
	};

	const getQuestColor = (type: string) => {
		switch (type) {
			case "daily":
				return "from-yellow-50 to-orange-50 border-orange-300";
			case "weekly":
				return "from-blue-50 to-cyan-50 border-cyan-300";
			case "challenge":
				return "from-purple-50 to-pink-50 border-pink-300";
			default:
				return "from-gray-50 to-gray-100 border-gray-300";
		}
	};

	const getQuestBadge = (type: string) => {
		switch (type) {
			case "daily":
				return "bg-orange-200 text-orange-800";
			case "weekly":
				return "bg-cyan-200 text-cyan-800";
			case "challenge":
				return "bg-pink-200 text-pink-800";
			default:
				return "bg-gray-200 text-gray-800";
		}
	};

	const activeQuests = quests.filter((q) => !q.completed);
	const completedQuests = quests.filter((q) => q.completed);

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-purple-100">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
						Quest Board
					</h2>
					<div className="text-3xl">📋</div>
				</div>

				{/* Active Quests */}
				<div className="mb-8">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Active Quests ({activeQuests.length})</h3>
					<div className="space-y-3">
						{activeQuests.length > 0 ? (
							activeQuests.map((quest) => (
								<div
									key={quest.id}
									className={`bg-gradient-to-br ${getQuestColor(quest.type)} p-4 rounded-lg border-2 transition hover:shadow-lg hover:scale-105 cursor-pointer`}
									onClick={() => onNavigate?.(quest.linkedActivity)}>
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-start gap-3 flex-1">
											<span className="text-2xl">{getActivityIcon(quest.linkedActivity)}</span>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<h4 className="font-semibold text-gray-800">{quest.title}</h4>
													<span className={`text-xs font-bold px-2 py-1 rounded-full ${getQuestBadge(quest.type)}`}>
														{quest.type.toUpperCase()}
													</span>
												</div>
												<p className="text-sm text-gray-600">{quest.description}</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-sm font-semibold text-cyan-600">+{quest.rewardPoints} pts</p>
											<p className="text-xs text-gray-600">+{quest.rewardXP} XP</p>
										</div>
									</div>

									{/* Progress Bar */}
									<div className="mb-3">
										<div className="flex justify-between items-center mb-1">
											<span className="text-xs font-semibold text-gray-700">
												Progress: {quest.currentProgress}/{quest.targetCount}
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
												style={{ width: `${(quest.currentProgress / quest.targetCount) * 100}%` }}
											/>
										</div>
									</div>

									{/* Complete Button */}
									{quest.currentProgress >= quest.targetCount ? (
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleCompleteQuest(quest.id);
											}}
											className="w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-lg transition text-sm">
											✓ Claim Reward
										</button>
									) : (
										<div className="w-full px-3 py-2 bg-gray-200 text-gray-600 font-semibold rounded-lg text-sm text-center">
											Click to log • {quest.targetCount - quest.currentProgress} to go
										</div>
									)}
								</div>
							))
						) : (
							<div className="text-center py-8 text-gray-500">
								<p>No active quests! Check back tomorrow for daily quests.</p>
							</div>
						)}
					</div>
				</div>

				{/* Completed Quests */}
				{completedQuests.length > 0 && (
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4">Completed ({completedQuests.length})</h3>
						<div className="space-y-2">
							{completedQuests.map((quest) => (
								<div
									key={quest.id}
									className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="text-xl">✓</span>
										<div>
											<p className="font-semibold text-gray-800">{quest.title}</p>
											<p className="text-xs text-gray-600">
												{quest.completedDate && new Date(quest.completedDate).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-xs font-bold text-emerald-600">+{quest.rewardPoints}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Quest Tips */}
				<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<p className="font-semibold text-blue-900 mb-2">💡 Quest Tips</p>
					<ul className="text-sm text-blue-800 space-y-1">
						<li>• Complete daily quests every day to build your streak</li>
						<li>• Each completed quest boosts your companion's stats</li>
						<li>• Earn XP to level up your bear (1000 XP = 1 level)</li>
						<li>• Weekly quests stay active for 7 days</li>
						<li>• Challenges are long-term goals with big rewards</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
