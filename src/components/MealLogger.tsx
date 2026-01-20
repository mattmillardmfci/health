import React, { useState } from "react";
import type { MealLog } from "../types";
import { useUsers } from "../hooks/useUsers";
import { recipes } from "../data/recipes";

export const MealLogger: React.FC = () => {
	const { currentUser, updateUser } = useUsers();
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
	const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
	const [selectedRecipe, setSelectedRecipe] = useState("");
	const [servings, setServings] = useState("1");

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const mealLogs = currentUser.mealLogs || [];
	const todayMeals = mealLogs.filter((m) => new Date(m.date).toDateString() === new Date(selectedDate).toDateString());

	const totalMacros = todayMeals.reduce(
		(acc, meal) => ({
			protein: acc.protein + meal.macros.protein,
			carbs: acc.carbs + meal.macros.carbs,
			fat: acc.fat + meal.macros.fat,
			calories: acc.calories + meal.macros.calories,
		}),
		{ protein: 0, carbs: 0, fat: 0, calories: 0 },
	);

	const handleAddMeal = () => {
		if (!selectedRecipe || !servings) return;

		const recipe = recipes.find((r) => r.id === selectedRecipe);
		if (!recipe) return;

		const servingMultiplier = parseFloat(servings);
		const meal: MealLog = {
			id: Date.now().toString(),
			userId: currentUser.id,
			date: new Date(selectedDate),
			mealType,
			recipeName: recipe.name,
			servings: servingMultiplier,
			macros: {
				protein: recipe.macros.protein * servingMultiplier,
				carbs: recipe.macros.carbs * servingMultiplier,
				fat: recipe.macros.fat * servingMultiplier,
				calories: recipe.macros.calories * servingMultiplier,
			},
		};

		const updated = { ...currentUser, mealLogs: [...mealLogs, meal] };

		// Update quest progress for meal logging - Initialize quests if needed
		if (Array.isArray(updated.quests)) {
			updated.quests = updated.quests.map((q: any) =>
				q.linkedActivity === "meal" ? { ...q, currentProgress: q.currentProgress + 1 } : q,
			);
		}

		updateUser(updated);
		setSelectedRecipe("");
		setServings("1");
	};

	const handleDeleteMeal = (id: string) => {
		const updated = { ...currentUser, mealLogs: mealLogs.filter((m) => m.id !== id) };
		updateUser(updated);
	};

	const tdee = currentUser.currentIntake?.calories || 2500; // Placeholder

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					Meal Logger
				</h2>

				{/* Date Selector */}
				<div className="mb-6">
					<label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
					<input
						type="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{/* Daily Totals */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
					<div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg">
						<p className="text-xs font-semibold text-gray-600">Protein</p>
						<p className="text-xl font-bold text-red-600">{totalMacros.protein.toFixed(0)}g</p>
						<p className="text-xs text-gray-500">Target: 160g</p>
					</div>
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
						<p className="text-xs font-semibold text-gray-600">Carbs</p>
						<p className="text-xl font-bold text-blue-600">{totalMacros.carbs.toFixed(0)}g</p>
						<p className="text-xs text-gray-500">Target: 100g</p>
					</div>
					<div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg">
						<p className="text-xs font-semibold text-gray-600">Fat</p>
						<p className="text-xl font-bold text-yellow-600">{totalMacros.fat.toFixed(0)}g</p>
						<p className="text-xs text-gray-500">Target: 60g</p>
					</div>
					<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-lg">
						<p className="text-xs font-semibold text-gray-600">Calories</p>
						<p className="text-xl font-bold text-emerald-600">{totalMacros.calories.toFixed(0)}</p>
						<p className="text-xs text-gray-500">Target: 2500</p>
					</div>
				</div>

				{/* Add Meal Form */}
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200 mb-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Add Meal</h3>
					<div className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
								<select
									value={mealType}
									onChange={(e) => setMealType(e.target.value as any)}
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
									<option value="breakfast">Breakfast</option>
									<option value="lunch">Lunch</option>
									<option value="dinner">Dinner</option>
									<option value="snack">Snack</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Servings</label>
								<input
									type="number"
									value={servings}
									onChange={(e) => setServings(e.target.value)}
									placeholder="1"
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									step="0.5"
									min="0.5"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">Recipe</label>
							<select
								value={selectedRecipe}
								onChange={(e) => setSelectedRecipe(e.target.value)}
								className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
								<option value="">Select a recipe...</option>
								{recipes.map((recipe) => (
									<option key={recipe.id} value={recipe.id}>
										{recipe.name}
									</option>
								))}
							</select>
						</div>
						<button
							onClick={handleAddMeal}
							className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition">
							Add Meal
						</button>
					</div>
				</div>

				{/* Meals for Selected Date */}
				<div>
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Meals for {new Date(selectedDate).toLocaleDateString()}
					</h3>
					<div className="space-y-3">
						{todayMeals.length > 0 ? (
							todayMeals.map((meal) => (
								<div key={meal.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
									<div className="flex justify-between items-start mb-2">
										<div>
											<p className="font-semibold text-gray-800">{meal.recipeName}</p>
											<p className="text-sm text-gray-600">
												{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} • {meal.servings} serving
												{meal.servings > 1 ? "s" : ""}
											</p>
										</div>
										<button
											onClick={() => handleDeleteMeal(meal.id)}
											className="text-red-500 hover:text-red-700 font-semibold">
											✕
										</button>
									</div>
									<div className="grid grid-cols-4 gap-2 text-sm">
										<div>
											<p className="text-gray-600">P: {meal.macros.protein.toFixed(0)}g</p>
										</div>
										<div>
											<p className="text-gray-600">C: {meal.macros.carbs.toFixed(0)}g</p>
										</div>
										<div>
											<p className="text-gray-600">F: {meal.macros.fat.toFixed(0)}g</p>
										</div>
										<div>
											<p className="text-gray-600">{meal.macros.calories.toFixed(0)} cal</p>
										</div>
									</div>
								</div>
							))
						) : (
							<p className="text-center text-gray-500 py-8">No meals logged for this date</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
