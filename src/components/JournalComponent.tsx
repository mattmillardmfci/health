import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { JournalEntry } from "../types";

export const JournalComponent: React.FC = () => {
	const { currentUser, updateUser } = useUsers();
	const [entryText, setEntryText] = useState("");
	const [energyLevel, setEnergyLevel] = useState(5);
	const [hungerLevel, setHungerLevel] = useState(5);
	const [moodScore, setMoodScore] = useState(5);
	const [sleepQuality, setSleepQuality] = useState(5);
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const journalEntries = currentUser.journalEntries || [];
	const todayEntries = journalEntries.filter(
		(e) => new Date(e.date).toDateString() === new Date(selectedDate).toDateString(),
	);

	const handleAddEntry = () => {
		if (!entryText.trim()) return;

		const entry: JournalEntry = {
			id: Date.now().toString(),
			userId: currentUser.id,
			date: new Date(selectedDate),
			entry: entryText,
			energy: parseInt(energyLevel.toString()),
			hunger: parseInt(hungerLevel.toString()),
			mood: parseInt(moodScore.toString()),
			sleep: parseInt(sleepQuality.toString()),
		};

		const updated = { ...currentUser, journalEntries: [...journalEntries, entry] };

		// Update quest progress for journal entries
		if (Array.isArray(updated.quests)) {
			const todayDate = new Date(selectedDate);
			todayDate.setHours(0, 0, 0, 0);

			updated.quests = updated.quests.map((q: any) => {
				if (q.linkedActivity === "journal") {
					// Count journal entries today
					const todayEntriesCount = [...journalEntries, entry].filter((je) => {
						const entryDate = new Date(je.date);
						entryDate.setHours(0, 0, 0, 0);
						return entryDate.getTime() === todayDate.getTime();
					}).length;

					const newProgress = todayEntriesCount;
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
		setEntryText("");
		setEnergyLevel(5);
		setHungerLevel(5);
		setMoodScore(5);
		setSleepQuality(5);
	};

	const handleDeleteEntry = (id: string) => {
		const updated = { ...currentUser, journalEntries: journalEntries.filter((e) => e.id !== id) };
		updateUser(updated);
	};

	const getLevelColor = (level: number, type: string): string => {
		if (type === "energy" || type === "mood") {
			if (level >= 8) return "text-emerald-600";
			if (level >= 5) return "text-blue-600";
			return "text-orange-600";
		}
		if (type === "hunger") {
			if (level >= 8) return "text-red-600";
			if (level >= 5) return "text-orange-600";
			return "text-emerald-600";
		}
		return "text-blue-600";
	};

	const getLevelEmoji = (level: number, type: string): string => {
		if (type === "energy") return level >= 8 ? "⚡" : level >= 5 ? "🔋" : "😴";
		if (type === "mood") return level >= 8 ? "😄" : level >= 5 ? "😊" : "😔";
		if (type === "hunger") return level >= 8 ? "🔥" : level >= 5 ? "😋" : "😌";
		return "😴";
	};

	const avg = (arr: number[]) => (arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
	const weekEntries = journalEntries.filter((e) => {
		const date = new Date(e.date);
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		return date >= weekAgo;
	});

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-pink-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
					Daily Journal
				</h2>

				{/* Weekly Averages */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
						<p className="text-xs text-gray-600 font-semibold">Avg Energy</p>
						<p className={`text-2xl font-bold mt-1 ${getLevelColor(avg(weekEntries.map((e) => e.energy)), "energy")}`}>
							{avg(weekEntries.map((e) => e.energy))}/10
						</p>
						<p className="text-lg mt-1">{getLevelEmoji(avg(weekEntries.map((e) => e.energy)), "energy")}</p>
					</div>
					<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
						<p className="text-xs text-gray-600 font-semibold">Avg Hunger</p>
						<p className={`text-2xl font-bold mt-1 ${getLevelColor(avg(weekEntries.map((e) => e.hunger)), "hunger")}`}>
							{avg(weekEntries.map((e) => e.hunger))}/10
						</p>
						<p className="text-lg mt-1">{getLevelEmoji(avg(weekEntries.map((e) => e.hunger)), "hunger")}</p>
					</div>
					<div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
						<p className="text-xs text-gray-600 font-semibold">Avg Mood</p>
						<p className={`text-2xl font-bold mt-1 ${getLevelColor(avg(weekEntries.map((e) => e.mood)), "mood")}`}>
							{avg(weekEntries.map((e) => e.mood))}/10
						</p>
						<p className="text-lg mt-1">{getLevelEmoji(avg(weekEntries.map((e) => e.mood)), "mood")}</p>
					</div>
					<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
						<p className="text-xs text-gray-600 font-semibold">Avg Sleep</p>
						<p className="text-2xl font-bold text-purple-600 mt-1">{avg(weekEntries.map((e) => e.sleep))}/10</p>
						<p className="text-lg mt-1">😴</p>
					</div>
				</div>

				{/* Date Selector */}
				<div className="mb-6">
					<label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
					<input
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
					/>
				</div>

				{/* Add Entry Form */}
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200 mb-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						New Entry for {new Date(selectedDate).toLocaleDateString()}
					</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Journal Entry</label>
							<textarea
								value={entryText}
								onChange={(e) => setEntryText(e.target.value)}
								placeholder="How are you feeling? What's on your mind? How's your diet going? Any wins today?"
								className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 h-24 resize-none"
							/>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div>
								<label className="text-sm font-semibold text-gray-700">
									Energy {getLevelEmoji(energyLevel, "energy")}
								</label>
								<input
									type="range"
									min="1"
									max="10"
									value={energyLevel}
									onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
									className="w-full"
								/>
								<p className="text-xs text-center text-gray-600 mt-1">{energyLevel}/10</p>
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700">
									Hunger {getLevelEmoji(hungerLevel, "hunger")}
								</label>
								<input
									type="range"
									min="1"
									max="10"
									value={hungerLevel}
									onChange={(e) => setHungerLevel(parseInt(e.target.value))}
									className="w-full"
								/>
								<p className="text-xs text-center text-gray-600 mt-1">{hungerLevel}/10</p>
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700">Mood {getLevelEmoji(moodScore, "mood")}</label>
								<input
									type="range"
									min="1"
									max="10"
									value={moodScore}
									onChange={(e) => setMoodScore(parseInt(e.target.value))}
									className="w-full"
								/>
								<p className="text-xs text-center text-gray-600 mt-1">{moodScore}/10</p>
							</div>
							<div>
								<label className="text-sm font-semibold text-gray-700">
									Sleep {getLevelEmoji(sleepQuality, "sleep")}
								</label>
								<input
									type="range"
									min="1"
									max="10"
									value={sleepQuality}
									onChange={(e) => setSleepQuality(parseInt(e.target.value))}
									className="w-full"
								/>
								<p className="text-xs text-center text-gray-600 mt-1">{sleepQuality}/10</p>
							</div>
						</div>

						<button
							onClick={handleAddEntry}
							className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-2 rounded-lg transition">
							Save Entry
						</button>
					</div>
				</div>

				{/* Entries for Date */}
				<div>
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Entries for {new Date(selectedDate).toLocaleDateString()}
					</h3>
					<div className="space-y-4">
						{todayEntries.length > 0 ? (
							todayEntries.map((entry) => (
								<div
									key={entry.id}
									className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg border-2 border-pink-200">
									<div className="flex justify-between items-start mb-3">
										<p className="text-xs text-gray-600">
											{new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
										</p>
										<button
											onClick={() => handleDeleteEntry(entry.id)}
											className="text-red-500 hover:text-red-700 font-semibold">
											✕
										</button>
									</div>
									<p className="text-gray-800 leading-relaxed mb-4">{entry.entry}</p>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
										<div className={getLevelColor(entry.energyLevel, "energy")}>
											<p className="text-xs font-semibold">Energy: {entry.energyLevel}/10</p>
										</div>
										<div className={getLevelColor(entry.hungerLevel, "hunger")}>
											<p className="text-xs font-semibold">Hunger: {entry.hungerLevel}/10</p>
										</div>
										<div className={getLevelColor(entry.moodScore, "mood")}>
											<p className="text-xs font-semibold">Mood: {entry.moodScore}/10</p>
										</div>
										<div className="text-purple-600">
											<p className="text-xs font-semibold">Sleep: {entry.sleepQuality}/10</p>
										</div>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-gray-500 py-8">No journal entries for this date</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
