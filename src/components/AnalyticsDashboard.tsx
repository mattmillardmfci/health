import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";

export const AnalyticsDashboard: React.FC = () => {
	const { currentUser } = useUsers();
	const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const weightLogs = currentUser.weightLogs || [];
	const mealLogs = currentUser.mealLogs || [];
	const activityLogs = currentUser.activityLogs || [];
	const journalEntries = currentUser.journalEntries || [];

	// Get data for selected time range
	const getDateRange = () => {
		const now = new Date();
		const startDate = new Date();
		if (timeRange === "week") startDate.setDate(now.getDate() - 7);
		else if (timeRange === "month") startDate.setDate(now.getDate() - 30);
		else startDate.setFullYear(1900); // all time
		return startDate;
	};

	const startDate = getDateRange();
	const filteredWeights = weightLogs.filter((w) => new Date(w.date) >= startDate);
	const filteredMeals = mealLogs.filter((m) => new Date(m.date) >= startDate);
	const filteredActivities = activityLogs.filter((a) => new Date(a.date) >= startDate);
	const filteredJournal = journalEntries.filter((j) => new Date(j.date) >= startDate);

	// Calculate metrics
	const avgWeight =
		filteredWeights.length > 0
			? (filteredWeights.reduce((sum, w) => sum + w.weight, 0) / filteredWeights.length).toFixed(1)
			: "N/A";

	const weightChange =
		filteredWeights.length >= 2
			? (filteredWeights[filteredWeights.length - 1].weight - filteredWeights[0].weight).toFixed(1)
			: "N/A";

	const avgDailyCalories =
		filteredMeals.length > 0
			? Math.round(
					filteredMeals.reduce((sum, m) => sum + (m.macros?.calories || 0), 0) /
						new Set(filteredMeals.map((m) => new Date(m.date).toDateString())).size,
				)
			: 0;

	const avgDailyProtein =
		filteredMeals.length > 0
			? Math.round(
					filteredMeals.reduce((sum, m) => sum + (m.macros?.protein || 0), 0) /
						new Set(filteredMeals.map((m) => new Date(m.date).toDateString())).size,
				)
			: 0;

	const totalActivityCalories = filteredActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
	const avgActivityPerDay =
		filteredActivities.length > 0
			? (totalActivityCalories / new Set(filteredActivities.map((a) => new Date(a.date).toDateString())).size).toFixed(
					0,
				)
			: 0;

	const avgEnergy =
		filteredJournal.length > 0
			? Math.round(filteredJournal.reduce((sum, e) => sum + e.energyLevel, 0) / filteredJournal.length)
			: "N/A";

	const avgMood =
		filteredJournal.length > 0
			? Math.round(filteredJournal.reduce((sum, e) => sum + e.moodScore, 0) / filteredJournal.length)
			: "N/A";

	const avgSleep =
		filteredJournal.length > 0
			? Math.round(filteredJournal.reduce((sum, e) => sum + e.sleepQuality, 0) / filteredJournal.length)
			: "N/A";

	// Calculate consistency
	const uniqueDaysWithData = new Set([
		...filteredWeights.map((w) => new Date(w.date).toDateString()),
		...filteredMeals.map((m) => new Date(m.date).toDateString()),
		...filteredActivities.map((a) => new Date(a.date).toDateString()),
		...filteredJournal.map((j) => new Date(j.date).toDateString()),
	]).size;

	const dayRange = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
	const consistency = dayRange > 0 ? Math.round((uniqueDaysWithData / dayRange) * 100) : 0;

	// Weekly breakdown
	const getWeeklyData = () => {
		const weeks: Record<string, { weights: number[]; calories: number; activity: number; entries: number }> = {};
		const now = new Date();

		// Create 4 weeks of data
		for (let i = 3; i >= 0; i--) {
			const weekStart = new Date(now);
			weekStart.setDate(weekStart.getDate() - 7 * i);
			const weekEnd = new Date(weekStart);
			weekEnd.setDate(weekEnd.getDate() + 6);
			const weekKey = `W${4 - i}`;

			weeks[weekKey] = { weights: [], calories: 0, activity: 0, entries: 0 };

			filteredWeights.forEach((w) => {
				const wDate = new Date(w.date);
				if (wDate >= weekStart && wDate <= weekEnd) weeks[weekKey].weights.push(w.weight);
			});

			filteredMeals.forEach((m) => {
				const mDate = new Date(m.date);
				if (mDate >= weekStart && mDate <= weekEnd) weeks[weekKey].calories += m.macros?.calories || 0;
			});

			filteredActivities.forEach((a) => {
				const aDate = new Date(a.date);
				if (aDate >= weekStart && aDate <= weekEnd) weeks[weekKey].activity += a.caloriesBurned;
			});

			filteredJournal.forEach((j) => {
				const jDate = new Date(j.date);
				if (jDate >= weekStart && jDate <= weekEnd) weeks[weekKey].entries++;
			});
		}

		return weeks;
	};

	const weeklyData = getWeeklyData();

	return (
		<div className="w-full max-w-6xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<div className="flex justify-between items-start mb-6">
					<h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
						Analytics Dashboard
					</h2>
					<div className="flex gap-2">
						<button
							onClick={() => setTimeRange("week")}
							className={`px-3 py-1 rounded text-sm font-semibold transition ${
								timeRange === "week" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}>
							7 days
						</button>
						<button
							onClick={() => setTimeRange("month")}
							className={`px-3 py-1 rounded text-sm font-semibold transition ${
								timeRange === "month" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}>
							30 days
						</button>
						<button
							onClick={() => setTimeRange("all")}
							className={`px-3 py-1 rounded text-sm font-semibold transition ${
								timeRange === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}>
							All Time
						</button>
					</div>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					{/* Weight */}
					<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border-2 border-emerald-200">
						<p className="text-xs text-gray-600 font-semibold">Avg Weight</p>
						<p className="text-2xl font-bold text-emerald-600 mt-1">{avgWeight} lbs</p>
						<p className="text-xs text-gray-600 mt-2">
							{weightChange !== "N/A" && (
								<>
									{weightChange > 0 ? "+" : ""}
									{weightChange} lbs
									{weightChange < 0 && " ✓"}
								</>
							)}
						</p>
					</div>

					{/* Calories */}
					<div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-200">
						<p className="text-xs text-gray-600 font-semibold">Daily Avg Calories</p>
						<p className="text-2xl font-bold text-orange-600 mt-1">{avgDailyCalories}</p>
						<p className="text-xs text-gray-600 mt-2">{filteredMeals.length} meals logged</p>
					</div>

					{/* Activity */}
					<div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border-2 border-red-200">
						<p className="text-xs text-gray-600 font-semibold">Avg Activity Cal/Day</p>
						<p className="text-2xl font-bold text-red-600 mt-1">{avgActivityPerDay}</p>
						<p className="text-xs text-gray-600 mt-2">🔥 {totalActivityCalories} total</p>
					</div>

					{/* Consistency */}
					<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-200">
						<p className="text-xs text-gray-600 font-semibold">Consistency</p>
						<p className="text-2xl font-bold text-purple-600 mt-1">{consistency}%</p>
						<p className="text-xs text-gray-600 mt-2">{uniqueDaysWithData} active days</p>
					</div>
				</div>

				{/* Wellbeing Metrics */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
						<p className="text-xs text-gray-600 font-semibold">Energy</p>
						<p className="text-3xl font-bold text-blue-600 mt-1">{avgEnergy}</p>
						<p className="text-xs text-gray-600 mt-2">/ 10</p>
					</div>
					<div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
						<p className="text-xs text-gray-600 font-semibold">Mood</p>
						<p className="text-3xl font-bold text-pink-600 mt-1">{avgMood}</p>
						<p className="text-xs text-gray-600 mt-2">/ 10</p>
					</div>
					<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
						<p className="text-xs text-gray-600 font-semibold">Sleep</p>
						<p className="text-3xl font-bold text-purple-600 mt-1">{avgSleep}</p>
						<p className="text-xs text-gray-600 mt-2">/ 10</p>
					</div>
				</div>

				{/* Weekly Breakdown */}
				<div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Breakdown</h3>
					<div className="space-y-3">
						{Object.entries(weeklyData).map(([week, data]) => {
							const avgWeekWeight =
								data.weights.length > 0
									? (data.weights.reduce((a, b) => a + b, 0) / data.weights.length).toFixed(1)
									: "—";
							const avgDayCalories = data.calories > 0 ? Math.round(data.calories / 7) : 0;
							return (
								<div key={week} className="flex items-center gap-4 p-3 bg-white rounded border border-gray-200">
									<div className="w-12 font-semibold text-gray-700">{week}</div>
									<div className="flex-1">
										<div className="flex justify-between items-center text-sm">
											<span className="text-gray-600">Weight: {avgWeekWeight} lbs</span>
											<span className="text-gray-600">Calories: {avgDayCalories}/day</span>
											<span className="text-gray-600">Activity: {data.activity} cal</span>
											<span className="text-gray-600">Entries: {data.entries}</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Insights */}
				<div className="mt-6 bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
					<h3 className="font-semibold text-blue-900 mb-2">💡 Insights</h3>
					<ul className="text-sm text-blue-800 space-y-1">
						{consistency < 50 && <li>• Increase tracking consistency for better insights</li>}
						{consistency >= 80 && <li>• Great consistency! You're tracking regularly ✓</li>}
						{avgDailyCalories > 0 && currentUser.tdee && avgDailyCalories > currentUser.tdee && (
							<li>• Calories are above TDEE ({currentUser.tdee}) - adjust if cutting</li>
						)}
						{avgEnergy < 5 && <li>• Low energy levels detected - check sleep and nutrition</li>}
						{avgSleep < 6 && <li>• Sleep quality is low - prioritize 7-9 hours</li>}
						{avgMood < 5 && <li>• Mood trending low - ensure adequate nutrients and rest</li>}
						{totalActivityCalories > 500 && <li>• Great activity levels! Keep it up 💪</li>}
					</ul>
				</div>
			</div>
		</div>
	);
};
