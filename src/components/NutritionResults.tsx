import React from "react";
import type { User } from "../types";
import { calculateBMR, calculateTDEE, calculateMacros, calculateDailyCalories } from "../utils/nutritionCalculations";
import { generateCoachingAdvice } from "../utils/coachingEngine";

interface NutritionResultsProps {
	user: User;
}

export const NutritionResults: React.FC<NutritionResultsProps> = ({ user }) => {
	const bmr = calculateBMR(user);
	const tdee = calculateTDEE(bmr, user.activityLevel);
	const dailyCalories = calculateDailyCalories(tdee, user.weeklyWeightLossTarget);
	const macros = calculateMacros(user, dailyCalories);
	const coaching = generateCoachingAdvice(user, dailyCalories);

	const renderMacroBar = (value: number, max: number, color: string) => {
		const percentage = Math.min((value / max) * 100, 100);
		return (
			<div className="w-full bg-gray-200 rounded-full h-3">
				<div className={`h-3 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
			</div>
		);
	};

	return (
		<div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
			{/* Header */}
			<div className="text-center mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					{user.name}'s Nutrition Plan
				</h2>
				<p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-lg">
					{user.weeklyWeightLossTarget} lbs/week •{" "}
					{user.activityLevel.replace("_", " ").charAt(0).toUpperCase() + user.activityLevel.replace("_", " ").slice(1)}
				</p>
			</div>

			{/* Metabolic Metrics */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-blue-100">
					<div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">BMR</div>
					<div className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">{Math.round(bmr)}</div>
					<div className="text-xs text-gray-500 mt-1">Calories at rest</div>
				</div>

				<div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-emerald-100">
					<div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">TDEE</div>
					<div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">{Math.round(tdee)}</div>
					<div className="text-xs text-gray-500 mt-1">With activity level</div>
				</div>

				<div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-orange-100">
					<div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Daily Target</div>
					<div className="text-2xl sm:text-3xl font-bold text-orange-600 mt-2">{Math.round(dailyCalories)}</div>
					<div className="text-xs text-gray-500 mt-1">Goal calories</div>
				</div>

				<div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-rose-100">
					<div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Deficit</div>
					<div className="text-2xl sm:text-3xl font-bold text-rose-600 mt-2">{Math.round(tdee - dailyCalories)}</div>
					<div className="text-xs text-gray-500 mt-1">Calories/day</div>
				</div>
			</div>

			{/* Macronutrient Breakdown */}
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
				<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Daily Macronutrient Targets</h3>

				<div className="space-y-6 sm:space-y-8">
					{/* Protein */}
					<div className="pb-6 border-b border-gray-100">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
							<div>
								<div className="font-semibold text-gray-800">Protein</div>
								<div className="text-xs sm:text-sm text-gray-500">Muscle preservation & recovery</div>
							</div>
							<div className="text-right">
								<div className="text-xl sm:text-2xl font-bold text-red-600">{macros.proteinGrams}g</div>
								<div className="text-xs text-gray-500">{macros.proteinCalories} cal</div>
							</div>
						</div>
						{renderMacroBar(macros.proteinCalories, dailyCalories, "bg-red-500")}
						<div className="text-xs text-gray-600 mt-2 font-medium">
							{((macros.proteinCalories / dailyCalories) * 100).toFixed(0)}% of daily calories
						</div>
					</div>

					{/* Carbs */}
					<div className="pb-6 border-b border-gray-100">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
							<div>
								<div className="font-semibold text-gray-800">Carbohydrates</div>
								<div className="text-xs sm:text-sm text-gray-500">Energy & performance fuel</div>
							</div>
							<div className="text-right">
								<div className="text-xl sm:text-2xl font-bold text-blue-600">{macros.carbsGrams}g</div>
								<div className="text-xs text-gray-500">{macros.carbsCalories} cal</div>
							</div>
						</div>
						{renderMacroBar(macros.carbsCalories, dailyCalories, "bg-blue-500")}
						<div className="text-xs text-gray-600 mt-2 font-medium">
							{((macros.carbsCalories / dailyCalories) * 100).toFixed(0)}% of daily calories
						</div>
					</div>

					{/* Fat */}
					<div>
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
							<div>
								<div className="font-semibold text-gray-800">Fat</div>
								<div className="text-xs sm:text-sm text-gray-500">Hormonal health & absorption</div>
							</div>
							<div className="text-right">
								<div className="text-xl sm:text-2xl font-bold text-yellow-600">{macros.fatGrams}g</div>
								<div className="text-xs text-gray-500">{macros.fatCalories} cal</div>
							</div>
						</div>
						{renderMacroBar(macros.fatCalories, dailyCalories, "bg-yellow-500")}
						<div className="text-xs text-gray-600 mt-2 font-medium">
							{((macros.fatCalories / dailyCalories) * 100).toFixed(0)}% of daily calories
						</div>
					</div>
				</div>

				{/* Total */}
				<div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200">
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
						<div className="font-semibold text-gray-800 text-base sm:text-lg">Total Daily Calories</div>
						<div className="text-2xl sm:text-3xl font-bold text-gray-800">
							{Math.round(macros.proteinCalories + macros.carbsCalories + macros.fatCalories)}
						</div>
					</div>
				</div>
			</div>

			{/* Coaching Advice */}
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
				<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Your Personalized Coaching</h3>

				{/* Summary */}
				<div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-l-4 border-blue-600 p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg">
					<p className="text-gray-800 font-medium leading-relaxed text-sm sm:text-base">{coaching.summary}</p>
				</div>

				{/* Warnings */}
				{coaching.warnings.length > 0 && (
					<div className="mb-6 sm:mb-8">
						<h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
							<span className="text-lg sm:text-2xl mr-2 sm:mr-3">⚠️</span>
							Important Considerations
						</h4>
						<ul className="space-y-2 sm:space-y-3">
							{coaching.warnings.map((warning, idx) => (
								<li
									key={idx}
									className="flex items-start space-x-2 sm:space-x-3 bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
									<span className="text-amber-600 font-bold mt-0.5 flex-shrink-0 text-sm sm:text-base">•</span>
									<span className="text-gray-700 text-xs sm:text-sm">{warning}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Recommendations */}
				<div className="space-y-6 sm:space-y-8">
					{coaching.recommendations.supplements.length > 0 && (
						<div>
							<h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
								<span className="text-lg sm:text-2xl mr-2 sm:mr-3">💊</span>
								Recommended Supplements
							</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
								{coaching.recommendations.supplements.map((supp, idx) => (
									<div key={idx} className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
										<p className="text-gray-700 text-xs sm:text-sm">{supp}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{coaching.recommendations.mealStructure && (
						<div>
							<h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
								<span className="text-lg sm:text-2xl mr-2 sm:mr-3">🍽️</span>
								Meal Structure
							</h4>
							<div className="bg-emerald-50 p-4 sm:p-6 rounded-lg border border-emerald-100">
								<p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
									{coaching.recommendations.mealStructure}
								</p>
							</div>
						</div>
					)}

					{coaching.recommendations.refeedSchedule && (
						<div>
							<h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
								<span className="text-lg sm:text-2xl mr-2 sm:mr-3">🔄</span>
								Refeed Strategy
							</h4>
							<div className="bg-purple-50 p-4 sm:p-6 rounded-lg border border-purple-100">
								<p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
									{coaching.recommendations.refeedSchedule}
								</p>
							</div>
						</div>
					)}

					{coaching.recommendations.monitoring.length > 0 && (
						<div>
							<h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
								<span className="text-lg sm:text-2xl mr-2 sm:mr-3">📊</span>
								Monitoring & Adjustments
							</h4>
							<ul className="space-y-2">
								{coaching.recommendations.monitoring.map((item, idx) => (
									<li key={idx} className="flex items-start space-x-2 sm:space-x-3 text-gray-700 text-xs sm:text-sm">
										<span className="text-emerald-600 font-bold mt-0.5 flex-shrink-0">✓</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
