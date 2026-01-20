import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { Task } from "../types";

export const TaskList: React.FC = () => {
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

	if (!currentUser) return null;

	const tasks = currentUser.tasks || [];
	const morningTasks = tasks.filter((t) => t.category === "morning" && !t.completed);
	const anytimeTasks = tasks.filter((t) => t.category === "anytime" && !t.completed);
	const specialTasks = tasks.filter((t) => t.category === "special" && !t.completed);

	const toggleTask = (taskId: string) => {
		const updated = {
			...currentUser,
			tasks: currentUser.tasks?.map((t) =>
				t.id === taskId
					? {
							...t,
							completed: !t.completed,
							completedDate: !t.completed ? new Date() : undefined,
						}
					: t,
			),
		};
		updateUser(updated);
	};

	const addTask = () => {
		if (!newTaskTitle.trim()) return;

		const task: Task = {
			id: `task-${Date.now()}`,
			userId: currentUser.id,
			title: newTaskTitle,
			category: newTaskCategory,
			completed: false,
			createdAt: new Date(),
		};

		const updated = {
			...currentUser,
			tasks: [...(currentUser.tasks || []), task],
		};
		updateUser(updated);
		setNewTaskTitle("");
		setShowAddTask(false);
	};

	const TaskCategory: React.FC<{
		title: string;
		icon: string;
		categoryKey: "morning" | "anytime" | "special";
		taskList: Task[];
	}> = ({ title, icon, categoryKey, taskList }) => (
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
						<p className="text-xs text-gray-500">{taskList.length} tasks</p>
					</div>
				</div>
				<span className={`text-xl transition ${expandedCategories[categoryKey] ? "rotate-180" : ""}`}>▼</span>
			</button>

			{expandedCategories[categoryKey] && (
				<div className="px-4 sm:px-6 py-4 border-t border-cyan-100 space-y-3">
					{taskList.length === 0 ? (
						<p className="text-sm text-gray-500 italic">No tasks yet!</p>
					) : (
						taskList.map((task) => (
							<label
								key={task.id}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-50 cursor-pointer transition">
								<input
									type="checkbox"
									checked={task.completed}
									onChange={() => toggleTask(task.id)}
									className="w-5 h-5 rounded border-2 border-cyan-400 text-cyan-600 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
								/>
								<span className="text-sm sm:text-base text-gray-800 flex-1">
									{task.title}
									{task.reward && <span className="text-cyan-600 font-bold ml-2">+{task.reward}pts</span>}
								</span>
							</label>
						))
					)}
				</div>
			)}
		</div>
	);

	return (
		<div className="w-full max-w-3xl mx-auto">
			{/* Header with companion greeting */}
			<div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-lg">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">🌅 Start Your Day, {currentUser.name}!</h1>
				<p className="text-purple-100">Complete your tasks to keep your polar bear happy and energized</p>
			</div>

			{/* Morning Tasks */}
			<TaskCategory title="Morning Routine" icon="☀️" categoryKey="morning" taskList={morningTasks} />

			{/* Anytime Tasks */}
			<TaskCategory title="Anytime Tasks" icon="⚡" categoryKey="anytime" taskList={anytimeTasks} />

			{/* Special Tasks */}
			{specialTasks.length > 0 && (
				<TaskCategory title="Special Hunts & Evolutions" icon="🎯" categoryKey="special" taskList={specialTasks} />
			)}

			{/* Add Task Section */}
			<div className="bg-white rounded-xl shadow-md border-2 border-cyan-200 p-4 sm:p-6">
				{!showAddTask ? (
					<button
						onClick={() => setShowAddTask(true)}
						className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition">
						+ Add a Goal
					</button>
				) : (
					<div className="space-y-3">
						<input
							type="text"
							value={newTaskTitle}
							onChange={(e) => setNewTaskTitle(e.target.value)}
							placeholder="e.g., Drink 8 glasses of water"
							maxLength={50}
							className="w-full px-4 py-2 border-2 border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
							onKeyDown={(e) => e.key === "Enter" && addTask()}
							autoFocus
						/>
						<div className="flex gap-2">
							<select
								value={newTaskCategory}
								onChange={(e) => setNewTaskCategory(e.target.value as "morning" | "anytime")}
								className="flex-1 px-3 py-2 border-2 border-cyan-300 rounded-lg text-sm">
								<option value="anytime">Anytime Task</option>
								<option value="morning">Morning Task</option>
							</select>
							<button
								onClick={addTask}
								disabled={!newTaskTitle.trim()}
								className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg font-semibold transition">
								Add
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

			{/* Motivational Quote */}
			<div className="mt-8 text-center p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border-2 border-emerald-200">
				<p className="text-sm sm:text-base text-gray-700 italic">
					"Every small task completed brings your polar bear closer to full growth. Keep going! 🐻‍❄️"
				</p>
			</div>
		</div>
	);
};
