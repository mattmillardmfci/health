import React, { useState } from "react";
import { recipes, cookbookResources } from "../data/recipes";

export const RecipesSection: React.FC = () => {
	const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	const dietOptions = ["keto", "low-carb", "mediterranean", "protein-heavy"];

	const toggleDiet = (diet: string) => {
		setSelectedDiets((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]));
	};

	const filteredRecipes = recipes.filter((recipe) => {
		const matchesDiet =
			selectedDiets.length === 0 || selectedDiets.some((diet) => recipe.dietTypes.includes(diet as any));
		const matchesSearch =
			recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesDiet && matchesSearch;
	});

	return (
		<div className="space-y-8">
			{/* Recipes Section */}
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					🍳 Low-Carb Recipes & Meal Ideas
				</h2>

				{/* Search Bar */}
				<div className="mb-6">
					<input
						type="text"
						placeholder="Search recipes..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base placeholder-gray-400"
					/>
				</div>

				{/* Diet Filters */}
				<div className="mb-6">
					<h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Filter by Diet Type:</h3>
					<div className="flex flex-wrap gap-2">
						{dietOptions.map((diet) => (
							<button
								key={diet}
								onClick={() => toggleDiet(diet)}
								className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
									selectedDiets.includes(diet)
										? "bg-blue-600 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}>
								{diet.replace("-", " ").toUpperCase()}
							</button>
						))}
					</div>
				</div>

				{/* Recipe Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					{filteredRecipes.map((recipe) => (
						<div
							key={recipe.id}
							className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-blue-100 hover:shadow-lg transition">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
								<h3 className="font-bold text-gray-800 text-base sm:text-lg">{recipe.name}</h3>
								<div className="flex flex-wrap gap-1">
									{recipe.dietTypes.map((diet) => (
										<span key={diet} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
											{diet.replace("-", " ")}
										</span>
									))}
								</div>
							</div>

							<p className="text-gray-700 text-xs sm:text-sm mb-4 leading-relaxed">{recipe.description}</p>

							{/* Macros Summary */}
							<div className="grid grid-cols-4 gap-2 mb-4 text-xs sm:text-sm">
								<div className="bg-white rounded p-2 border border-blue-200">
									<div className="font-bold text-blue-600">{recipe.macros.protein}g</div>
									<div className="text-gray-600 text-xs">Protein</div>
								</div>
								<div className="bg-white rounded p-2 border border-yellow-200">
									<div className="font-bold text-yellow-600">{recipe.macros.carbs}g</div>
									<div className="text-gray-600 text-xs">Carbs</div>
								</div>
								<div className="bg-white rounded p-2 border border-orange-200">
									<div className="font-bold text-orange-600">{recipe.macros.fat}g</div>
									<div className="text-gray-600 text-xs">Fat</div>
								</div>
								<div className="bg-white rounded p-2 border border-emerald-200">
									<div className="font-bold text-emerald-600">{recipe.macros.calories}</div>
									<div className="text-gray-600 text-xs">Calories</div>
								</div>
							</div>

							{/* Ingredients */}
							<div className="mb-4">
								<h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">Ingredients:</h4>
								<ul className="text-xs sm:text-sm text-gray-700 space-y-1">
									{recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
										<li key={idx} className="flex items-start space-x-2">
											<span className="text-emerald-600 font-bold flex-shrink-0">•</span>
											<span>{ingredient}</span>
										</li>
									))}
									{recipe.ingredients.length > 3 && (
										<li className="text-gray-500 italic">+{recipe.ingredients.length - 3} more ingredients</li>
									)}
								</ul>
							</div>

							{/* Quick Instructions */}
							<div className="mb-4">
								<h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">Instructions:</h4>
								<ol className="text-xs sm:text-sm text-gray-700 space-y-1">
									{recipe.instructions.slice(0, 2).map((instruction, idx) => (
										<li key={idx} className="flex space-x-2">
											<span className="text-blue-600 font-bold flex-shrink-0">{idx + 1}.</span>
											<span>{instruction}</span>
										</li>
									))}
									{recipe.instructions.length > 2 && (
										<li className="text-gray-500 italic">+{recipe.instructions.length - 2} more steps</li>
									)}
								</ol>
							</div>

							{/* External Link */}
							{recipe.externalLink && (
								<a
									href={recipe.externalLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 px-3 rounded-lg text-xs sm:text-sm transition">
									View on {recipe.source} →
								</a>
							)}
						</div>
					))}
				</div>

				{filteredRecipes.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-600 text-sm sm:text-base">No recipes found matching your filters.</p>
					</div>
				)}
			</div>

			{/* Cookbooks & Resources */}
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					📚 Recommended Cookbooks & Resources
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					{cookbookResources.map((book, idx) => (
						<a
							key={idx}
							href={book.link}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200 hover:shadow-lg transition group">
							<div className="flex items-start gap-3">
								<span className="text-3xl sm:text-4xl flex-shrink-0">{book.icon}</span>
								<div>
									<h3 className="font-bold text-gray-800 text-base sm:text-lg group-hover:text-blue-600 transition">
										{book.title}
									</h3>
									<p className="text-gray-700 text-xs sm:text-sm mt-1 leading-relaxed">{book.description}</p>
									<span className="inline-block mt-3 text-blue-600 font-semibold text-xs sm:text-sm">
										Visit Resource →
									</span>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</div>
	);
};
