import type { User, NutritionMetrics } from "../types";

/**
 * Calculates BMR using Mifflin-St Jeor equation (most accurate for modern populations)
 */
export const calculateBMR = (user: User): number => {
	const { weight, height, age, gender } = user;

	// Convert weight from lbs to kg, height from inches to cm
	const weightKg = weight * 0.453592;
	const heightCm = height * 2.54;

	if (gender === "male") {
		return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
	} else {
		return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
	}
};

/**
 * Calculates TDEE based on activity level
 */
export const calculateTDEE = (bmr: number, activityLevel: User["activityLevel"]): number => {
	const activityMultipliers: Record<User["activityLevel"], number> = {
		sedentary: 1.2,
		lightly_active: 1.375,
		moderately_active: 1.55,
		very_active: 1.725,
		extremely_active: 1.9,
	};

	return bmr * activityMultipliers[activityLevel];
};

/**
 * Calculates deficit/surplus based on weight loss goal
 * 1 lb of body fat ≈ 3,500 calories
 */
export const calculateDailyCalories = (tdee: number, weeklyWeightLossTarget: number): number => {
	const dailyDeficit = (weeklyWeightLossTarget * 3500) / 7;
	return tdee - dailyDeficit;
};

/**
 * Calculates macronutrient targets
 * Uses a flexible approach: minimum protein, then adjustable carbs/fat ratio
 * Handles extreme deficits by scaling protein down if needed
 */
export const calculateMacros = (
	user: User,
	dailyCalories: number,
	proteinPerLb: number = 1.0, // grams per lb of body weight for athletes
): NutritionMetrics => {
	const bmr = calculateBMR(user);
	const tdee = calculateTDEE(bmr, user.activityLevel);

	// Fat: minimum 0.3g per lb (hormonal health)
	const minFatGrams = Math.round(user.weight * 0.3);
	const fatCalories = minFatGrams * 9;

	// Protein: 0.8-1.2g per lb for weight loss, but scale down for extreme deficits
	let proteinGrams = Math.round(user.weight * proteinPerLb);
	let proteinCalories = proteinGrams * 4;

	// If protein + fat exceeds daily calories, reduce protein
	if (proteinCalories + fatCalories > dailyCalories) {
		// Scale protein down proportionally, minimum 0.6g per lb
		const minProteinPerLb = 0.6;
		const availableCalories = dailyCalories - fatCalories;
		const scaledProtein = Math.max(user.weight * minProteinPerLb, Math.round((availableCalories / 4) * 0.8));
		proteinGrams = Math.max(Math.round(user.weight * minProteinPerLb), Math.round(scaledProtein));
		proteinCalories = proteinGrams * 4;
	}

	// Carbs: remaining calories after protein and fat
	const remainingCalories = dailyCalories - proteinCalories - fatCalories;
	const carbsGrams = Math.max(0, Math.round(remainingCalories / 4));
	const carbsCalories = carbsGrams * 4;

	return {
		bmr,
		tdee,
		proteinGrams,
		carbsGrams,
		fatGrams: minFatGrams,
		proteinCalories,
		carbsCalories,
		fatCalories,
	};
};

/**
 * Validates if a cutting protocol is sustainable
 */
export const validateCuttingProtocol = (user: User, dailyCalories: number): { isValid: boolean; warning?: string } => {
	const tdee = calculateTDEE(calculateBMR(user), user.activityLevel);
	const deficitPercent = ((tdee - dailyCalories) / tdee) * 100;

	// Warn if deficit exceeds 35% (unsustainable, muscle loss risk)
	if (deficitPercent > 35) {
		return {
			isValid: true,
			warning: `Your deficit is ${Math.round(deficitPercent)}% - this is aggressive and increases muscle loss risk. Consider a more moderate approach.`,
		};
	}

	// Block if deficit exceeds 50% (dangerous)
	if (deficitPercent > 50) {
		return {
			isValid: false,
			warning: "Deficit exceeds 50% of TDEE - this is dangerously unsustainable and will cause severe muscle loss.",
		};
	}

	return { isValid: true };
};
