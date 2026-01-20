import type { User, CoachingAdvice } from "../types";
import { calculateBMR, calculateTDEE } from "./nutritionCalculations";

/**
 * Generates realistic, harm-reduction focused coaching for extreme dieting scenarios
 */
export const generateCoachingAdvice = (user: User, dailyCalories: number): CoachingAdvice => {
	const bmr = calculateBMR(user);
	const tdee = calculateTDEE(bmr, user.activityLevel);
	const deficitPercent = ((tdee - dailyCalories) / tdee) * 100;

	const warnings: string[] = [];
	const recommendations = {
		supplements: [] as string[],
		refeedSchedule: "",
		mealStructure: "",
		monitoring: [] as string[],
	};

	let summary = "";

	// Scenario: Extreme cutting (boiled chicken only, very low carb/fat)
	if (deficitPercent > 25) {
		summary = `You're running a ${Math.round(deficitPercent)}% deficit. This is aggressive - you're in extreme cut territory. `;

		// Protein emphasis
		warnings.push(
			"You MUST prioritize protein intake to minimize muscle loss during extreme deficits.",
			"Expect to lose 1-1.5 lbs per week is actually sustainable without extreme measures.",
		);

		// Supplement recommendations for extreme cutting
		recommendations.supplements = [
			"Multivitamin (daily) - micronutrient losses increase during extreme cuts",
			"Electrolytes (sodium, potassium, magnesium) - critical for boiled chicken only diets",
			"Vitamin D3 (2000-4000 IU daily) - often deficient in minimal diets",
			"Omega-3 (2-3g EPA/DHA daily) - fish oil substitute if eating only chicken",
			"Caffeine/Green tea (for appetite suppression and mild metabolic lift)",
			"Creatine monohydrate (5g daily) - helps preserve muscle, requires proper hydration",
			"BCAAs or EAAs (optional) - more useful if doing fasted cardio",
		];

		// Meal structure
		if (dailyCalories < 1500) {
			recommendations.mealStructure =
				"Eat 4-5 small meals (boiled chicken + minimal vegetables). Protein with each meal (25-40g). " +
				"Space meals 3-4 hours apart. Zero calorie drinks (black coffee, water, zero calorie drinks) between meals for satiety.";

			warnings.push(
				"Calories are extremely low - this is not sustainable long-term.",
				"You will experience increased hunger, fatigue, and mood changes.",
			);
		} else {
			recommendations.mealStructure =
				"Eat 3-4 meals with high protein (30-40g per meal). Include small amounts of vegetables for fiber/micronutrients. " +
				"Consider timing protein intake around any training to maximize protein synthesis.";
		}

		// Refeed strategy
		if (deficitPercent > 30) {
			recommendations.refeedSchedule =
				"After 10-14 days of extreme cut, do a 1-2 day refeed: " +
				"1) Increase calories to maintenance TDEE. " +
				"2) Keep protein same (1g+ per lb). " +
				"3) Add carbs back (rice, potatoes, oats - 2-3g per lb). " +
				"4) Monitor weight after refeed - expect 3-5 lb increase (mostly water/glycogen), will drop in 2-3 days. " +
				"5) Refeeds help reset hormones (leptin), mental health, and preserve metabolism.";

			recommendations.monitoring.push(
				"Track weekly weight (weigh daily but look at 7-day average)",
				"Monitor strength - if dropping >5% in lifts, deficit too aggressive",
				"Watch for hair loss, extreme fatigue, or persistent low mood - signs to increase calories",
				"Check bathroom regularity - if constipated, add fiber/water",
			);
		} else {
			recommendations.refeedSchedule =
				"Consider a refeed every 7-10 days: increase calories to maintenance for 1-2 meals. " +
				"This helps maintain performance and hormonal health.";
		}
	} else if (deficitPercent > 15) {
		summary = `You're running a ${Math.round(deficitPercent)}% deficit - this is a solid, sustainable cut. `;

		recommendations.supplements = [
			"Multivitamin (daily)",
			"Vitamin D3 (1000-2000 IU daily) if limited sun exposure",
			"Creatine monohydrate (5g daily) - optional but helpful",
		];

		recommendations.mealStructure =
			"Eat 3 balanced meals: protein (25-35g), complex carbs, and healthy fats. " +
			"Include plenty of vegetables for fiber and micronutrients. You can be flexible with food choices here.";

		recommendations.refeedSchedule =
			"Optional - consider one higher calorie day per week (closer to maintenance) for adherence and hormone reset.";

		recommendations.monitoring.push("Track weekly weight trends", "Monitor energy levels and performance");
	} else {
		summary = `You're running a ${Math.round(deficitPercent)}% deficit - this is a conservative, easy-to-sustain cut. `;

		recommendations.supplements = [
			"Multivitamin (optional)",
			"Vitamin D3 (1000-2000 IU daily) if limited sun exposure",
		];

		recommendations.mealStructure =
			"Eat normally with a focus on protein (20-25% of calories). " +
			"You can eat a variety of foods while staying in a deficit. Emphasis on whole foods for satiety.";

		recommendations.refeedSchedule =
			"Not necessary - eat at maintenance whenever you want (flex meals with friends, etc).";
	}

	// Universal monitoring advice
	recommendations.monitoring.push(
		"Take progress photos weekly",
		"Measure body parts (chest, waist, arms) - scale weight can be misleading",
		"If hitting a 2-3 week plateau, increase deficit by 100-150 calories OR add 15 min cardio",
	);

	return {
		summary,
		warnings,
		recommendations,
	};
};

/**
 * Specific advice for post-extreme-cut refeeds
 */
export const getRefeedAdvice = (weeksOfExtremeCut: number): string => {
	if (weeksOfExtremeCut < 1) {
		return "Refeeds are optional at this stage - you can go longer if comfortable.";
	}

	if (weeksOfExtremeCut >= 2) {
		return (
			`After ${weeksOfExtremeCut} weeks of extreme cutting, a refeed is CRITICAL for hormone recovery. ` +
			"Do a 1-2 day refeed now focusing on carbs (rice, oats, potatoes) while maintaining protein. " +
			"This will reset leptin and improve adherence for the next cut phase."
		);
	}

	return "You can do a refeed after 10-14 days of cutting for mental health and hormone optimization.";
};

/**
 * Supplement recommendations for extreme cutting scenarios
 */
export const getSupplementRecommendations = (scenario: string): { supplements: string[]; rationale: string } => {
	const baseSupplements = [
		"Multivitamin - comprehensive micronutrient coverage",
		"Electrolytes - sodium, potassium, magnesium balance",
		"Vitamin D3 - immune function, mood, calcium absorption",
	];

	if (scenario === "boiled_chicken_only") {
		return {
			supplements: [
				...baseSupplements,
				"Omega-3 (fish oil) - missing from chicken-only diet, critical for hormones/inflammation",
				"Creatine monohydrate - muscle preservation, requires high water intake",
				"Fiber supplement - critical for gut health and satiety",
			],
			rationale:
				"Chicken-only diets are micronutrient sparse. Priority on electrolytes, omega-3s, and digestion support.",
		};
	}

	if (scenario === "ultra_low_carb") {
		return {
			supplements: [
				...baseSupplements,
				"Beta-Alanine - helps with strength maintenance in low-carb state",
				"Citrulline Malate - blood flow support for workouts",
			],
			rationale: "Ultra-low carb increases fatigue and performance loss. Prioritize performance support.",
		};
	}

	return {
		supplements: baseSupplements,
		rationale: "Standard extreme cut supplementation.",
	};
};
