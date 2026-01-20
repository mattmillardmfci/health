export type Gender = "male" | "female";

// BASIC TYPES
export interface WeightLog {
	id: string;
	userId: string;
	weight: number; // lbs
	date: Date;
	notes?: string;
}

export interface MeasurementLog {
	id: string;
	userId: string;
	date: Date;
	chest?: number;
	waist?: number;
	arms?: number;
	thighs?: number;
}

export interface ProgressPhoto {
	id: string;
	userId: string;
	imageUrl: string;
	type: "front" | "side" | "back";
	date: Date;
}

export interface MealLog {
	id: string;
	userId: string;
	date: Date;
	mealType: "breakfast" | "lunch" | "dinner" | "snack";
	recipeName: string;
	servings: number;
	macros: {
		protein: number;
		carbs: number;
		fat: number;
		calories: number;
	};
	notes?: string;
}

export interface ActivityLog {
	id: string;
	userId: string;
	date: Date;
	type: "strength" | "cardio" | "walk" | "sports" | "other";
	duration: number; // minutes
	intensity: "low" | "moderate" | "high";
	caloriesBurned: number;
	notes?: string;
}

export interface Milestone {
	id: string;
	weight: number;
	reachedDate?: Date;
	celebrationMessage: string;
}

export interface Goal {
	id: string;
	userId: string;
	startWeight: number;
	currentWeight: number;
	targetWeight: number;
	startDate: Date;
	targetDate: Date;
	weeklyTarget: number;
	milestones: Milestone[];
	isCompleted: boolean;
	createdAt: Date;
}

export interface Supplement {
	name: string;
	dosage: string;
	frequency: "daily" | "twice-daily" | "as-needed";
	purpose: string;
	tier: "essential" | "recommended" | "optional";
	estimatedCost: number; // daily cost
}

export interface SupplementStack {
	id: string;
	userId: string;
	deficitLevel: "moderate" | "aggressive" | "extreme";
	daysStrict: number;
	refeedDue: Date;
	supplements: Supplement[];
	createdAt: Date;
}

export interface JournalEntry {
	id: string;
	userId: string;
	date: Date;
	entry: string;
	energy: number; // 1-10
	hunger: number; // 1-10
	mood: number; // 1-10
	sleep: number; // 1-10
	metrics?: {
		energyLevel?: number;
		hungerLevel?: number;
		moodScore?: number;
		sleepQuality?: number;
	};
	tags?: string[];
}

// GAMIFICATION
export interface CompanionStats {
	id: string;
	userId: string;
	name: string;
	level: number;
	experience: number; // XP to next level
	stage: "cub" | "juvenile" | "adolescent" | "adult"; // Growth stage
	happiness: number; // 0-100
	hunger: number; // 0-100 (100 = very hungry)
	energy: number; // 0-100
	health: number; // 0-100
	cleanliness: number; // 0-100
	lastFed: Date;
	lastCaredFor: Date;
	adventureProgress: number; // 0-100
	currentAdventure: string; // quest name
	outfit?: string; // bear clothing/accessories
	unlockedAchievements?: string[]; // achievement IDs
	totalPoints: number;
	streakDays: number; // consecutive days of check-ins
	createdAt: Date;
}

export interface Quest {
	id: string;
	userId: string;
	title: string;
	description: string;
	type: "daily" | "weekly" | "challenge" | "task-chain";
	linkedActivity: "meal" | "activity" | "journal" | "weight" | "goal" | "task";
	targetCount: number;
	currentProgress: number;
	rewardPoints: number;
	rewardXP: number;
	completed: boolean;
	completedDate?: Date;
	expiresAt: Date;
	// For task-chain quests
	taskCategory?: "morning" | "anytime"; // Which category of tasks to complete
	requiredTaskCompletions?: number; // e.g., "complete 5 morning tasks"
}

export interface DailyCheckIn {
	id: string;
	userId: string;
	date: Date;
	mood: number; // 1-5
	energy: number; // 1-5
	stress: number; // 1-5
	response: string; // How did you spend your day?
	companionBondPoints: number;
}

export interface Task {
	id: string;
	userId: string;
	title: string;
	description?: string;
	category: "morning" | "anytime" | "special";
	linkedTo?: "meal" | "activity" | "journal" | "weight" | "goal" | "water" | "stretch";
	completed: boolean;
	completedDate?: Date;
	reward?: number; // Points (XP for companion)
	createdAt: Date;
	// Persistence & Progression
	isRecurring: boolean; // Auto-resets daily
	frequency?: "daily" | "weekly"; // How often it repeats
	lastCompletedDate?: Date; // Last day this was completed
	dailyStreak?: number; // Consecutive days completed
	progressionChainId?: string; // Links to previous task (e.g., 10 pushups -> 20 pushups)
	progressionValue?: number; // e.g., "10" in "Do 10 pushups"
	parentTaskId?: string; // Task that created this one
}

export interface SpecialQuest {
	id: string;
	userId: string;
	title: string;
	description: string;
	type: "hunt" | "evolution" | "milestone";
	requirement: string;
	progress: number;
	target: number;
	reward: number;
	claimed: boolean;
	claimedDate?: Date;
	expiresAt: Date;
}

// MAIN USER TYPE
export interface User {
	id: string;
	name: string;
	gender: Gender;
	age: number;
	weight: number; // in lbs
	height: number; // in inches
	activityLevel: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active";
	goal: "lose_weight" | "maintain" | "gain_weight";
	weeklyWeightLossTarget: number; // lbs per week
	dietaryRestrictions: string[];
	medicalConditions: string[];
	currentIntake?: {
		protein: number;
		carbs: number;
		fat: number;
		calories: number;
	};

	// Calculated metrics
	bmr?: number;
	tdee?: number;
	targetCalories?: number;
	weightLossGoal?: number; // lbs per week

	// Tracking arrays
	weightLogs?: WeightLog[];
	measurementLogs?: MeasurementLog[];
	progressPhotos?: ProgressPhoto[];
	mealLogs?: MealLog[];
	activityLogs?: ActivityLog[];
	journalEntries?: JournalEntry[];
	goals?: Goal[];
	supplementStacks?: SupplementStack[];

	// Gamification
	companion?: CompanionStats;
	quests?: Quest[];
	tasks?: Task[];
	specialQuests?: SpecialQuest[];
	dailyCheckIns?: DailyCheckIn[];

	// UI/App preferences
	theme?: "light" | "dark";
	lastBMRRecalc?: Date;

	createdAt: Date;
	updatedAt: Date;
}

// UTILITIES
export interface NutritionMetrics {
	bmr: number;
	tdee: number;
	proteinGrams: number;
	carbsGrams: number;
	fatGrams: number;
	proteinCalories: number;
	carbsCalories: number;
	fatCalories: number;
}

export interface CoachingAdvice {
	summary: string;
	warnings: string[];
	recommendations: {
		supplements: string[];
		refeedSchedule: string;
		mealStructure: string;
		monitoring: string[];
	};
}

export interface CalculationRequest {
	user: User;
	timeframe?: "daily" | "weekly" | "monthly";
}

export interface DailyMacroLog {
	userId: string;
	date: Date;
	meals: MealLog[];
	totalMacros: {
		protein: number;
		carbs: number;
		fat: number;
		calories: number;
	};
	remaining: {
		protein: number;
		carbs: number;
		fat: number;
		calories: number;
	};
}
