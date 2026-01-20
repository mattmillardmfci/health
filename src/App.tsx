import React, { useState } from "react";
import { UserProvider } from "./context/UserContext";
import { UserProfileForm } from "./components/UserProfileForm";
import { NutritionResults } from "./components/NutritionResults";
import { RecipesSection } from "./components/RecipesSection";
import { ProgressTracking } from "./components/ProgressTracking";
import { GoalsTracker } from "./components/GoalsTracker";
import { MealLogger } from "./components/MealLogger";
import { ActivityLogger } from "./components/ActivityLogger";
import { SupplementStackBuilder } from "./components/SupplementStackBuilder";
import { JournalComponent } from "./components/JournalComponent";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { Settings } from "./components/Settings";
import { CompanionHub } from "./components/CompanionHub";
import { TaskList } from "./components/TaskList";
import { useUsers } from "./hooks/useUsers";
import "./App.css";

type ViewType =
	| "setup"
	| "home"
	| "results"
	| "recipes"
	| "progress"
	| "goals"
	| "meals"
	| "activity"
	| "journal"
	| "supplements"
	| "analytics"
	| "companion"
	| "settings";

function AppContent() {
	const { users, currentUser, setCurrentUser } = useUsers();
	const [view, setView] = useState<ViewType>(!currentUser ? "setup" : "results");

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
			{/* Header */}
			<header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
								LifeCoach Pro
							</h1>
							<p className="text-gray-500 text-xs sm:text-sm mt-1">Scientific Nutrition & Life Optimization</p>
						</div>

						{/* User Switcher */}
						{users.length > 0 && (
							<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
								<select
									value={currentUser?.id || ""}
									onChange={(e) => {
										const user = users.find((u) => u.id === e.target.value);
										if (user) setCurrentUser(user);
									}}
									className="px-3 sm:px-4 py-2.5 sm:py-2 bg-white border border-blue-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
									<option value="">Select User</option>
									{users.map((user) => (
										<option key={user.id} value={user.id}>
											{user.name}
										</option>
									))}
								</select>
								<button
									onClick={() => setView("setup")}
									className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition duration-200 font-semibold whitespace-nowrap">
									{currentUser ? "Edit" : "New User"}
								</button>
								<button
									onClick={() => setView("settings")}
									className={`px-3 sm:px-4 py-2.5 sm:py-2 text-sm rounded-lg transition duration-200 font-semibold whitespace-nowrap ${
										view === "settings" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
									}`}>
									⚙️
								</button>
							</div>
						)}
					</div>

					{/* Navigation Buttons */}
					{currentUser && (
						<div className="flex flex-wrap gap-2 text-xs sm:text-sm">
							{[
								{ view: "home", label: "🏠 Home" },
								{ view: "companion", label: "🐻‍❄️ Companion" },
								{ view: "results", label: "💪 Nutrition" },
								{ view: "progress", label: "📈 Progress" },
								{ view: "goals", label: "🎯 Goals" },
								{ view: "meals", label: "🍽️ Meals" },
								{ view: "activity", label: "🏃 Activity" },
								{ view: "journal", label: "📔 Journal" },
								{ view: "supplements", label: "💊 Supplements" },
								{ view: "analytics", label: "📊 Analytics" },
								{ view: "recipes", label: "👨‍🍳 Recipes" },
							].map((item) => (
								<button
									key={item.view}
									onClick={() => setView(item.view as ViewType)}
									className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition duration-200 font-semibold ${
										view === item.view ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}>
									{item.label}
								</button>
							))}
						</div>
					)}
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{view === "setup" ? (
					<>
						<div className="mb-8">
							<button
								onClick={() => {
									if (currentUser) {
										setView("results");
									}
								}}
								className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 font-medium ${
									currentUser ? "text-blue-600 hover:bg-blue-50" : "text-gray-400 cursor-not-allowed"
								}`}
								disabled={!currentUser}>
								<span>←</span>
								<span>Back</span>
							</button>
						</div>
						<div className="flex justify-center">
							<UserProfileForm />
						</div>
					</>
				) : !currentUser ? (
					<div className="text-center py-12 sm:py-20 px-4">
						<div className="inline-block p-6 sm:p-12 bg-white rounded-2xl shadow-md max-w-sm">
							<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome to LifeCoach Pro</h2>
							<p className="text-gray-600 mb-6 text-sm sm:text-base">
								Create a profile to get started with personalized nutrition planning
							</p>
							<button
								onClick={() => setView("setup")}
								className="w-full px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-lg transition duration-200 font-semibold text-sm sm:text-base">
								Create First User
							</button>
						</div>
					</div>
				) : view === "home" ? (
					<TaskList />
				) : view === "results" ? (
					<NutritionResults user={currentUser} />
				) : view === "companion" ? (
				<CompanionHub onQuestNavigate={(section) => {
					// Convert quest activity names to view names
					const viewMap: { [key: string]: ViewType } = {
						meal: "meals",
						activity: "activity",
						journal: "journal",
						weight: "progress",
						goal: "goals"
					};
					setView(viewMap[section] || "results");
				}} />
				) : view === "progress" ? (
					<ProgressTracking />
				) : view === "goals" ? (
					<GoalsTracker />
				) : view === "meals" ? (
					<MealLogger />
				) : view === "activity" ? (
					<ActivityLogger />
				) : view === "journal" ? (
					<JournalComponent />
				) : view === "supplements" ? (
					<SupplementStackBuilder />
				) : view === "analytics" ? (
					<AnalyticsDashboard />
				) : view === "recipes" ? (
					<>
						<div className="mb-8">
							<button
								onClick={() => setView("results")}
								className="flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 font-medium text-blue-600 hover:bg-blue-50">
								<span>←</span>
								<span>Back</span>
							</button>
						</div>
						<RecipesSection />
					</>
				) : view === "settings" ? (
					<>
						<div className="mb-8">
							<button
								onClick={() => setView("results")}
								className="flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 font-medium text-blue-600 hover:bg-blue-50">
								<span>←</span>
								<span>Back</span>
							</button>
						</div>
						<Settings />
					</>
				) : null}
			</main>
		</div>
	);
}

function App() {
	return (
		<UserProvider>
			<AppContent />
		</UserProvider>
	);
}

export default App;
