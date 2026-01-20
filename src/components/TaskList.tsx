import React, { useState, useMemo } from "react";
import { useUsers } from "../hooks/useUsers";
import type { Task } from "../types";
import { awardXpToCompanion, checkTaskQuests, generateTaskQuests } from "../utils/taskUtils";

interface TaskListProps {
	onTaskComplete?: (taskId: string, newTaskCreated: boolean) => void;
	onQuestComplete?: (questId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
	onTaskComplete,
	onQuestComplete,
}) => {
	const { currentUser, updateUser } = useUsers();
	const [expandedCategories, setExpandedCategories] = useState<{
		[key: string]: boolean;
	}>({
		morning: true,
		anytime: true,
		special: false,
	});
	const [showAddTask, setShowAddTask] = useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskCategory, setNewTaskCategory] = useState<"morning" | "anytime">("anytime");
	const [newTaskIsRecurring, setNewTaskIsRecurring] = useState(true);
	const [newTaskProgressionValue, setNewTaskProgressionValue] = useState("");

	if (!currentUser) return null;

	const tasks = currentUser.tasks || [];
	
	// Initialize quests if they don't exist
	const quests = useMemo(() => {
		if (!currentUser.quests || currentUser.quests.length === 0) {
			const newQuests = generateTaskQuests(currentUser.id);
			// Auto-update if quests are missing
			if (currentUser.quests?.length !== newQuests.length) {
				const updated = { ...currentUser, quests: newQuests };
				updateUser(updated);
			}
			return newQuests;
		}
		return currentUser.quests;
	}, [currentUser.quests, currentUser.id, updateUser]);

	// Get today's date at midnight
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Filter tasks for today - only recurring tasks or uncompleted today
	const getTasksForToday = (category: "morning" | "anytime" | "special") => {
		return tasks.filter((t) => {
			if (t.category !== category) return false;
			// Check if task is recurring
			if (t.isRecurring) {
				// If it was completed today, don't show it
				if (t.completedDate) {
					const completedDate = new Date(t.completedDate);
					completedDate.setHours(0, 0, 0, 0);
					return completedDate < today;
				}
				return true;
			}
			// Non-recurring: only show if not completed
			return !t.completed;
		});
	};

	const morningTasks = useMemo(() => getTasksForToday("morning"), [tasks, today]);
	const anytimeTasks = useMemo(() => getTasksForToday("anytime"), [tasks, today]);
	const specialTasks = useMemo(() => getTasksForToday("special"), [tasks, today]);

	// Count today's completions for checkpoint
	const getTodayCompletedCount = (category: "morning" | "anytime") => {
		return tasks.filter((t) => {
			if (t.category !== category) return false;
			if (!t.completedDate) return false;
			const completedDate = new Date(t.completedDate);
			completedDate.setHours(0, 0, 0, 0);
			return completedDate.getTime() === today.getTime();
		}).length;
	};

	const toggleTask = (taskId: string) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		const now = new Date();
		const completedDate = task.completedDate
			? new Date(task.completedDate)
			: now;
		completedDate.setHours(0, 0, 0, 0);

		const isCompletingToday = completedDate.getTime() !== today.getTime();

		// Update the task
		let newTaskCreated = false;
		const updatedTasks = currentUser.tasks?.map((t) => {
			if (t.id === taskId) {
				return {
					...t,
					completed: !t.completed,
					completedDate: isCompletingToday ? now : undefined,
					dailyStreak: isCompletingToday
						? (t.dailyStreak || 0) + 1
						: t.dailyStreak,
				};
			}
			return t;
		}) || [];

		// If completing and has progression value, create next task
		if (
			isCompletingToday &&
			task.progressionValue &&
			task.progressionValue > 0
		) {
			const nextValue = task.progressionValue * 2;
			const progressionTaskTitle = task.title.replace(
				task.progressionValue.toString(),
				nextValue.toString()
			);

			const progressionTask: Task = {
				id: `task-${Date.now()}`,
				userId: currentUser.id,
				title: progressionTaskTitle,
				description: task.description,
				category: task.category,
				reward: (task.reward || 0) + 5, // Bonus XP for progression
				completed: false,
				createdAt: new Date(),
				isRecurring: task.isRecurring,
				frequency: task.frequency,
				progressionValue: nextValue,
				progressionChainId: taskId,
				parentTaskId: taskId,
			};

			updatedTasks.push(progressionTask);
			newTaskCreated = true;
		}

		// Award XP to companion if completing
		let newCompanion = currentUser.companion;
		if (isCompletingToday) {
			const xpReward = task.reward || 10;
			newCompanion = awardXpToCompanion(newCompanion, xpReward);
		}

		// Check task-based quests
		const { updatedQuests, completedQuestIds } = checkTaskQuests(
			{
				...currentUser,
				tasks: updatedTasks,
				quests,
			},
			taskId,
			newTaskCreated
		);

		// Notify of completed quests
		completedQuestIds.forEach((questId) => {
			onQuestComplete?.(questId);
		});

		const updated = {
			...currentUser,
			tasks: updatedTasks,
			companion: newCompanion,
			quests: updatedQuests,
		};
		updateUser(updated);
		onTaskComplete?.(taskId, newTaskCreated);
	};

	const addTask = () => {
		if (!newTaskTitle.trim()) return;

		let finalTitle = newTaskTitle;
		let progressionValue: number | undefined = undefined;

		// If progression value provided, append it to title
		if (newTaskProgressionValue.trim()) {
			const val = parseInt(newTaskProgressionValue);
			if (!isNaN(val) && val > 0) {
				finalTitle = `${newTaskTitle} ${val}`;
				progressionValue = val;
			}
		}

		const task: Task = {
			id: `task-${Date.now()}`,
			userId: currentUser.id,
			title: finalTitle,
			category: newTaskCategory,
			completed: false,
			createdAt: new Date(),
			isRecurring: newTaskIsRecurring,
			frequency: newTaskIsRecurring ? "daily" : undefined,
			progressionValue: progressionValue,
			reward: progressionValue ? 20 : 10, // Base reward
		};

		const updated = {
			...currentUser,
			tasks: [...(currentUser.tasks || []), task],
		};
		updateUser(updated);
		setNewTaskTitle("");
		setNewTaskProgressionValue("");
		setShowAddTask(false);
	};

	const TaskCategory: React.FC<{
		title: string;
		icon: string;
		categoryKey: "morning" | "anytime" | "special";
		taskList: Task[];
		completedToday: number;
	}> = ({ title, icon, categoryKey, taskList, completedToday }) => (
		<div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border-2 border-cyan-100">
			<button
				onClick={() =>
					setExpandedCategories((prev) => ({
						...prev,
						[categoryKey]: !prev[categoryKey],
					}))
				}
				className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-cyan-50 transition">
				<div className="flex items-center gap-3">
					<span className="text-2xl">{icon}</span>
					<div className="text-left">
						<h3 className="font-bold text-gray-800 text-sm sm:text-base">{title}</h3>
						<p className="text-xs text-gray-500">
							{completedToday} of {taskList.length + completedToday} completed today
						</p>
					</div>
				</div>
				<span className={`text-xl transition ${expandedCategories[categoryKey] ? "rotate-180" : ""}`}>▼</span>
			</button>

			{expandedCategories[categoryKey] && (
				<div className="px-4 sm:px-6 py-4 border-t border-cyan-100 space-y-3">
					{taskList.length === 0 ? (
						<p className="text-sm text-gray-500 italic">No tasks for today!</p>
					) : (
						taskList.map((task) => {
							// Check if completed today
							const completedToday = task.completedDate
								? new Date(task.completedDate).toDateString() ===
									new Date().toDateString()
								: false;

							// Show progression info
							const progressText =
								task.progressionValue && task.progressionValue > 0
									? ` (${task.progressionValue}/${task.progressionValue * 2})`
									: "";

							return (
								<label
									key={task.id}
									className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
										completedToday
											? "bg-emerald-50 opacity-60"
											: "hover:bg-cyan-50"
									}`}>
									<input
										type="checkbox"
										checked={completedToday}
										onChange={() => toggleTask(task.id)}
										className="w-5 h-5 rounded border-2 border-cyan-400 text-cyan-600 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
									/>
									<span className="text-sm sm:text-base text-gray-800 flex-1">
										{task.title}
										{progressText && (
											<span className="text-gray-500 text-xs ml-1">{progressText}</span>
										)}
										{task.reward && (
											<span className="text-cyan-600 font-bold ml-2">+{task.reward}xp</span>
										)}
									</span>
									{completedToday && (
										<span className="text-emerald-600 text-lg">✓</span>
									)}
								</label>
							);
						})
					)}
				</div>
			)}
		</div>
	);

	return (
		<div className="w-full max-w-3xl mx-auto">
			{/* Today's Checkpoint Header */}
			<div className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-lg">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">
					📍 Today's Checkpoint - {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
				</h1>
				<p className="text-orange-100">
					{currentUser.companion?.name || "Your polar bear"} is watching! Complete tasks to earn XP.
				</p>
			</div>

			{/* Morning Tasks */}
			<TaskCategory
				title="Morning Routine"
				icon="☀️"
				categoryKey="morning"
				taskList={morningTasks}
				completedToday={getTodayCompletedCount("morning")}
			/>

			{/* Anytime Tasks */}
			<TaskCategory
				title="Anytime Tasks"
				icon="⚡"
				categoryKey="anytime"
				taskList={anytimeTasks}
				completedToday={getTodayCompletedCount("anytime")}
			/>

			{/* Special Tasks */}
			{specialTasks.length > 0 && (
				<TaskCategory
					title="Special Hunts & Evolutions"
					icon="🎯"
					categoryKey="special"
					taskList={specialTasks}
					completedToday={0}
				/>
			)}

			{/* Add Task Section */}
			<div className="bg-white rounded-xl shadow-md border-2 border-cyan-200 p-4 sm:p-6">
				{!showAddTask ? (
					<button
						onClick={() => setShowAddTask(true)}
						className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition">
						+ Add Persistent Task
					</button>
				) : (
					<div className="space-y-3">
						<input
							type="text"
							value={newTaskTitle}
							onChange={(e) => setNewTaskTitle(e.target.value)}
							placeholder="e.g., Do pushups"
							maxLength={50}
							className="w-full px-4 py-2 border-2 border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
							onKeyDown={(e) => e.key === "Enter" && addTask()}
							autoFocus
						/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							<select
								value={newTaskCategory}
								onChange={(e) =>
									setNewTaskCategory(e.target.value as "morning" | "anytime")
								}
								className="px-3 py-2 border-2 border-cyan-300 rounded-lg text-sm">
								<option value="anytime">Anytime Task</option>
								<option value="morning">Morning Task</option>
							</select>
							<label className="flex items-center gap-2 px-3 py-2 border-2 border-cyan-300 rounded-lg text-sm cursor-pointer bg-cyan-50">
								<input
									type="checkbox"
									checked={newTaskIsRecurring}
									onChange={(e) => setNewTaskIsRecurring(e.target.checked)}
									className="w-4 h-4"
								/>
								Repeats daily
							</label>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-semibold text-gray-700">
								Starting rep count (optional, for progression)
							</label>
							<div className="flex gap-2">
								<input
									type="number"
									value={newTaskProgressionValue}
									onChange={(e) => setNewTaskProgressionValue(e.target.value)}
									placeholder="e.g., 10 for '10 pushups'"
									min="1"
									className="flex-1 px-3 py-2 border-2 border-cyan-300 rounded-lg text-sm"
								/>
								<span className="flex items-center text-xs text-gray-500">
									→ {newTaskProgressionValue ? parseInt(newTaskProgressionValue) * 2 : "20"}
								</span>
							</div>
						</div>

						<div className="flex gap-2">
							<button
								onClick={addTask}
								disabled={!newTaskTitle.trim()}
								className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg font-semibold transition">
								Add Task
							</button>
							<button
								onClick={() => setShowAddTask(false)}
								className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition">
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Info Box */}
			<div className="mt-8 text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
				<p className="text-sm sm:text-base text-gray-700 mb-2">
					<span className="font-bold">💡 Progression Tasks:</span> Complete "Do 10 pushups" to unlock "Do 20 pushups"!
				</p>
				<p className="text-xs text-gray-600 italic">
					Each progression earns bonus XP and builds toward quest rewards.
				</p>
			</div>
		</div>
	);
};
