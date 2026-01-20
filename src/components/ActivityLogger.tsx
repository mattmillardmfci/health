import React, { useState } from "react";
import type { ActivityLog } from "../types";
import { useUsers } from "../hooks/useUsers";

export const ActivityLogger: React.FC = () => {
	const { currentUser, updateUser } = useUsers();
	const [activityType, setActivityType] = useState<"strength" | "cardio" | "walk" | "sports" | "other">("cardio");
	const [duration, setDuration] = useState("");
	const [intensity, setIntensity] = useState<"low" | "moderate" | "high">("moderate");
	const [notes, setNotes] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const activityLogs = currentUser.activityLogs || [];
	const todayActivities = activityLogs.filter(
		(a) => new Date(a.date).toDateString() === new Date(selectedDate).toDateString(),
	);

	const getCaloriesBurned = (type: string, duration: number, intensity: string): number => {
		const baseCalories: Record<string, number> = {
			strength: 6,
			cardio: 8,
			walk: 4,
			sports: 7,
			other: 5,
		};
		const intensityMultiplier: Record<string, number> = {
			low: 0.8,
			moderate: 1,
			high: 1.4,
		};
		return Math.round(baseCalories[type] * duration * intensityMultiplier[intensity]);
	};

	const handleAddActivity = () => {
		if (!duration) return;

		const durationNum = parseFloat(duration);
		const calories = getCaloriesBurned(activityType, durationNum, intensity);

		const activity: ActivityLog = {
			id: Date.now().toString(),
			userId: currentUser.id,
			date: new Date(selectedDate),
			type: activityType,
			duration: durationNum,
			intensity,
			caloriesBurned: calories,
			notes: notes || undefined,
		};

		const updated = { ...currentUser, activityLogs: [...activityLogs, activity] };

		// Update quest progress for activity logging
		if (Array.isArray(updated.quests)) {
			const todayDate = new Date(selectedDate);
			todayDate.setHours(0, 0, 0, 0);

			updated.quests = updated.quests.map((q: any) => {
				if (q.linkedActivity === "activity") {
					// Count activities logged today
					const todayActivityCount = [...activityLogs, activity].filter((a) => {
						const actDate = new Date(a.date);
						actDate.setHours(0, 0, 0, 0);
						return actDate.getTime() === todayDate.getTime();
					}).length;

					const newProgress = todayActivityCount;
					const isCompleted = newProgress >= q.targetCount;

					return {
						...q,
						currentProgress: newProgress,
						completed: isCompleted,
						completedDate: isCompleted && !q.completed ? new Date() : q.completedDate,
					};
				}
				return q;
			});
		}

		updateUser(updated);
		setDuration("");
		setNotes("");
	};

	const handleDeleteActivity = (id: string) => {
		const updated = { ...currentUser, activityLogs: activityLogs.filter((a) => a.id !== id) };
		updateUser(updated);
	};

	const totalCaloresToday = todayActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
	const avgIntensityToday =
		todayActivities.length > 0
			? todayActivities.filter((a) => a.intensity === "high").length / todayActivities.length > 0.5
				? "High"
				: "Moderate"
			: "N/A";

	const weekActivities = activityLogs.filter((a) => {
		const date = new Date(a.date);
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		return date >= weekAgo;
	});

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					Activity Tracker
				</h2>

				{/* Weekly Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
						<p className="text-gray-600 text-sm font-semibold">This Week</p>
						<p className="text-2xl font-bold text-blue-600">{weekActivities.length}</p>
						<p className="text-xs text-gray-600">activities</p>
					</div>
					<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
						<p className="text-gray-600 text-sm font-semibold">Weekly Calories</p>
						<p className="text-2xl font-bold text-emerald-600">
							{weekActivities.reduce((sum, a) => sum + a.caloriesBurned, 0)}
						</p>
						<p className="text-xs text-gray-600">burned</p>
					</div>
					<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
						<p className="text-gray-600 text-sm font-semibold">Avg Intensity</p>
						<p className="text-2xl font-bold text-purple-600">{avgIntensityToday}</p>
						<p className="text-xs text-gray-600">last 7 days</p>
					</div>
				</div>

				{/* Date Selector */}
				<div className="mb-6">
					<label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
					<input
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* Today's Summary */}
				<div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mb-6">
					<p className="text-sm font-semibold text-gray-700">
						{new Date(selectedDate).toLocaleDateString()} • {todayActivities.length} activities •{" "}
						<span className="text-emerald-600 font-bold">{totalCaloresToday} calories burned</span>
					</p>
				</div>

				{/* Add Activity Form */}
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200 mb-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Log Activity</h3>
					<div className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Activity Type</label>
								<select
									value={activityType}
									onChange={(e) => setActivityType(e.target.value as any)}
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
									<option value="strength">Strength Training</option>
									<option value="cardio">Cardio</option>
									<option value="walk">Walking</option>
									<option value="sports">Sports</option>
									<option value="other">Other</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
								<input
									type="number"
									value={duration}
									onChange={(e) => setDuration(e.target.value)}
									placeholder="30"
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									min="1"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Intensity</label>
								<select
									value={intensity}
									onChange={(e) => setIntensity(e.target.value as any)}
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
									<option value="low">Low</option>
									<option value="moderate">Moderate</option>
									<option value="high">High</option>
								</select>
							</div>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
							<input
								type="text"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="How did you feel? Any PRs?"
								className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						{duration && (
							<div className="bg-blue-100 border border-blue-300 p-3 rounded text-sm text-blue-900">
								Estimated burn: ~{getCaloriesBurned(activityType, parseFloat(duration), intensity)} calories
							</div>
						)}
						<button
							onClick={handleAddActivity}
							className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition">
							Log Activity
						</button>
					</div>
				</div>

				{/* Activities for Date */}
				<div>
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Activities for {new Date(selectedDate).toLocaleDateString()}
					</h3>
					<div className="space-y-3">
						{todayActivities.length > 0 ? (
							todayActivities.map((activity) => (
								<div key={activity.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<p className="font-semibold text-gray-800">
												{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
											</p>
											<p className="text-sm text-gray-600">
												{activity.duration} min •{" "}
												{activity.intensity.charAt(0).toUpperCase() + activity.intensity.slice(1)} intensity
											</p>
											<p className="text-xs text-emerald-600 font-semibold mt-1">
												🔥 {activity.caloriesBurned} calories
											</p>
											{activity.notes && <p className="text-xs text-gray-500 italic mt-2">{activity.notes}</p>}
										</div>
										<button
											onClick={() => handleDeleteActivity(activity.id)}
											className="text-red-500 hover:text-red-700 font-semibold ml-4">
											✕
										</button>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-gray-500 py-8">No activities logged for this date</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
