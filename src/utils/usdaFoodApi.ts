/**
 * USDA FoodData Central API Integration
 * Free, government-maintained food nutrition database
 *
 * Sign up for free API key at: https://fdc.nal.usda.gov/api-key-signup
 */

export interface USDAFood {
	fdcId: string;
	description: string;
	dataType: string;
	nutrients: {
		nutrientId: number;
		nutrientName: string;
		value: number;
		unitName: string;
	}[];
}

export interface NutritionData {
	name: string;
	serving: string;
	servingGrams: number;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

// REPLACE THIS WITH YOUR FREE API KEY FROM https://fdc.nal.usda.gov/api-key-signup
const USDA_API_KEY = "DEMO_KEY"; // Free demo key with limited requests, sign up for full access

// Nutrient IDs in USDA FoodData Central:
const NUTRIENT_IDS = {
	ENERGY_KCAL: 1008, // Energy (kcal)
	PROTEIN: 1003, // Protein
	CARBS: 1005, // Carbohydrate
	FAT: 1004, // Total lipid (fat)
};

/**
 * Search for food items in USDA FoodData Central
 * Returns closest matches to user query
 */
export async function searchUSDAFoods(query: string): Promise<USDAFood[]> {
	if (!query.trim()) return [];

	try {
		const response = await fetch(
			`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=10&api_key=${USDA_API_KEY}`,
		);

		if (!response.ok) {
			console.warn(`USDA API error: ${response.status}`);
			return [];
		}

		const data = await response.json();
		return data.foods || [];
	} catch (error) {
		console.warn("USDA FoodData API unavailable, falling back to local database", error);
		return [];
	}
}

/**
 * Get detailed nutrition info for a specific USDA food
 * Extracts relevant nutrients and calculates per 100g serving
 */
export async function getUSDAFoodDetails(fdcId: string, servingGrams: number = 100): Promise<NutritionData | null> {
	try {
		const response = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`);

		if (!response.ok) {
			console.warn(`USDA API error: ${response.status}`);
			return null;
		}

		const food = await response.json();

		// Extract nutrients - handle both per-100g and per-serving formats
		const nutrients: Record<string, number> = {
			calories: 0,
			protein: 0,
			carbs: 0,
			fat: 0,
		};

		if (food.foodNutrients && Array.isArray(food.foodNutrients)) {
			for (const nutrient of food.foodNutrients) {
				const nutrientId = nutrient.nutrient?.id;
				const unitName = nutrient.nutrient?.unitName?.toUpperCase();
				const value = nutrient.value || 0;

				// Match by nutrient ID and unit
				if (nutrientId === NUTRIENT_IDS.ENERGY_KCAL && (unitName === "KCAL" || unitName === "KJ")) {
					// If in kJ, convert to kcal (1 kcal = 4.184 kJ)
					nutrients.calories = unitName === "KJ" ? value / 4.184 : value;
				} else if (nutrientId === NUTRIENT_IDS.PROTEIN && unitName === "G") {
					nutrients.protein = value;
				} else if (nutrientId === NUTRIENT_IDS.CARBS && unitName === "G") {
					nutrients.carbs = value;
				} else if (nutrientId === NUTRIENT_IDS.FAT && unitName === "G") {
					nutrients.fat = value;
				}
			}
		}

		// Validate we got meaningful data
		if (nutrients.calories === 0 && nutrients.protein === 0) {
			console.warn(`No valid nutrition data found for food ${fdcId}`, food);
			return null;
		}

		// Scale to requested serving size (USDA provides per 100g by default)
		const scaleFactor = servingGrams / 100;

		const result: NutritionData = {
			name: food.description || "Unknown Food",
			serving: `${servingGrams}g`,
			servingGrams: servingGrams,
			calories: Math.round((nutrients.calories || 0) * scaleFactor),
			protein: Math.round((nutrients.protein || 0) * scaleFactor * 10) / 10,
			carbs: Math.round((nutrients.carbs || 0) * scaleFactor * 10) / 10,
			fat: Math.round((nutrients.fat || 0) * scaleFactor * 10) / 10,
		};

		return result;
	} catch (error) {
		console.warn("Failed to fetch USDA food details", error);
		return null;
	}
}

/**
 * Batch search across common serving sizes
 * E.g., "hamburger" returns both meat and prepared options
 */
export async function searchFoodWithServings(query: string, limit: number = 5): Promise<NutritionData[]> {
	const foods = await searchUSDAFoods(query);
	const results: NutritionData[] = [];

	for (const food of foods.slice(0, limit)) {
		const details = await getUSDAFoodDetails(food.fdcId, 100);
		if (details) {
			results.push(details);
			// Add a few common serving sizes
			if (results.length >= limit) break;
		}
	}

	return results;
}
