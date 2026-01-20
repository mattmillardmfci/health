import type { User, Task, Quest, CompanionStats } from "../types/index";

/**
 * Award XP to companion when a task is completed
 */
export const awardXpToCompanion = (companion: CompanionStats | undefined, xpAmount: number): CompanionStats => {
	if (!companion) {
		return {
			id: `companion-${Date.now()}`,
			userId: "",
			name: "Polar Bear",
			level: 1,
			experience: xpAmount,
			stage: "cub",
			happiness: 75,
			hunger: 30,
			energy: 80,
			health: 100,
			cleanliness: 80,
			lastFed: new Date(),
			lastCaredFor: new Date(),
			adventureProgress: 0,
			currentAdventure: "Exploration",
			totalPoints: xpAmount,
			streakDays: 1,
			createdAt: new Date(),
		};
	}

	// XP to next level: 100 * level
	const xpNeededForNextLevel = 100 * companion.level;
	const newExp = companion.experience + xpAmount;

	let newLevel = companion.level;
	let finalExp = newExp;

	// Check for level up
	if (newExp >= xpNeededForNextLevel) {
		newLevel = companion.level + 1;
		finalExp = newExp - xpNeededForNextLevel;
	}

	// Determine new stage based on level
	let newStage: "cub" | "juvenile" | "adolescent" | "adult" = companion.stage;
	if (newLevel >= 5 && companion.stage === "cub") newStage = "juvenile";
	if (newLevel >= 10 && companion.stage === "juvenile") newStage = "adolescent";
	if (newLevel >= 20 && companion.stage === "adolescent") newStage = "adult";

	return {
		...companion,
		level: newLevel,
		experience: finalExp,
		stage: newStage,
		totalPoints: (companion.totalPoints || 0) + xpAmount,
		happiness: Math.min(100, companion.happiness + 5),
	};
};

/**
 * Check and update task-based quests
 */
export const checkTaskQuests = (
	currentUser: User,
	completedTaskId: string,
	newTaskCreated: boolean,
): { updatedQuests: Quest[]; completedQuestIds: string[] } => {
	const tasks = currentUser.tasks || [];
	const quests = currentUser.quests || [];
	const completedTask = tasks.find((t) => t.id === completedTaskId);

	if (!completedTask) {
		return { updatedQuests: quests, completedQuestIds: [] };
	}

	const completedQuestIds: string[] = [];
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const updatedQuests = quests.map((quest) => {
		// Skip already completed quests
		if (quest.completed) return quest;

		// Task-chain quests: count task completions
		if (quest.type === "task-chain" && quest.linkedActivity === "task") {
			// Count tasks completed today in the target category
			if (quest.taskCategory) {
				const tasksCompletedToday = tasks.filter((t) => {
					if (t.category !== quest.taskCategory) return false;
					if (!t.completedDate) return false;
					const completedDate = new Date(t.completedDate);
					completedDate.setHours(0, 0, 0, 0);
					return completedDate.getTime() === today.getTime();
				}).length;

				const newProgress = tasksCompletedToday;
				const targetCount = quest.requiredTaskCompletions || 5;

				let isCompleted = newProgress >= targetCount;

				const updated = {
					...quest,
					currentProgress: newProgress,
					completed: isCompleted,
					completedDate: isCompleted ? new Date() : undefined,
				};

				if (isCompleted) {
					completedQuestIds.push(quest.id);
				}

				return updated;
			}
		}

		// Progression chain quests: triggered when new progression task is created
		if (
			newTaskCreated &&
			quest.type === "task-chain" &&
			quest.linkedActivity === "task" &&
			completedTask.progressionValue
		) {
			// Check if task matches the progression pattern
			const isProgressionTask =
				completedTask.progressionValue &&
				completedTask.progressionValue > 0 &&
				quest.title.toLowerCase().includes("progression");

			if (isProgressionTask) {
				const newProgress = (quest.currentProgress || 0) + 1;
				const targetCount = quest.targetCount;
				const isCompleted = newProgress >= targetCount;

				const updated = {
					...quest,
					currentProgress: newProgress,
					completed: isCompleted,
					completedDate: isCompleted ? new Date() : undefined,
				};

				if (isCompleted) {
					completedQuestIds.push(quest.id);
				}

				return updated;
			}
		}

		return quest;
	});

	return { updatedQuests, completedQuestIds };
};

/**
 * Generate initial task-based quests for a user
 */
export const generateTaskQuests = (userId: string): Quest[] => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(23, 59, 59, 999);

	return [
		{
			id: `quest-morning-${Date.now()}`,
			userId,
			title: "Morning Champion",
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
			id: `quest-progression-${Date.now()}`,
			userId,
			title: "Progressive Warrior",
			description: "Complete a progression chain (10→20→40 reps)",
			type: "task-chain",
			linkedActivity: "task",
			targetCount: 3,
			currentProgress: 0,
			rewardPoints: 100,
			rewardXP: 150,
			completed: false,
			expiresAt: tomorrow,
		},
		{
			id: `quest-anytime-${Date.now()}`,
			userId,
			title: "Task Master",
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
