/**
 * Comprehensive food database for nutrition tracking
 * Organized by category for easy searching
 */

export interface FoodItem {
	id: string;
	name: string;
	category: "meat" | "vegetable" | "fruit" | "dairy" | "grain" | "condiment" | "processed" | "custom";
	serving: string; // e.g., "100g", "1 oz", "1 cup"
	servingGrams: number;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

// MEAT - Organized by type and serving size
const meatFoods: FoodItem[] = [
	// Chicken Breast
	{
		id: "chicken-breast-3oz",
		name: "Chicken Breast (3 oz)",
		category: "meat",
		serving: "3 oz",
		servingGrams: 85,
		calories: 128,
		protein: 26,
		carbs: 0,
		fat: 2.7,
	},
	{
		id: "chicken-breast-4oz",
		name: "Chicken Breast (4 oz)",
		category: "meat",
		serving: "4 oz",
		servingGrams: 113,
		calories: 165,
		protein: 31,
		carbs: 0,
		fat: 3.6,
	},
	{
		id: "chicken-breast-6oz",
		name: "Chicken Breast (6 oz)",
		category: "meat",
		serving: "6 oz",
		servingGrams: 170,
		calories: 248,
		protein: 47,
		carbs: 0,
		fat: 5.3,
	},
	{
		id: "chicken-breast-8oz",
		name: "Chicken Breast (8 oz)",
		category: "meat",
		serving: "8 oz",
		servingGrams: 227,
		calories: 331,
		protein: 63,
		carbs: 0,
		fat: 7.1,
	},

	// Turkey Breast
	{
		id: "turkey-breast-3oz",
		name: "Turkey Breast (3 oz)",
		category: "meat",
		serving: "3 oz",
		servingGrams: 85,
		calories: 119,
		protein: 26,
		carbs: 0,
		fat: 1.1,
	},
	{
		id: "turkey-breast-4oz",
		name: "Turkey Breast (4 oz)",
		category: "meat",
		serving: "4 oz",
		servingGrams: 113,
		calories: 158,
		protein: 34,
		carbs: 0,
		fat: 1.4,
	},
	{
		id: "turkey-breast-6oz",
		name: "Turkey Breast (6 oz)",
		category: "meat",
		serving: "6 oz",
		servingGrams: 170,
		calories: 237,
		protein: 51,
		carbs: 0,
		fat: 2.1,
	},

	// Ground Turkey (93% lean)
	{
		id: "ground-turkey-4oz",
		name: "Ground Turkey 93% (4 oz)",
		category: "meat",
		serving: "4 oz",
		servingGrams: 113,
		calories: 170,
		protein: 21,
		carbs: 0,
		fat: 8.8,
	},

	// Ground Beef (93% lean)
	{
		id: "ground-beef-4oz",
		name: "Ground Beef 93% (4 oz)",
		category: "meat",
		serving: "4 oz",
		servingGrams: 113,
		calories: 180,
		protein: 24,
		carbs: 0,
		fat: 8.5,
	},

	// Hamburger Patty (meat only - 93% lean)
	{
		id: "hamburger-patty-3oz",
		name: "Hamburger Patty 93% (3 oz)",
		category: "meat",
		serving: "3 oz",
		servingGrams: 85,
		calories: 135,
		protein: 18,
		carbs: 0,
		fat: 6.4,
	},
	{
		id: "hamburger-patty-4oz",
		name: "Hamburger Patty 93% (4 oz)",
		category: "meat",
		serving: "4 oz",
		servingGrams: 113,
		calories: 180,
		protein: 24,
		carbs: 0,
		fat: 8.5,
	},
	{
		id: "hamburger-patty-6oz",
		name: "Hamburger Patty 93% (6 oz)",
		category: "meat",
		serving: "6 oz",
		servingGrams: 170,
		calories: 270,
		protein: 36,
		carbs: 0,
		fat: 12.8,
	},

	// Salmon
	{
		id: "salmon-3oz",
		name: "Salmon (3 oz)",
		category: "meat",
		serving: "3 oz",
		servingGrams: 85,
		calories: 175,
		protein: 19,
		carbs: 0,
		fat: 10,
	},
	{
		id: "salmon-6oz",
		name: "Salmon (6 oz)",
		category: "meat",
		serving: "6 oz",
		servingGrams: 170,
		calories: 350,
		protein: 38,
		carbs: 0,
		fat: 20,
	},

	// Tilapia
	{
		id: "tilapia-4oz",
		name: "Tilapia (4 oz)",
		category: "meat",
		serving: "4 oz",
		servingGrams: 113,
		calories: 120,
		protein: 25,
		carbs: 0,
		fat: 1.2,
	},
	{
		id: "tilapia-6oz",
		name: "Tilapia (6 oz)",
		category: "meat",
		serving: "6 oz",
		servingGrams: 170,
		calories: 180,
		protein: 38,
		carbs: 0,
		fat: 1.8,
	},

	// Cod
	{
		id: "cod-4oz",
		name: "Cod (4 oz)",
		category: "meat",
		serving: "4 oz",
		servingGrams: 113,
		calories: 101,
		protein: 23,
		carbs: 0,
		fat: 0.8,
	},

	// Egg Whites
	{
		id: "egg-white-1",
		name: "Egg White (1)",
		category: "meat",
		serving: "1 white",
		servingGrams: 33,
		calories: 17,
		protein: 3.6,
		carbs: 0.4,
		fat: 0.1,
	},
	{
		id: "egg-white-2",
		name: "Egg Whites (2)",
		category: "meat",
		serving: "2 whites",
		servingGrams: 66,
		calories: 34,
		protein: 7.2,
		carbs: 0.8,
		fat: 0.2,
	},

	// Whole Eggs
	{
		id: "egg-whole-1",
		name: "Whole Egg (1 large)",
		category: "meat",
		serving: "1 egg",
		servingGrams: 50,
		calories: 70,
		protein: 6,
		carbs: 0.4,
		fat: 5,
	},
];

// VEGETABLES - Raw and common preparations
const vegetableFoods: FoodItem[] = [
	// Leafy Greens
	{
		id: "broccoli-1cup",
		name: "Broccoli (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 91,
		calories: 31,
		protein: 2.6,
		carbs: 6,
		fat: 0.4,
	},
	{
		id: "spinach-1cup",
		name: "Spinach raw (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 30,
		calories: 7,
		protein: 0.9,
		carbs: 1.1,
		fat: 0.1,
	},
	{
		id: "kale-1cup",
		name: "Kale raw (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 67,
		calories: 33,
		protein: 2.2,
		carbs: 6.7,
		fat: 0.4,
	},

	// Cruciferous
	{
		id: "cauliflower-1cup",
		name: "Cauliflower (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 107,
		calories: 25,
		protein: 2,
		carbs: 5,
		fat: 0.2,
	},
	{
		id: "brussels-sprouts-1cup",
		name: "Brussels Sprouts (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 88,
		calories: 38,
		protein: 2.8,
		carbs: 7.9,
		fat: 0.3,
	},

	// Peppers
	{
		id: "bell-pepper-1",
		name: "Bell Pepper (1 medium)",
		category: "vegetable",
		serving: "1 pepper",
		servingGrams: 119,
		calories: 30,
		protein: 0.9,
		carbs: 7,
		fat: 0.3,
	},

	// Asparagus
	{
		id: "asparagus-1cup",
		name: "Asparagus (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 134,
		calories: 27,
		protein: 3,
		carbs: 5,
		fat: 0.1,
	},

	// Green Beans
	{
		id: "green-beans-1cup",
		name: "Green Beans (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 125,
		calories: 31,
		protein: 1.8,
		carbs: 7,
		fat: 0.2,
	},

	// Carrots
	{
		id: "carrots-1cup",
		name: "Carrots raw (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 128,
		calories: 52,
		protein: 1.2,
		carbs: 12,
		fat: 0.3,
	},

	// Zucchini
	{
		id: "zucchini-1cup",
		name: "Zucchini (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 124,
		calories: 19,
		protein: 1.5,
		carbs: 3.5,
		fat: 0.4,
	},

	// Mushrooms
	{
		id: "mushrooms-1cup",
		name: "Mushrooms (1 cup)",
		category: "vegetable",
		serving: "1 cup",
		servingGrams: 70,
		calories: 15,
		protein: 2.2,
		carbs: 1.5,
		fat: 0.1,
	},

	// Tomato
	{
		id: "tomato-1medium",
		name: "Tomato (1 medium)",
		category: "vegetable",
		serving: "1 tomato",
		servingGrams: 123,
		calories: 22,
		protein: 1.1,
		carbs: 4.8,
		fat: 0.2,
	},
];

// FRUITS
const fruitFoods: FoodItem[] = [
	{
		id: "apple-1medium",
		name: "Apple (1 medium)",
		category: "fruit",
		serving: "1 apple",
		servingGrams: 182,
		calories: 95,
		protein: 0.5,
		carbs: 25,
		fat: 0.3,
	},
	{
		id: "banana-1medium",
		name: "Banana (1 medium)",
		category: "fruit",
		serving: "1 banana",
		servingGrams: 118,
		calories: 105,
		protein: 1.3,
		carbs: 27,
		fat: 0.3,
	},
	{
		id: "blueberries-1cup",
		name: "Blueberries (1 cup)",
		category: "fruit",
		serving: "1 cup",
		servingGrams: 148,
		calories: 84,
		protein: 1.1,
		carbs: 21,
		fat: 0.5,
	},
	{
		id: "strawberries-1cup",
		name: "Strawberries (1 cup)",
		category: "fruit",
		serving: "1 cup",
		servingGrams: 152,
		calories: 49,
		protein: 1,
		carbs: 12,
		fat: 0.5,
	},
	{
		id: "orange-1medium",
		name: "Orange (1 medium)",
		category: "fruit",
		serving: "1 orange",
		servingGrams: 154,
		calories: 73,
		protein: 1.5,
		carbs: 18,
		fat: 0.2,
	},
];

// DAIRY
const dairyFoods: FoodItem[] = [
	{
		id: "greek-yogurt-100g",
		name: "Greek Yogurt 0% (100g)",
		category: "dairy",
		serving: "100g",
		servingGrams: 100,
		calories: 59,
		protein: 10,
		carbs: 3.3,
		fat: 0.4,
	},
	{
		id: "greek-yogurt-150g",
		name: "Greek Yogurt 0% (150g)",
		category: "dairy",
		serving: "150g",
		servingGrams: 150,
		calories: 88,
		protein: 15,
		carbs: 5,
		fat: 0.6,
	},
	{
		id: "cottage-cheese-100g",
		name: "Cottage Cheese 1% (100g)",
		category: "dairy",
		serving: "100g",
		servingGrams: 100,
		calories: 72,
		protein: 12.4,
		carbs: 2.8,
		fat: 1.2,
	},
	{
		id: "milk-skim-1cup",
		name: "Skim Milk (1 cup)",
		category: "dairy",
		serving: "1 cup",
		servingGrams: 245,
		calories: 83,
		protein: 8.2,
		carbs: 12.2,
		fat: 0.2,
	},
	{
		id: "cheese-cheddar-1oz",
		name: "Cheddar Cheese (1 oz)",
		category: "dairy",
		serving: "1 oz",
		servingGrams: 28,
		calories: 113,
		protein: 7,
		carbs: 0.4,
		fat: 9.4,
	},
];

// GRAINS & CARBS
const grainFoods: FoodItem[] = [
	{
		id: "brown-rice-1cup-cooked",
		name: "Brown Rice (1 cup cooked)",
		category: "grain",
		serving: "1 cup",
		servingGrams: 195,
		calories: 215,
		protein: 5,
		carbs: 45,
		fat: 1.8,
	},
	{
		id: "white-rice-1cup-cooked",
		name: "White Rice (1 cup cooked)",
		category: "grain",
		serving: "1 cup",
		servingGrams: 158,
		calories: 206,
		protein: 4.3,
		carbs: 45,
		fat: 0.2,
	},
	{
		id: "oats-1cup-dry",
		name: "Oats (1 cup dry)",
		category: "grain",
		serving: "1 cup",
		servingGrams: 81,
		calories: 307,
		protein: 11,
		carbs: 54,
		fat: 8.3,
	},
	{
		id: "bread-1slice",
		name: "Whole Wheat Bread (1 slice)",
		category: "grain",
		serving: "1 slice",
		servingGrams: 28,
		calories: 81,
		protein: 4,
		carbs: 14,
		fat: 1.5,
	},
	{
		id: "hamburger-bun",
		name: "Hamburger Bun (1)",
		category: "grain",
		serving: "1 bun",
		servingGrams: 43,
		calories: 120,
		protein: 4,
		carbs: 21,
		fat: 2,
	},
	{
		id: "hot-dog-bun",
		name: "Hot Dog Bun (1)",
		category: "grain",
		serving: "1 bun",
		servingGrams: 40,
		calories: 110,
		protein: 3.5,
		carbs: 20,
		fat: 1.8,
	},
	{
		id: "pasta-1cup-cooked",
		name: "Pasta (1 cup cooked)",
		category: "grain",
		serving: "1 cup",
		servingGrams: 140,
		calories: 221,
		protein: 8.1,
		carbs: 43,
		fat: 1.1,
	},
	{
		id: "sweet-potato-1medium",
		name: "Sweet Potato (1 medium)",
		category: "grain",
		serving: "1 potato",
		servingGrams: 103,
		calories: 86,
		protein: 1.6,
		carbs: 20,
		fat: 0.1,
	},
];

// CONDIMENTS & SAUCES
const condimentFoods: FoodItem[] = [
	{
		id: "peanut-butter-1tbsp",
		name: "Peanut Butter (1 tbsp)",
		category: "condiment",
		serving: "1 tbsp",
		servingGrams: 16,
		calories: 94,
		protein: 3.5,
		carbs: 3.5,
		fat: 8,
	},
	{
		id: "almond-butter-1tbsp",
		name: "Almond Butter (1 tbsp)",
		category: "condiment",
		serving: "1 tbsp",
		servingGrams: 16,
		calories: 98,
		protein: 3.4,
		carbs: 3.4,
		fat: 8.5,
	},
	{
		id: "olive-oil-1tbsp",
		name: "Olive Oil (1 tbsp)",
		category: "condiment",
		serving: "1 tbsp",
		servingGrams: 14,
		calories: 119,
		protein: 0,
		carbs: 0,
		fat: 13.5,
	},
	{
		id: "mayo-1tbsp",
		name: "Mayo (1 tbsp)",
		category: "condiment",
		serving: "1 tbsp",
		servingGrams: 14,
		calories: 99,
		protein: 0,
		carbs: 0,
		fat: 11,
	},
	{
		id: "ketchup-1tbsp",
		name: "Ketchup (1 tbsp)",
		category: "condiment",
		serving: "1 tbsp",
		servingGrams: 17,
		calories: 15,
		protein: 0,
		carbs: 4,
		fat: 0,
	},
	{
		id: "mustard-1tbsp",
		name: "Mustard (1 tbsp)",
		category: "condiment",
		serving: "1 tbsp",
		servingGrams: 10,
		calories: 3,
		protein: 0.2,
		carbs: 0.3,
		fat: 0,
	},
	{
		id: "soy-sauce-1tbsp",
		name: "Soy Sauce (1 tbsp)",
		category: "condiment",
		serving: "1 tbsp",
		servingGrams: 16,
		calories: 16,
		protein: 2.2,
		carbs: 1.5,
		fat: 0,
	},
];

// COMMON PROCESSED FOODS
const processedFoods: FoodItem[] = [
	{
		id: "protein-powder-scoop",
		name: "Protein Powder (1 scoop)",
		category: "processed",
		serving: "1 scoop",
		servingGrams: 30,
		calories: 120,
		protein: 25,
		carbs: 2,
		fat: 1.5,
	},
	{
		id: "granola-1cup",
		name: "Granola (1 cup)",
		category: "processed",
		serving: "1 cup",
		servingGrams: 122,
		calories: 597,
		protein: 14,
		carbs: 68,
		fat: 33,
	},
	{
		id: "cereal-1cup",
		name: "Breakfast Cereal (1 cup)",
		category: "processed",
		serving: "1 cup",
		servingGrams: 55,
		calories: 207,
		protein: 2,
		carbs: 44,
		fat: 1,
	},
	{
		id: "pizza-1slice",
		name: "Pizza (1 slice)",
		category: "processed",
		serving: "1 slice",
		servingGrams: 107,
		calories: 280,
		protein: 12,
		carbs: 36,
		fat: 10,
	},
	{
		id: "burger-1",
		name: "Hamburger (1)",
		category: "processed",
		serving: "1 burger",
		servingGrams: 215,
		calories: 540,
		protein: 30,
		carbs: 41,
		fat: 28,
	},
];

export const foods: FoodItem[] = [
	...meatFoods,
	...vegetableFoods,
	...fruitFoods,
	...dairyFoods,
	...grainFoods,
	...condimentFoods,
	...processedFoods,
];

/**
 * Search foods by name
 */
export const searchFoods = (query: string, category?: string): FoodItem[] => {
	const lowerQuery = query.toLowerCase();
	return foods.filter((food) => {
		const matchesName = food.name.toLowerCase().includes(lowerQuery);
		const matchesCategory = !category || food.category === category;
		return matchesName && matchesCategory;
	});
};

/**
 * Get foods by category
 */
export const getFoodsByCategory = (category: FoodItem["category"]): FoodItem[] => {
	return foods.filter((f) => f.category === category);
};

/**
 * Get all categories
 */
export const getCategories = (): FoodItem["category"][] => {
	return ["meat", "vegetable", "fruit", "dairy", "grain", "condiment", "processed"];
};
