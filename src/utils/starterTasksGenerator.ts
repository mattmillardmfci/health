import type { Task } from "../types";

interface StarterTasksConfig {
	mentalHealthChallenges: string[];
	supportAreas: string[];
	overwhelmTriggers: string[];
}

/**
 * Generate personalized starter tasks based on user's struggles and support areas
 */
export const generateStarterTasks = (config: StarterTasksConfig): Task[] => {
	const tasks: Task[] = [];
	const now = new Date();
	let taskIndex = 1;

	// MORNING ROUTINE TASKS - These are always added
	const morningTasks: Omit<Task, "id">[] = [
		{
			userId: "",
			title: "Get out of bed",
			description: "Start your day by getting out of bed - you've got this! 🌅",
			category: "morning",
			isRecurring: true,
			progressionValue: 0,
			completed: false,
			reward: 10,
		},
		{
			userId: "",
			title: "Brush teeth",
			description: "Fresh start for your teeth and mind 🦷",
			category: "morning",
			isRecurring: true,
			progressionValue: 0,
			completed: false,
			reward: 10,
		},
		{
			userId: "",
			title: "Wash my face",
			description: "Wake up your skin and feel refreshed 💧",
			category: "morning",
			isRecurring: true,
			progressionValue: 0,
			completed: false,
			reward: 10,
		},
		{
			userId: "",
			title: "Drink water",
			description: "Hydrate - your body needs it! 💧",
			category: "morning",
			isRecurring: true,
			progressionValue: 0,
			completed: false,
			reward: 10,
		},
	];

	// ANYTIME TASKS - Base tasks
	const anytimeTasks: Omit<Task, "id">[] = [
		{
			userId: "",
			title: "Take a stretch break",
			description: "Move your body and feel the tension release 🧘",
			category: "anytime",
			isRecurring: false,
			progressionValue: 5,
			completed: false,
			reward: 15,
		},
		{
			userId: "",
			title: "Do one thing that makes me happy",
			description: "Whether it's a song, a meme, or a memory 😊",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		},
		{
			userId: "",
			title: "Take a walk",
			description: "Even 5-10 minutes helps clear your mind 🚶",
			category: "anytime",
			isRecurring: false,
			progressionValue: 10,
			completed: false,
			reward: 20,
		},
	];

	// ORGANIZATION SUPPORT AREA
	if (config.supportAreas.includes("Get more organized")) {
		anytimeTasks.push({
			userId: "",
			title: "Pick up 10 items and put them away",
			description: "Tidy up by returning things to their places",
			category: "anytime",
			isRecurring: false,
			progressionValue: 10,
			completed: false,
			reward: 20,
		});
		anytimeTasks.push({
			userId: "",
			title: "Bring all dishes to the sink",
			description: "Collect dishes from rooms and stages",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Load items into the dishwasher",
			description: "Put sink items into the dishwasher",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Carry one item back to its place",
			description: "Find one item that doesn't belong and return it",
			category: "anytime",
			isRecurring: false,
			progressionValue: 1,
			completed: false,
			reward: 10,
		});
	}

	// SUPPORT AREA SPECIFIC TASKS
	if (config.supportAreas.includes("Be more active")) {
		anytimeTasks.push({
			userId: "",
			title: "Do 10 jumping jacks",
			description: "Quick cardio burst to get your heart pumping 💪",
			category: "anytime",
			isRecurring: false,
			progressionValue: 10,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Go for a walk outside",
			description: "Fresh air + movement = better mood 🌳",
			category: "anytime",
			isRecurring: false,
			progressionValue: 15,
			completed: false,
			reward: 20,
		});
	}

	if (config.supportAreas.includes("Sleep better")) {
		anytimeTasks.push({
			userId: "",
			title: "Set a sleep schedule",
			description: "Same bedtime/wake time for better sleep quality 😴",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Turn off screens 30 min before bed",
			description: "Blue light affects melatonin production 📱→📵",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.supportAreas.includes("Stay fresh and clean")) {
		anytimeTasks.push({
			userId: "",
			title: "Take a shower",
			description: "Refresh your body and mind 🚿",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Change into clean clothes",
			description: "Fresh clothes = fresh perspective 👕",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 10,
		});
	}

	if (config.supportAreas.includes("Build healthy eating habits")) {
		anytimeTasks.push({
			userId: "",
			title: "Eat a healthy meal",
			description: "Nourish your body with good food 🥗",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
		anytimeTasks.push({
			userId: "",
			title: "Drink a glass of water before eating",
			description: "Hydration helps with appetite control 💧",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 10,
		});
	}

	if (config.supportAreas.includes("Manage stress")) {
		anytimeTasks.push({
			userId: "",
			title: "Practice breathing exercise",
			description: "4-7-8 breathing: inhale 4, hold 7, exhale 8 🫁",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Meditate for 5 minutes",
			description: "Calm your mind and center yourself 🧘‍♀️",
			category: "anytime",
			isRecurring: false,
			progressionValue: 5,
			completed: false,
			reward: 20,
		});
	}

	if (config.supportAreas.includes("Build focus and productivity")) {
		anytimeTasks.push({
			userId: "",
			title: "Complete one focused task",
			description: "No distractions - just one thing for 25 minutes ⏱️",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 25,
		});
		anytimeTasks.push({
			userId: "",
			title: "Organize your workspace",
			description: "Clear space = clear mind 🗂️",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.supportAreas.includes("Improve relationships")) {
		anytimeTasks.push({
			userId: "",
			title: "Send a message to someone you care about",
			description: "Connection matters - reach out 💬",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Have a genuine conversation",
			description: "Really listen and be present 👂",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
	}

	if (config.supportAreas.includes("Develop better routines")) {
		anytimeTasks.push({
			userId: "",
			title: "Plan your day",
			description: "Know what's coming - reduces overwhelm 📅",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Do one thing on your to-do list",
			description: "Progress over perfection ✅",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.supportAreas.includes("Boost confidence")) {
		anytimeTasks.push({
			userId: "",
			title: "Do something I'm good at",
			description: "Remind yourself of your strengths 💯",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
		anytimeTasks.push({
			userId: "",
			title: "Say one positive thing about yourself",
			description: "You deserve self-compassion 🤗",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	// MENTAL HEALTH SPECIFIC TASKS
	if (config.mentalHealthChallenges.includes("Anxiety")) {
		anytimeTasks.push({
			userId: "",
			title: "Identify one worry and plan for it",
			description: "Planning reduces anxiety 📋",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
		anytimeTasks.push({
			userId: "",
			title: "Use grounding technique (5-4-3-2-1)",
			description: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste 🌍",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
	}

	if (config.mentalHealthChallenges.includes("Depression")) {
		anytimeTasks.push({
			userId: "",
			title: "Do one small act of self-care",
			description: "Even tiny steps matter 💖",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
		anytimeTasks.push({
			userId: "",
			title: "Reach out to someone",
			description: "You don't have to do this alone 🤝",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
	}

	if (config.mentalHealthChallenges.includes("ADHD")) {
		anytimeTasks.push({
			userId: "",
			title: "Break task into small steps",
			description: "Big tasks are less overwhelming when chunked 📝",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Take a movement break",
			description: "Movement helps ADHD brains focus 🏃",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.mentalHealthChallenges.includes("OCD")) {
		anytimeTasks.push({
			userId: "",
			title: "Notice a thought without acting on it",
			description: "Thoughts are just thoughts, not commands 🧠",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
	}

	if (config.mentalHealthChallenges.includes("PTSD")) {
		anytimeTasks.push({
			userId: "",
			title: "Do a grounding activity",
			description: "Bring yourself into the present moment 🌿",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
	}

	// OVERWHELM TRIGGER SPECIFIC TASKS
	if (config.overwhelmTriggers.includes("Financial concerns")) {
		anytimeTasks.push({
			userId: "",
			title: "Review one expense",
			description: "Small steps toward financial clarity 💰",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.overwhelmTriggers.includes("Making decisions")) {
		anytimeTasks.push({
			userId: "",
			title: "Make one small decision",
			description: "Build decision-making confidence 🎯",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.overwhelmTriggers.includes("Mental or physical health")) {
		anytimeTasks.push({
			userId: "",
			title: "Do one health-focused action",
			description: "Exercise, eat well, or get outside 💪",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
	}

	if (config.overwhelmTriggers.includes("Lack of time for yourself")) {
		anytimeTasks.push({
			userId: "",
			title: "Take 10 minutes for yourself",
			description: "No phones, no obligations - just you 🕐",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.overwhelmTriggers.includes("Relationship issues")) {
		anytimeTasks.push({
			userId: "",
			title: "Have an honest conversation",
			description: "Communication builds stronger connections 💬",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 20,
		});
	}

	if (config.overwhelmTriggers.includes("Work or career stress")) {
		anytimeTasks.push({
			userId: "",
			title: "Take a break from work",
			description: "You need recovery time 🛑",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "List one thing you did well at work",
			description: "Celebrate small wins 🏆",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.overwhelmTriggers.includes("Social situations")) {
		anytimeTasks.push({
			userId: "",
			title: "Say hello to one person",
			description: "Small social interactions build confidence 👋",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.overwhelmTriggers.includes("Change or uncertainty")) {
		anytimeTasks.push({
			userId: "",
			title: "List one thing you can control",
			description: "Focus on what's in your power 🎮",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	if (config.overwhelmTriggers.includes("Too many responsibilities")) {
		anytimeTasks.push({
			userId: "",
			title: "Say no to one thing",
			description: "Boundaries are healthy 🛑",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
		anytimeTasks.push({
			userId: "",
			title: "Delegate or ask for help",
			description: "You don't have to do everything 🤝",
			category: "anytime",
			isRecurring: false,
			progressionValue: 0,
			completed: false,
			reward: 15,
		});
	}

	// Convert all tasks to Task objects with IDs
	const allTasksArray = [...morningTasks, ...anytimeTasks];

	allTasksArray.forEach((task) => {
		tasks.push({
			...task,
			id: `task-${Date.now()}-${taskIndex++}`,
			userId: "",
			createdAt: now,
			completedDate: undefined,
			dailyStreak: 0,
		} as Task);
	});

	return tasks;
};
