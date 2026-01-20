import React, { useState, useMemo } from "react";
import type { MealLog } from "../types";
import { useUsers } from "../hooks/useUsers";
import { searchFoods, getFoodsByCategory, getCategories, type FoodItem } from "../data/foods";

export const MealLogger: React.FC = () => {
	const { currentUser, updateUser } = useUsers();
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
	const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
	const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
	const [servingMultiplier, setServingMultiplier] = useState(1);
	const [showManualEntry, setShowManualEntry] = useState(false);
	const [manualEntry, setManualEntry] = useState({
		name: "",
		calories: 0,
		protein: 0,
		carbs: 0,
		fat: 0,
	});

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

	// Get filtered foods
	const filteredFoods = useMemo(() => {
		if (searchQuery.trim()) {
			return searchFoods(searchQuery);
		}
		if (selectedCategory && selectedCategory !== "all") {
			return getFoodsByCategory(selectedCategory as any);
		}
		return [];
	}, [searchQuery, selectedCategory]);

	const categories = getCategories();

	const handleAddMeal = () => {
		if (!selectedFood) return;

		const meal: MealLog = {
			id: Date.now().toString(),
			userId: currentUser.id,
			date: new Date(selectedDate),
			mealType,
			recipeName: `${selectedFood.name} x${servingMultiplier}`,
			servings: servingMultiplier,
			macros: {
				protein: selectedFood.protein * servingMultiplier,
				carbs: selectedFood.carbs * servingMultiplier,
				fat: selectedFood.fat * servingMultiplier,
				calories: selectedFood.calories * servingMultiplier,
			},
		};

		const updated = { ...currentUser, mealLogs: [...mealLogs, meal] };

		// Update quest progress for meal logging
		let questCompleted = false;
		let questRewardXP = 0;
		let questRewardPoints = 0;

		if (Array.isArray(updated.quests)) {
			const todayDate = new Date(selectedDate);
			todayDate.setHours(0, 0, 0, 0);

			updated.quests = updated.quests.map((q: any) => {
				if (q.linkedActivity === "meal") {
					const todayMealsCount = [...mealLogs, meal].filter((m) => {
						const mealDate = new Date(m.date);
						mealDate.setHours(0, 0, 0, 0);
						return mealDate.getTime() === todayDate.getTime();
					}).length;

					const newProgress = todayMealsCount;
					const isCompleted = newProgress >= q.targetCount;

					// Track if this completion is new (quest wasn't already completed)
					if (isCompleted && !q.completed) {
						questCompleted = true;
						questRewardXP = q.rewardXP || 50;
						questRewardPoints = q.rewardPoints || 30;
					}

					return {
						...q,
						currentProgress: newProgress,
						completed: isCompleted,
						completedDate: isCompleted && !q.completed ? new Date() : q.completedDate,
					};
				}
				return q;
			});
		}

		// Award XP to companion if quest was completed
		if (questCompleted && updated.companion) {
			updated.companion = {
				...updated.companion,
				experience: (updated.companion.experience || 0) + questRewardXP,
				totalPoints: (updated.companion.totalPoints || 0) + questRewardPoints,
				happiness: Math.min(100, (updated.companion.happiness || 70) + 5),
			};

			// Check for level up (100 XP per level)
			if (updated.companion.experience >= 100 * updated.companion.level) {
				updated.companion.level = (updated.companion.level || 1) + Math.floor(updated.companion.experience / (100 * updated.companion.level));
				updated.companion.experience = updated.companion.experience % (100 * updated.companion.level);
			}
		}

		updateUser(updated);
		setSelectedFood(null);
		setServingMultiplier(1);
		setSearchQuery("");
	};

	const handleAddManualMeal = () => {
		if (!manualEntry.name.trim() || manualEntry.calories <= 0) return;

		const meal: MealLog = {
			id: Date.now().toString(),
			userId: currentUser.id,
			date: new Date(selectedDate),
			mealType,
			recipeName: manualEntry.name,
			servings: 1,
			macros: {
				protein: manualEntry.protein,
				carbs: manualEntry.carbs,
				fat: manualEntry.fat,
				calories: manualEntry.calories,
			},
		};

		const updated = { ...currentUser, mealLogs: [...mealLogs, meal] };

		// Update quest progress for meal logging
		let questCompleted = false;
		let questRewardXP = 0;
		let questRewardPoints = 0;

		if (Array.isArray(updated.quests)) {
			const todayDate = new Date(selectedDate);
			todayDate.setHours(0, 0, 0, 0);

			updated.quests = updated.quests.map((q: any) => {
				if (q.linkedActivity === "meal") {
					const todayMealsCount = [...mealLogs, meal].filter((m) => {
						const mealDate = new Date(m.date);
						mealDate.setHours(0, 0, 0, 0);
						return mealDate.getTime() === todayDate.getTime();
					}).length;

					const newProgress = todayMealsCount;
					const isCompleted = newProgress >= q.targetCount;

					// Track if this completion is new (quest wasn't already completed)
					if (isCompleted && !q.completed) {
						questCompleted = true;
						questRewardXP = q.rewardXP || 50;
						questRewardPoints = q.rewardPoints || 30;
					}

					return {
						...q,
						currentProgress: newProgress,
						completed: isCompleted,
						completedDate: isCompleted && !q.completed ? new Date() : q.completedDate,
					};
				}
				return q;
			});
		}

		// Award XP to companion if quest was completed
		if (questCompleted && updated.companion) {
			updated.companion = {
				...updated.companion,
				experience: (updated.companion.experience || 0) + questRewardXP,
				totalPoints: (updated.companion.totalPoints || 0) + questRewardPoints,
				happiness: Math.min(100, (updated.companion.happiness || 70) + 5),
			};

			// Check for level up (100 XP per level)
			if (updated.companion.experience >= 100 * updated.companion.level) {
				updated.companion.level = (updated.companion.level || 1) + Math.floor(updated.companion.experience / (100 * updated.companion.level));
				updated.companion.experience = updated.companion.experience % (100 * updated.companion.level);
			}
		}

		updateUser(updated);
		setManualEntry({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
		setShowManualEntry(false);
	};

	const handleDeleteMeal = (id: string) => {
		const updated = { ...currentUser, mealLogs: mealLogs.filter((m) => m.id !== id) };
		updateUser(updated);
	};

	const tdee = currentUser.currentIntake?.calories || 2500;

	return (
		<div className="w-full max-w-5xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					🍽️ Food Logger (MyFitnessPal Style)
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
						<p className="text-xs text-gray-500">Target: {tdee}</p>
					</div>
				</div>

				{/* Add Food Section */}
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200 mb-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Add Food</h3>

					{!showManualEntry ? (
						<div className="space-y-4">
							{/* Meal Type */}
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

							{/* Category Filter */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
									<button
										onClick={() => {
											setSelectedCategory("all");
											setSearchQuery("");
										}}
										className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
											selectedCategory === "all"
												? "bg-blue-500 text-white"
												: "bg-white border-2 border-gray-300 hover:border-blue-500"
										}`}>
										All
									</button>
									{categories.map((cat) => (
										<button
											key={cat}
											onClick={() => {
												setSelectedCategory(cat);
												setSearchQuery("");
											}}
											className={`px-3 py-2 rounded-lg text-sm font-semibold transition capitalize ${
												selectedCategory === cat
													? "bg-blue-500 text-white"
													: "bg-white border-2 border-gray-300 hover:border-blue-500"
											}`}>
											{cat}
										</button>
									))}
								</div>
							</div>

							{/* Search Box */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Search Foods</label>
								<input
									type="text"
									placeholder="e.g., 'chicken breast', 'broccoli', 'turkey sandwich'"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Food List */}
							{filteredFoods.length > 0 && !selectedFood && (
								<div className="max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg bg-white">
									{filteredFoods.map((food) => (
										<button
											key={food.id}
											onClick={() => setSelectedFood(food)}
											className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 transition">
											<div className="flex justify-between items-start">
												<div>
													<p className="font-semibold text-gray-800">{food.name}</p>
													<p className="text-xs text-gray-500">
														{food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
													</p>
												</div>
											</div>
										</button>
									))}
								</div>
							)}

							{/* Selected Food */}
							{selectedFood && (
								<div className="border-2 border-blue-300 bg-blue-50 p-4 rounded-lg">
									<div className="flex justify-between items-start mb-4">
										<div>
											<p className="font-semibold text-gray-800">{selectedFood.name}</p>
											<p className="text-xs text-gray-500 mt-1">Serving: {selectedFood.serving}</p>
										</div>
										<button onClick={() => setSelectedFood(null)} className="text-gray-500 hover:text-gray-700 text-xl">
											✕
										</button>
									</div>

									{/* Serving Multiplier */}
									<div className="mb-4">
										<label className="block text-sm font-semibold text-gray-700 mb-2">Servings</label>
										<div className="flex items-center gap-2">
											<button
												onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
												className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
												-
											</button>
											<input
												type="number"
												min="0.5"
												step="0.5"
												value={servingMultiplier}
												onChange={(e) => setServingMultiplier(parseFloat(e.target.value) || 1)}
												className="w-16 px-2 py-1 border-2 border-gray-300 rounded text-center"
											/>
											<button
												onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
												className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
												+
											</button>
										</div>
									</div>

									{/* Macro Preview */}
									<div className="grid grid-cols-4 gap-2 mb-4 text-sm">
										<div className="bg-white p-2 rounded border border-red-300">
											<p className="text-red-700 font-bold">{(selectedFood.protein * servingMultiplier).toFixed(1)}g</p>
											<p className="text-xs text-gray-600">Protein</p>
										</div>
										<div className="bg-white p-2 rounded border border-blue-300">
											<p className="text-blue-700 font-bold">{(selectedFood.carbs * servingMultiplier).toFixed(1)}g</p>
											<p className="text-xs text-gray-600">Carbs</p>
										</div>
										<div className="bg-white p-2 rounded border border-yellow-300">
											<p className="text-yellow-700 font-bold">{(selectedFood.fat * servingMultiplier).toFixed(1)}g</p>
											<p className="text-xs text-gray-600">Fat</p>
										</div>
										<div className="bg-white p-2 rounded border border-emerald-300">
											<p className="text-emerald-700 font-bold">
												{(selectedFood.calories * servingMultiplier).toFixed(0)}
											</p>
											<p className="text-xs text-gray-600">Cals</p>
										</div>
									</div>

									<button
										onClick={handleAddMeal}
										className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
										Add to {mealType}
									</button>
								</div>
							)}

							{/* Manual Entry Button */}
							<button
								onClick={() => setShowManualEntry(true)}
								className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition">
								Or enter manually (e.g., "turkey sandwich")
							</button>
						</div>
					) : (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">Food Name</label>
								<input
									type="text"
									placeholder="e.g., Turkey Sandwich, 4oz Grilled Chicken"
									value={manualEntry.name}
									onChange={(e) => setManualEntry({ ...manualEntry, name: e.target.value })}
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
									<input
										type="number"
										min="0"
										value={manualEntry.calories}
										onChange={(e) => setManualEntry({ ...manualEntry, calories: parseFloat(e.target.value) || 0 })}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
									<input
										type="number"
										min="0"
										step="0.1"
										value={manualEntry.protein}
										onChange={(e) => setManualEntry({ ...manualEntry, protein: parseFloat(e.target.value) || 0 })}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
									<input
										type="number"
										min="0"
										step="0.1"
										value={manualEntry.carbs}
										onChange={(e) => setManualEntry({ ...manualEntry, carbs: parseFloat(e.target.value) || 0 })}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
									<input
										type="number"
										min="0"
										step="0.1"
										value={manualEntry.fat}
										onChange={(e) => setManualEntry({ ...manualEntry, fat: parseFloat(e.target.value) || 0 })}
										className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>

							<div className="flex gap-3">
								<button
									onClick={handleAddManualMeal}
									className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
									Add Entry
								</button>
								<button
									onClick={() => {
										setShowManualEntry(false);
										setManualEntry({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
									}}
									className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition">
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Logged Meals */}
				<div>
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Logged Meals Today</h3>
					{todayMeals.length === 0 ? (
						<p className="text-center text-gray-500 italic py-6">No meals logged yet!</p>
					) : (
						<div className="space-y-3">
							{todayMeals.map((meal) => (
								<div
									key={meal.id}
									className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-start">
									<div className="flex-1">
										<p className="font-semibold text-gray-800 capitalize">{meal.mealType}</p>
										<p className="text-sm text-gray-600">{meal.recipeName}</p>
										<p className="text-xs text-gray-500 mt-1">
											P: {meal.macros.protein.toFixed(1)}g • C: {meal.macros.carbs.toFixed(1)}g • F:{" "}
											{meal.macros.fat.toFixed(1)}g • {meal.macros.calories.toFixed(0)} cal
										</p>
									</div>
									<button
										onClick={() => handleDeleteMeal(meal.id)}
										className="text-red-500 hover:text-red-700 font-bold">
										✕
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
