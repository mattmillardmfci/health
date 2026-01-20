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
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	// Scroll to top when navigating
	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, [view]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
			{/* Header - Only show when no user is logged in */}
			{!currentUser && (
				<header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 w-full">
						<div className="flex items-center justify-center">
							<div className="text-center">
								<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
									❄️ Snowball
								</h1>
								<p className="text-gray-500 text-xs sm:text-sm mt-1">Raise your polar bear while mastering nutrition</p>
							</div>
						</div>
					</div>
				</header>
			)}

			{/* Floating Mobile Menu - Only show when user is logged in */}
			{currentUser && (
				<button
					onClick={() => setMobileNavOpen(!mobileNavOpen)}
					className="fixed top-4 right-4 z-50 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-lg shadow-lg transition duration-200">
					{mobileNavOpen ? "✕" : "☰"}
				</button>
			)}

			{/* Floating Mobile Menu Dropdown */}
			{currentUser && mobileNavOpen && (
				<div className="fixed top-16 right-4 z-50 bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden w-64">
					<nav className="flex flex-col p-2">
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
								onClick={() => {
									setView(item.view as ViewType);
									setMobileNavOpen(false);
								}}
								className={`block w-full text-left px-4 py-3 rounded-lg transition duration-200 font-semibold text-sm ${
									view === item.view ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
								}`}>
								{item.label}
							</button>
						))}
						<div className="border-t border-gray-200 mt-2 pt-2">
							<button
								onClick={() => {
									setView("setup");
									setMobileNavOpen(false);
								}}
								className="block w-full text-left px-4 py-3 rounded-lg transition duration-200 font-semibold text-sm bg-gray-50 text-gray-700 hover:bg-gray-100">
								✏️ Edit Profile
							</button>
							<button
								onClick={() => {
									setView("settings");
									setMobileNavOpen(false);
								}}
								className="block w-full text-left px-4 py-3 rounded-lg transition duration-200 font-semibold text-sm bg-gray-50 text-gray-700 hover:bg-gray-100">
								⚙️ Settings
							</button>
						</div>
					</nav>
				</div>
			)}

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
						<UserProfileForm
						onProfileCreated={() => {
							setView("home");
							window.scrollTo(0, 0);
						}}
					/>
						</div>
					</>
				) : !currentUser ? (
					<div className="text-center py-12 sm:py-20 px-4">
						<div className="inline-block p-6 sm:p-12 bg-white rounded-2xl shadow-md max-w-sm">
							<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome to Snowball ❄️</h2>
							<p className="text-gray-600 mb-6 text-sm sm:text-base">
								Raise your polar bear companion while optimizing your nutrition and fitness!
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
					<CompanionHub
						onQuestNavigate={(section) => {
							// Convert quest activity names to view names
							const viewMap: { [key: string]: ViewType } = {
								meal: "meals",
								activity: "activity",
								journal: "journal",
								weight: "progress",
								goal: "goals",
							};
							setView(viewMap[section] || "results");
						}}
					/>
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
						<Settings
							onLogout={() => {
								setCurrentUser(null);
								setView("setup");
							}}
						/>
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
