import React, { useState } from "react";
import type { WeightLog, MeasurementLog } from "../types";
import { useUsers } from "../hooks/useUsers";

export const ProgressTracking: React.FC = () => {
	const { currentUser, updateUser } = useUsers();
	const [activeTab, setActiveTab] = useState<"weight" | "measurements" | "photos">("weight");
	const [newWeight, setNewWeight] = useState("");
	const [newChest, setNewChest] = useState("");
	const [newWaist, setNewWaist] = useState("");
	const [newArms, setNewArms] = useState("");
	const [notes, setNotes] = useState("");

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const weightLogs = currentUser.weightLogs || [];
	const measurementLogs = currentUser.measurementLogs || [];

	const handleAddWeight = () => {
		if (!newWeight) return;
		const log: WeightLog = {
			id: Date.now().toString(),
			userId: currentUser.id,
			weight: parseFloat(newWeight),
			date: new Date(),
			notes: notes || undefined,
		};
		const updated = { ...currentUser, weightLogs: [...weightLogs, log] };

		// Update quest progress for weight logging
		if (Array.isArray(updated.quests)) {
			updated.quests = updated.quests.map((q: any) => {
				if (q.linkedActivity === "weight") {
					const isCompleted = true; // Just logging weight once completes it
					return {
						...q,
						currentProgress: 1,
						completed: isCompleted,
						completedDate: isCompleted && !q.completed ? new Date() : q.completedDate,
					};
				}
				return q;
			});
		}

		updateUser(updated);
		setNewWeight("");
		setNotes("");
	};

	const handleAddMeasurement = () => {
		if (!newChest && !newWaist && !newArms) return;
		const log: MeasurementLog = {
			id: Date.now().toString(),
			userId: currentUser.id,
			date: new Date(),
			chest: newChest ? parseFloat(newChest) : undefined,
			waist: newWaist ? parseFloat(newWaist) : undefined,
			arms: newArms ? parseFloat(newArms) : undefined,
			notes: notes || undefined,
		};
		const updated = { ...currentUser, measurementLogs: [...measurementLogs, log] };
		updateUser(updated);
		setNewChest("");
		setNewWaist("");
		setNewArms("");
		setNotes("");
	};

	const getWeightTrend = () => {
		if (weightLogs.length < 2) return null;
		const latest = weightLogs[weightLogs.length - 1].weight;
		const previous = weightLogs[weightLogs.length - 2].weight;
		const change = latest - previous;
		return { change, trend: change < 0 ? "down" : "up" };
	};

	const trend = getWeightTrend();
	const avgWeeklyLoss =
		weightLogs.length > 7
			? (weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight) / (weightLogs.length / 7)
			: null;

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					Progress Tracking
				</h2>

				{/* Tabs */}
				<div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-200">
					<button
						onClick={() => setActiveTab("weight")}
						className={`px-4 py-2 font-semibold transition ${
							activeTab === "weight" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
						}`}>
						Weight Log
					</button>
					<button
						onClick={() => setActiveTab("measurements")}
						className={`px-4 py-2 font-semibold transition ${
							activeTab === "measurements"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-600 hover:text-gray-800"
						}`}>
						Measurements
					</button>
					<button
						onClick={() => setActiveTab("photos")}
						className={`px-4 py-2 font-semibold transition ${
							activeTab === "photos" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
						}`}>
						Progress Photos
					</button>
				</div>

				{/* Weight Log */}
				{activeTab === "weight" && (
					<div className="space-y-6">
						{/* Stats */}
						{weightLogs.length > 0 && (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
									<p className="text-gray-600 text-sm font-semibold">Latest Weight</p>
									<p className="text-2xl font-bold text-blue-600">{weightLogs[weightLogs.length - 1].weight} lbs</p>
								</div>
								{trend && (
									<div
										className={`bg-gradient-to-br ${trend.change < 0 ? "from-emerald-50 to-emerald-100" : "from-red-50 to-red-100"} p-4 rounded-lg`}>
										<p className="text-gray-600 text-sm font-semibold">Change</p>
										<p className={`text-2xl font-bold ${trend.change < 0 ? "text-emerald-600" : "text-red-600"}`}>
											{trend.change > 0 ? "+" : ""}
											{trend.change.toFixed(1)} lbs
										</p>
									</div>
								)}
								{avgWeeklyLoss && (
									<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
										<p className="text-gray-600 text-sm font-semibold">Avg/Week</p>
										<p className="text-2xl font-bold text-purple-600">{avgWeeklyLoss.toFixed(2)} lbs</p>
									</div>
								)}
							</div>
						)}

						{/* Add Weight */}
						<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">Log Weight</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
									<input
										type="number"
										value={newWeight}
										onChange={(e) => setNewWeight(e.target.value)}
										placeholder={currentUser.weight?.toString()}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
										step="0.1"
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
									<input
										type="text"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="How do you feel? Any observations?"
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<button
									onClick={handleAddWeight}
									className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition">
									Log Weight
								</button>
							</div>
						</div>

						{/* Weight History */}
						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">History</h3>
							<div className="space-y-2 max-h-96 overflow-y-auto">
								{[...weightLogs].reverse().map((log) => (
									<div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
										<div>
											<p className="font-semibold text-gray-800">{log.weight} lbs</p>
											<p className="text-sm text-gray-600">{new Date(log.date).toLocaleDateString()}</p>
											{log.notes && <p className="text-xs text-gray-500 italic">{log.notes}</p>}
										</div>
									</div>
								))}
								{weightLogs.length === 0 && <p className="text-center text-gray-500 py-8">No weight logs yet</p>}
							</div>
						</div>
					</div>
				)}

				{/* Measurements */}
				{activeTab === "measurements" && (
					<div className="space-y-6">
						{/* Add Measurements */}
						<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">Log Measurements</h3>
							<div className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">Chest (inches)</label>
										<input
											type="number"
											value={newChest}
											onChange={(e) => setNewChest(e.target.value)}
											placeholder="Optional"
											className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
											step="0.1"
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">Waist (inches)</label>
										<input
											type="number"
											value={newWaist}
											onChange={(e) => setNewWaist(e.target.value)}
											placeholder="Optional"
											className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
											step="0.1"
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">Arms (inches)</label>
										<input
											type="number"
											value={newArms}
											onChange={(e) => setNewArms(e.target.value)}
											placeholder="Optional"
											className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
											step="0.1"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
									<input
										type="text"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="Any observations?"
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<button
									onClick={handleAddMeasurement}
									className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition">
									Log Measurements
								</button>
							</div>
						</div>

						{/* Measurement History */}
						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-4">History</h3>
							<div className="space-y-2 max-h-96 overflow-y-auto">
								{[...measurementLogs].reverse().map((log) => (
									<div key={log.id} className="p-3 bg-gray-50 rounded-lg">
										<p className="text-sm text-gray-600 font-semibold">{new Date(log.date).toLocaleDateString()}</p>
										<div className="text-sm text-gray-700 mt-2 space-y-1">
											{log.chest && <p>Chest: {log.chest}"</p>}
											{log.waist && <p>Waist: {log.waist}"</p>}
											{log.arms && <p>Arms: {log.arms}"</p>}
										</div>
										{log.notes && <p className="text-xs text-gray-500 italic mt-2">{log.notes}</p>}
									</div>
								))}
								{measurementLogs.length === 0 && (
									<p className="text-center text-gray-500 py-8">No measurements logged yet</p>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Photos */}
				{activeTab === "photos" && (
					<div className="text-center py-12 text-gray-500">
						<p className="mb-4">📸 Progress photo tracking coming soon!</p>
						<p className="text-sm">Upload before/after photos to track visual progress</p>
					</div>
				)}
			</div>
		</div>
	);
};
