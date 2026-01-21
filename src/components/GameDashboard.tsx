import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { SnowballCub } from "./SnowballCub";
import type { Task } from "../types";

interface GameDashboardProps {
	onNavigate?: (section: string) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ onNavigate }) => {
	const { currentUser, updateUser } = useUsers();
	const [expandedSection, setExpandedSection] = useState<"morning" | "anytime" | null>("morning");

	if (!currentUser) return <div className="text-center py-12">Loading...</div>;

	const tasks = currentUser.tasks || [];
	const morningTasks = tasks.filter((t) => t.category === "morning");
	const anytimeTasks = tasks.filter((t) => t.category !== "morning");

	const isTaskCompletedToday = (t: Task) => {
		if (!t.completedDate) return false;
		return new Date(t.completedDate).toDateString() === new Date().toDateString();
	};

	// Calculate completed today
	const completedToday = tasks.filter(isTaskCompletedToday);

	// Separate tasks into pending and completed
	const pendingMorningTasks = morningTasks.filter((t) => !isTaskCompletedToday(t));
	const completedMorningTasks = morningTasks.filter((t) => isTaskCompletedToday(t));
	const pendingAnytimeTasks = anytimeTasks.filter((t) => !isTaskCompletedToday(t));
	const completedAnytimeTasks = anytimeTasks.filter((t) => isTaskCompletedToday(t));

	const handleTaskComplete = (taskId: string) => {
		const updatedTasks = currentUser.tasks.map((t) => {
			if (t.id !== taskId) return t;
			if (isTaskCompletedToday(t)) return t;

			const completedDate = new Date();
			return {
				...t,
				completedDate,
				completed: t.isRecurring ? t.completed : true,
			};
		});

		const updatedCompanion = {
			...currentUser.companion,
			experience: (currentUser.companion.experience || 0) + 15,
			happiness: Math.min(100, (currentUser.companion.happiness || 80) + 5),
		};

		updateUser({
			...currentUser,
			tasks: updatedTasks,
			companion: updatedCompanion,
		});
	};

	const adventureProgress = Math.min(
		15,
		completedToday.filter((t) => t.category === "morning").length +
			completedToday.filter((t) => t.category !== "morning").length,
	);

	const goalsForToday = tasks.filter((t) => !isTaskCompletedToday(t)).length;

	return (
		<div className="min-h-screen bg-gradient-to-b from-cyan-200 via-cyan-100 to-blue-100 pb-32">
			{/* Polar Scene Header */}
			<div className="relative h-64 bg-gradient-to-b from-cyan-300 via-cyan-200 to-cyan-100 overflow-hidden">
				{/* Sky/Snow particles effect */}
				<div className="absolute inset-0 opacity-30">
					<div className="absolute w-20 h-20 bg-white rounded-full blur-xl" style={{ top: "20%", left: "10%" }} />
					<div className="absolute w-32 h-32 bg-white rounded-full blur-2xl" style={{ top: "10%", right: "15%" }} />
					<div className="absolute w-16 h-16 bg-white rounded-full blur-lg" style={{ bottom: "30%", left: "20%" }} />
				</div>

				{/* Ice blocks/snowdrifts */}
				<div className="absolute bottom-0 left-0 w-32 h-24 bg-cyan-300 rounded-lg opacity-40 transform -skew-x-12" />
				<div className="absolute bottom-0 right-0 w-40 h-20 bg-blue-200 rounded-lg opacity-50 transform skew-x-12" />

				{/* Igloo/Ice structure */}
				<div className="absolute bottom-0 left-1/4 w-20 h-20 bg-gradient-to-b from-blue-100 to-blue-300 rounded-full opacity-50" />
				<div className="absolute bottom-0 left-1/4 transform translate-x-2 w-6 h-10 bg-blue-400 rounded opacity-60" />

				{/* Companion */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 drop-shadow-lg">
					<SnowballCub stage={currentUser.companion?.stage ?? "cub"} />
				</div>

				{/* Menu button */}
				<button className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md hover:bg-white transition">
					<span className="text-2xl">☰</span>
				</button>

				{/* Settings button */}
				<button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md hover:bg-white transition">
					<span className="text-2xl">⚙️</span>
				</button>
			</div>

			{/* Content Area */}
			<div className="relative px-4 py-6 max-w-2xl mx-auto">
				{/* Adventure Progress */}
				<div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-6 shadow-lg border border-white/40">
					<div className="flex items-center gap-3 mb-3">
						<span className="text-2xl">⚡</span>
						<h3 className="font-bold text-slate-800">1st Adventure</h3>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex-1 bg-orange-200 rounded-full h-3 overflow-hidden">
							<div
								className="bg-gradient-to-r from-orange-400 to-orange-500 h-full transition-all"
								style={{ width: `${(adventureProgress / 15) * 100}%` }}
							/>
						</div>
						<span className="font-bold text-slate-700 text-sm">{adventureProgress} / 15</span>
					</div>
				</div>

				{/* Goals Counter */}
				<div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-6 shadow-lg border border-white/40">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="text-2xl">📋</span>
							<h3 className="font-bold text-slate-800">{goalsForToday} goals left for today!</h3>
						</div>
						<div className="flex gap-2">
							<button className="p-2 hover:bg-white/40 rounded-lg transition">
								<span className="text-xl">🎚️</span>
							</button>
							<button className="p-2 hover:bg-white/40 rounded-lg transition">
								<span className="text-xl">👥</span>
							</button>
						</div>
					</div>
				</div>

				{/* Morning Routines Section */}
				<div className="mb-6">
					<button
						onClick={() => setExpandedSection(expandedSection === "morning" ? null : "morning")}
						className="w-full flex items-center justify-between bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition border border-white/40 mb-3">
						<span className="font-bold text-slate-800">Start the day</span>
						<span className={`text-xl transition ${expandedSection === "morning" ? "rotate-180" : ""}`}>▼</span>
					</button>

					{expandedSection === "morning" && (
						<div className="space-y-3">
							{/* Pending Morning Tasks */}
							{pendingMorningTasks.length === 0 && completedMorningTasks.length === 0 ? (
								<p className="text-slate-600 text-center py-4">No morning tasks yet. Add one to get started!</p>
							) : (
								<>
									{pendingMorningTasks.length > 0 && (
										<div>
											<h5 className="text-xs font-semibold text-slate-600 px-2 py-1">TO DO</h5>
											<div className="space-y-2">
												{pendingMorningTasks.map((task) => (
													<div
														key={task.id}
														className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/40 flex items-center justify-between hover:shadow-lg transition">
														<div className="flex items-center gap-4 flex-1">
															<span className="text-3xl">⭐</span>
															<div className="flex-1">
																<h4 className="font-bold text-slate-800">{task.title}</h4>
																<div className="flex items-center gap-2 mt-1">
																	<span className="text-orange-500 font-bold">⚡</span>
																	<span className="text-sm text-slate-600">{task.reward || 5} XP</span>
																</div>
															</div>
														</div>
														<button
															onClick={() => handleTaskComplete(task.id)}
															disabled={task.completed}
															className={`p-3 rounded-full font-bold text-xl transition transform hover:scale-110 active:scale-95 ${
																task.completed
																	? "bg-green-200 text-green-700 cursor-default"
																	: "bg-gray-200 text-gray-600 hover:bg-gray-300"
															}`}>
															{task.completed ? "✓" : "○"}
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									{completedMorningTasks.length > 0 && (
										<div className="pt-2 border-t border-emerald-200">
											<h5 className="text-xs font-semibold text-emerald-700 px-2 py-1">✓ COMPLETED</h5>
											<div className="space-y-2">
												{completedMorningTasks.map((task) => (
													<div
														key={task.id}
														className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 shadow-md border border-emerald-200 flex items-center justify-between opacity-80">
														<div className="flex items-center gap-4 flex-1">
															<span className="text-3xl opacity-60">⭐</span>
															<div className="flex-1">
																<h4 className="font-bold text-slate-700 line-through">{task.title}</h4>
																<div className="flex items-center gap-2 mt-1">
																	<span className="text-emerald-600 font-bold">⚡</span>
																	<span className="text-sm text-slate-600">{task.reward || 5} XP</span>
																</div>
															</div>
														</div>
														<div className="p-3 rounded-full font-bold text-xl bg-emerald-200 text-emerald-700">✓</div>
													</div>
												))}
											</div>
										</div>
									)}
								</>
							)}
						</div>
					)}
				</div>

				{/* Anytime Tasks Section */}
				<div className="mb-6">
					<button
						onClick={() => setExpandedSection(expandedSection === "anytime" ? null : "anytime")}
						className="w-full flex items-center justify-between bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition border border-white/40 mb-3">
						<span className="font-bold text-slate-800">Anytime tasks</span>
						<span className={`text-xl transition ${expandedSection === "anytime" ? "rotate-180" : ""}`}>▼</span>
					</button>

					{expandedSection === "anytime" && (
						<div className="space-y-3">
							{/* Pending Anytime Tasks */}
							{pendingAnytimeTasks.length === 0 && completedAnytimeTasks.length === 0 ? (
								<p className="text-slate-600 text-center py-4">No anytime tasks yet. Add one to get started!</p>
							) : (
								<>
									{pendingAnytimeTasks.length > 0 && (
										<div>
											<h5 className="text-xs font-semibold text-slate-600 px-2 py-1">TO DO</h5>
											<div className="space-y-2">
												{pendingAnytimeTasks.map((task) => (
													<div
														key={task.id}
														className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/40 flex items-center justify-between hover:shadow-lg transition">
														<div className="flex items-center gap-4 flex-1">
															<span className="text-3xl">⭐</span>
															<div className="flex-1">
																<h4 className="font-bold text-slate-800">{task.title}</h4>
																<div className="flex items-center gap-2 mt-1">
																	<span className="text-orange-500 font-bold">⚡</span>
																	<span className="text-sm text-slate-600">{task.reward || 5} XP</span>
																</div>
															</div>
														</div>
														<button
															onClick={() => handleTaskComplete(task.id)}
															disabled={task.completed}
															className={`p-3 rounded-full font-bold text-xl transition transform hover:scale-110 active:scale-95 ${
																task.completed
																	? "bg-green-200 text-green-700 cursor-default"
																	: "bg-gray-200 text-gray-600 hover:bg-gray-300"
															}`}>
															{task.completed ? "✓" : "○"}
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									{completedAnytimeTasks.length > 0 && (
										<div className="pt-2 border-t border-emerald-200">
											<h5 className="text-xs font-semibold text-emerald-700 px-2 py-1">✓ COMPLETED</h5>
											<div className="space-y-2">
												{completedAnytimeTasks.map((task) => (
													<div
														key={task.id}
														className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 shadow-md border border-emerald-200 flex items-center justify-between opacity-80">
														<div className="flex items-center gap-4 flex-1">
															<span className="text-3xl opacity-60">⭐</span>
															<div className="flex-1">
																<h4 className="font-bold text-slate-700 line-through">{task.title}</h4>
																<div className="flex items-center gap-2 mt-1">
																	<span className="text-emerald-600 font-bold">⚡</span>
																	<span className="text-sm text-slate-600">{task.reward || 5} XP</span>
																</div>
															</div>
														</div>
														<div className="p-3 rounded-full font-bold text-xl bg-emerald-200 text-emerald-700">✓</div>
													</div>
												))}
											</div>
										</div>
									)}
								</>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Bottom Navigation */}
			<div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-green-400 via-green-300 to-green-200 border-t-4 border-green-500 shadow-2xl rounded-t-3xl">
				<div className="flex justify-around items-center py-4 px-4 max-w-2xl mx-auto w-full">
					{[
						{ icon: "🏠", label: "Home", action: "home", active: true },
						{ icon: "📋", label: "Quests", action: "companion", active: false },
						{ icon: currentUser.companion?.name ? currentUser.companion.name.charAt(0) : "🐻‍❄️", 
						  label: currentUser.companion?.name || "Companion", 
						  action: "companion", 
						  active: false },
					].map((item) => (
						<button
							key={item.label}
							className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition transform hover:scale-110 active:scale-95 ${
								item.active ? "bg-white/40 text-white font-bold" : "text-white/60 hover:text-white/80"
							}`}
							onClick={() => onNavigate?.(item.action)}>
							<span className="text-2xl">{item.icon}</span>
							<span className="text-xs font-semibold">{item.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default GameDashboard;
