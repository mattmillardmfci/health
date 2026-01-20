import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";

interface SettingsProps {
	onLogout?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
	const { currentUser, updateUser, users, deleteUser, setCurrentUser } = useUsers();
	const [showExportModal, setShowExportModal] = useState(false);
	const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const handleToggleTheme = () => {
		const newTheme = currentUser.theme === "dark" ? "light" : "dark";
		const updated = { ...currentUser, theme: newTheme };
		updateUser(updated);

		// Update document
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	const handleExportData = () => {
		if (exportFormat === "json") {
			const dataStr = JSON.stringify(currentUser, null, 2);
			const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
			const exportFileDefaultName = `${currentUser.name}-data.json`;
			const linkElement = document.createElement("a");
			linkElement.setAttribute("href", dataUri);
			linkElement.setAttribute("download", exportFileDefaultName);
			linkElement.click();
		} else {
			// CSV export
			let csv = "Field,Value\n";
			csv += `User Name,${currentUser.name}\n`;
			csv += `Gender,${currentUser.gender}\n`;
			csv += `Weight (lbs),${currentUser.weight}\n`;
			csv += `Height (inches),${currentUser.height}\n`;
			csv += `Age,${currentUser.age}\n`;
			csv += `Activity Level,${currentUser.activityLevel}\n`;
			csv += `BMR,${currentUser.bmr}\n`;
			csv += `TDEE,${currentUser.tdee}\n`;
			csv += `Weight Loss Goal,${currentUser.weightLossGoal} lbs/week\n`;
			csv += `Target Calories,${currentUser.targetCalories}\n`;
			csv += `\nWeight Logs,Count: ${currentUser.weightLogs?.length || 0}\n`;
			csv += `Meal Logs,Count: ${currentUser.mealLogs?.length || 0}\n`;
			csv += `Activity Logs,Count: ${currentUser.activityLogs?.length || 0}\n`;
			csv += `Journal Entries,Count: ${currentUser.journalEntries?.length || 0}\n`;

			const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
			const exportFileDefaultName = `${currentUser.name}-data.csv`;
			const linkElement = document.createElement("a");
			linkElement.setAttribute("href", dataUri);
			linkElement.setAttribute("download", exportFileDefaultName);
			linkElement.click();
		}
		setShowExportModal(false);
	};

	const handleDeleteAccount = () => {
		deleteUser(currentUser.id);
		setShowDeleteConfirm(false);
		window.location.reload();
	};

	const handleLogout = () => {
		setCurrentUser(null);
		onLogout?.();
	};

	const handleRecalculateBMR = () => {
		const mifflinStJeor = (weight: number, height: number, age: number, gender: string) => {
			let bmr = 10 * weight + 6.25 * height - 5 * age;
			return gender === "male" ? bmr + 5 : bmr - 161;
		};

		const newBMR = Math.round(
			mifflinStJeor(currentUser.weight, currentUser.height, currentUser.age, currentUser.gender.toLowerCase()),
		);
		const newTDEE = Math.round(
			newBMR *
				(currentUser.activityLevel === "sedentary"
					? 1.2
					: currentUser.activityLevel === "lightly-active"
						? 1.375
						: currentUser.activityLevel === "moderately-active"
							? 1.55
							: currentUser.activityLevel === "very-active"
								? 1.725
								: 1.9),
		);
		const weeklyDeficit = newTDEE - (currentUser.weightLossGoal * 3500) / 7;
		const newTargetCals = Math.round(weeklyDeficit);

		const updated = {
			...currentUser,
			bmr: newBMR,
			tdee: newTDEE,
			targetCalories: newTargetCals,
			lastBMRRecalc: new Date(),
		};
		updateUser(updated);
	};

	const lastRecalc = currentUser.lastBMRRecalc ? new Date(currentUser.lastBMRRecalc).toLocaleDateString() : "Never";

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
					Settings
				</h2>

				{/* Display & Theme */}
				<div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Display</h3>
					<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<div>
							<p className="font-semibold text-gray-800 dark:text-white">Dark Mode</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
						</div>
						<button
							onClick={handleToggleTheme}
							className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
								currentUser.theme === "dark" ? "bg-blue-600" : "bg-gray-300"
							}`}>
							<span
								className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
									currentUser.theme === "dark" ? "translate-x-7" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>

				{/* Calculations */}
				<div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Calculations</h3>
					<div className="space-y-4">
						<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
							<div className="flex justify-between items-start mb-2">
								<div>
									<p className="font-semibold text-gray-800 dark:text-white">Recalculate BMR & TDEE</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">Using Mifflin-St Jeor equation</p>
									<p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Last updated: {lastRecalc}</p>
								</div>
								<button
									onClick={handleRecalculateBMR}
									className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm">
									Recalculate
								</button>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
							<div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
								<p className="text-xs text-gray-600 dark:text-gray-400">Current BMR</p>
								<p className="text-xl font-bold text-gray-800 dark:text-white">{currentUser.bmr}</p>
							</div>
							<div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
								<p className="text-xs text-gray-600 dark:text-gray-400">Current TDEE</p>
								<p className="text-xl font-bold text-gray-800 dark:text-white">{currentUser.tdee}</p>
							</div>
							<div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
								<p className="text-xs text-gray-600 dark:text-gray-400">Target Calories</p>
								<p className="text-xl font-bold text-gray-800 dark:text-white">{currentUser.targetCalories}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Data Management */}
				<div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Data Management</h3>
					<div className="space-y-3">
						<button
							onClick={() => setShowExportModal(true)}
							className="w-full px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition">
							📥 Export Your Data
						</button>
						<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
							<p className="font-semibold text-gray-800 dark:text-white mb-2">Data Summary</p>
							<ul className="space-y-1">
								<li>Weight Logs: {currentUser.weightLogs?.length || 0}</li>
								<li>Measurements: {currentUser.measurementLogs?.length || 0}</li>
								<li>Meal Logs: {currentUser.mealLogs?.length || 0}</li>
								<li>Activities: {currentUser.activityLogs?.length || 0}</li>
								<li>Journal Entries: {currentUser.journalEntries?.length || 0}</li>
								<li>Goals: {currentUser.goals?.length || 0}</li>
								<li>Supplement Stacks: {currentUser.supplementStacks?.length || 0}</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Account */}
				<div>
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account</h3>				
				{/* Logout */}
				<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
					<p className="font-semibold text-gray-800 dark:text-white mb-2">Sign Out</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Log out of {currentUser.name}'s account</p>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
						Log Out
					</button>
				</div>

				{/* Delete Account */}					<div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
						<p className="font-semibold text-gray-800 dark:text-white mb-2">Delete Account</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
							Permanently delete {currentUser.name}'s account and all associated data. This cannot be undone.
						</p>
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
							Delete Account
						</button>
					</div>
				</div>
			</div>

			{/* Export Modal */}
			{showExportModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full">
						<h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Export Data</h3>
						<div className="mb-6">
							<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Format</label>
							<select
								value={exportFormat}
								onChange={(e) => setExportFormat(e.target.value as any)}
								className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white">
								<option value="json">JSON (Complete data backup)</option>
								<option value="csv">CSV (Spreadsheet format)</option>
							</select>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setShowExportModal(false)}
								className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition">
								Cancel
							</button>
							<button
								onClick={handleExportData}
								className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
								Export
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full">
						<h3 className="text-xl font-bold text-red-600 mb-4">Delete Account?</h3>
						<p className="text-gray-700 dark:text-gray-300 mb-6">
							This will permanently delete {currentUser.name}'s account and all data. This action cannot be undone.
						</p>
						<div className="flex gap-2">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition">
								Cancel
							</button>
							<button
								onClick={handleDeleteAccount}
								className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
