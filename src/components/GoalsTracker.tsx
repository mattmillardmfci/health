import React, { useState } from "react";
import type { Goal, Milestone } from "../types";
import { useUsers } from "../hooks/useUsers";

export const GoalsTracker: React.FC = () => {
	const { currentUser, updateUser } = useUsers();
	const [targetWeight, setTargetWeight] = useState("");
	const [targetDate, setTargetDate] = useState("");
	const [showGoalForm, setShowGoalForm] = useState(false);

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const goals = currentUser.goals || [];
	const currentGoal = goals.length > 0 ? goals[goals.length - 1] : null;

	const handleCreateGoal = () => {
		if (!targetWeight || !targetDate) return;

		const target = parseFloat(targetWeight);
		const daysUntilTarget = Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
		const weeklyTarget = (currentUser.weight! - target) / (daysUntilTarget / 7);

		// Generate milestones every 10 lbs
		const milestones: Milestone[] = [];
		for (let i = 10; i < currentUser.weight! - target; i += 10) {
			milestones.push({
				id: Date.now().toString() + i,
				weight: currentUser.weight! - i,
				celebration: `🎉 Lost ${i} lbs! Keep it up!`,
			});
		}

		const newGoal: Goal = {
			id: Date.now().toString(),
			userId: currentUser.id,
			targetWeight: target,
			currentWeight: currentUser.weight!,
			startDate: new Date(),
			targetDate: new Date(targetDate),
			weeklyTarget,
			milestones,
			createdAt: new Date(),
		};

		const updated = { ...currentUser, goals: [...goals, newGoal] };
		updateUser(updated);
		setTargetWeight("");
		setTargetDate("");
		setShowGoalForm(false);
	};

	const getProgressPercentage = (goal: Goal) => {
		const totalLossNeeded = goal.currentWeight - goal.targetWeight;
		const currentLoss = goal.currentWeight - currentUser.weight!;
		return Math.min((currentLoss / totalLossNeeded) * 100, 100);
	};

	const getDaysRemaining = (goal: Goal) => {
		return Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
	};

	const getNextMilestone = (goal: Goal) => {
		return goal.milestones.find((m) => !m.reachedDate && m.weight < currentUser.weight!);
	};

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					Weight Loss Goals
				</h2>

				{currentGoal ? (
					<div className="space-y-8">
						{/* Current Goal */}
						<div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-6 sm:p-8 rounded-xl border-2 border-blue-200">
							<div className="flex justify-between items-start mb-6">
								<div>
									<p className="text-gray-600 text-sm font-semibold">TARGET WEIGHT</p>
									<p className="text-4xl font-bold text-blue-600">{currentGoal.targetWeight} lbs</p>
								</div>
								<div className="text-right">
									<p className="text-gray-600 text-sm font-semibold">DAYS LEFT</p>
									<p className="text-3xl font-bold text-emerald-600">{getDaysRemaining(currentGoal)} days</p>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="mb-6">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-semibold text-gray-700">Progress</span>
									<span className="text-sm font-bold text-blue-600">
										{getProgressPercentage(currentGoal).toFixed(0)}%
									</span>
								</div>
								<div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
										style={{ width: `${getProgressPercentage(currentGoal)}%` }}
									/>
								</div>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div className="bg-white p-4 rounded-lg">
									<p className="text-gray-600 text-xs font-semibold uppercase">Lost</p>
									<p className="text-2xl font-bold text-emerald-600">
										{(currentGoal.currentWeight - currentUser.weight!).toFixed(1)} lbs
									</p>
								</div>
								<div className="bg-white p-4 rounded-lg">
									<p className="text-gray-600 text-xs font-semibold uppercase">Remaining</p>
									<p className="text-2xl font-bold text-blue-600">
										{(currentUser.weight! - currentGoal.targetWeight).toFixed(1)} lbs
									</p>
								</div>
								<div className="bg-white p-4 rounded-lg">
									<p className="text-gray-600 text-xs font-semibold uppercase">Weekly Rate</p>
									<p className="text-2xl font-bold text-purple-600">{currentGoal.weeklyTarget.toFixed(2)} lbs/wk</p>
								</div>
							</div>
						</div>

						{/* Next Milestone */}
						{getNextMilestone(currentGoal) && (
							<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
								<p className="text-gray-600 text-sm font-semibold mb-2">🎯 NEXT MILESTONE</p>
								<p className="text-2xl font-bold text-purple-600">{getNextMilestone(currentGoal)!.weight} lbs</p>
								<p className="text-purple-700 mt-2">{getNextMilestone(currentGoal)!.celebration}</p>
								<p className="text-sm text-gray-600 mt-3">
									{(currentUser.weight! - getNextMilestone(currentGoal)!.weight).toFixed(1)} lbs to go
								</p>
							</div>
						)}

						{/* Milestones */}
						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">Milestones</h3>
							<div className="space-y-2">
								{currentGoal.milestones.map((milestone, idx) => (
									<div
										key={milestone.id}
										className={`flex items-center p-4 rounded-lg transition ${
											milestone.reachedDate
												? "bg-emerald-50 border border-emerald-300"
												: "bg-gray-50 border border-gray-200"
										}`}>
										<div className="flex-1">
											<p className={`font-semibold ${milestone.reachedDate ? "text-emerald-700" : "text-gray-700"}`}>
												{milestone.weight} lbs
											</p>
											<p className="text-sm text-gray-600">{milestone.celebration}</p>
										</div>
										{milestone.reachedDate && <span className="text-emerald-600 font-bold text-lg">✓</span>}
									</div>
								))}
							</div>
						</div>

						<button
							onClick={() => setShowGoalForm(true)}
							className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition">
							Create New Goal
						</button>
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-gray-600 text-lg mb-6">No active goal yet. Create one to get started!</p>
						<button
							onClick={() => setShowGoalForm(true)}
							className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition">
							Create Goal
						</button>
					</div>
				)}

				{/* Goal Form Modal */}
				{showGoalForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
							<h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Goal</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Target Weight (lbs)</label>
									<input
										type="number"
										value={targetWeight}
										onChange={(e) => setTargetWeight(e.target.value)}
										placeholder="170"
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
									<input
										type="date"
										value={targetDate}
										onChange={(e) => setTargetDate(e.target.value)}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div className="flex gap-2">
									<button
										onClick={handleCreateGoal}
										className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition">
										Create
									</button>
									<button
										onClick={() => setShowGoalForm(false)}
										className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition">
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
