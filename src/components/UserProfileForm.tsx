import React, { useState } from "react";
import type { User, Gender } from "../types";
import { useUsers } from "../hooks/useUsers";
import { generateStarterTasks } from "../utils/starterTasksGenerator";

interface UserProfileFormProps {
	onProfileCreated?: () => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onProfileCreated }) => {
	const { addUser, currentUser, updateUser, setCurrentUser } = useUsers();
	const [formData, setFormData] = useState<Partial<User>>(
		currentUser || {
			name: "",
			gender: "male" as Gender,
			age: 25,
			weight: 180,
			height: 70,
			activityLevel: "moderately_active",
			goal: "lose_weight",
			weeklyWeightLossTarget: 1.5,
			dietaryRestrictions: [],
			medicalConditions: [],
			mentalHealthChallenges: [],
			supportAreas: [],
			overwhelmTriggers: [],
		},
	);

	const mentalHealthOptions = [
		"Depression",
		"PTSD",
		"OCD",
		"Anxiety",
		"ADHD",
		"Bipolar Disorder",
		"Other",
		"I don't have any mental health issues",
	];

	const supportAreasOptions = [
		"Be more active",
		"Sleep better",
		"Stay fresh and clean",
		"Build healthy eating habits",
		"Manage stress",
		"Build focus and productivity",
		"Improve relationships",
		"Develop better routines",
		"Boost confidence",
	];

	const overwhelmTriggersOptions = [
		"Financial concerns",
		"Making decisions",
		"Mental or physical health",
		"Lack of time for yourself",
		"Relationship issues",
		"Work or career stress",
		"Social situations",
		"Change or uncertainty",
		"Too many responsibilities",
	];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCheckboxChange = (
		field: "mentalHealthChallenges" | "supportAreas" | "overwhelmTriggers",
		value: string,
	) => {
		setFormData((prev) => {
			const current = prev[field] || [];
			if (current.includes(value)) {
				return {
					...prev,
					[field]: current.filter((item) => item !== value),
				};
			} else {
				return {
					...prev,
					[field]: [...current, value],
				};
			}
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const starterTasks = generateStarterTasks({
			mentalHealthChallenges: formData.mentalHealthChallenges || [],
			supportAreas: formData.supportAreas || [],
			overwhelmTriggers: formData.overwhelmTriggers || [],
		});

		const user: User = {
			id: currentUser?.id || Date.now().toString(),
			name: formData.name || "User",
			gender: formData.gender as Gender,
			age: formData.age || 25,
			weight: formData.weight || 180,
			height: formData.height || 70,
			activityLevel: formData.activityLevel as User["activityLevel"],
			goal: formData.goal as User["goal"],
			weeklyWeightLossTarget: formData.weeklyWeightLossTarget || 1,
			dietaryRestrictions: formData.dietaryRestrictions || [],
			medicalConditions: formData.medicalConditions || [],
			mentalHealthChallenges: formData.mentalHealthChallenges || [],
			supportAreas: formData.supportAreas || [],
			overwhelmTriggers: formData.overwhelmTriggers || [],
			tasks: [...(currentUser?.tasks || []), ...starterTasks],
			createdAt: currentUser?.createdAt || new Date(),
			updatedAt: new Date(),
		};

		if (currentUser) {
			updateUser(user);
		} else {
			addUser(user);
			setCurrentUser(user);
			onProfileCreated?.();
		}
	};

	return (
		<div className="w-full max-w-3xl mx-auto px-4">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
					{currentUser ? "Update Your Profile" : "Create Your Profile"}
				</h2>
				<p className="text-gray-600 mb-8 text-sm sm:text-base">
					Fill in your details to get personalized nutrition recommendations and a customized starter plan
				</p>

				<form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
					{/* BASIC INFO SECTION */}
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<span className="text-xl">👤</span> Basic Information
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
							{/* Name */}
							<div className="sm:col-span-2">
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Name</label>
								<input
									type="text"
									name="name"
									value={formData.name || ""}
									onChange={handleInputChange}
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base placeholder-gray-400"
									placeholder="Your name"
									required
								/>
							</div>

							{/* Gender */}
							<div>
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Gender</label>
								<select
									name="gender"
									value={formData.gender || "male"}
									onChange={handleInputChange}
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base">
									<option value="male">Male</option>
									<option value="female">Female</option>
								</select>
							</div>

							{/* Age */}
							<div>
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Age (years)</label>
								<input
									type="number"
									name="age"
									value={formData.age ?? ""}
									onChange={handleInputChange}
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
									min="13"
									max="120"
								/>
							</div>

							{/* Weight */}
							<div>
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Weight (lbs)</label>
								<input
									type="number"
									name="weight"
									value={formData.weight ?? ""}
									onChange={handleInputChange}
									className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
									min="50"
									max="500"
									step="0.5"
								/>
							</div>

							{/* Height */}
							<div className="sm:col-span-2">
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Height</label>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs text-gray-600 mb-1">Feet</label>
										<input
											type="number"
											value={Math.floor((formData.height ?? 70) / 12)}
											onChange={(e) => {
												const feet = parseInt(e.target.value) || 5;
												const inches = (formData.height ?? 70) % 12;
												setFormData((prev) => ({
													...prev,
													height: feet * 12 + inches,
												}));
											}}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
											min="4"
											max="7"
										/>
									</div>
									<div>
										<label className="block text-xs text-gray-600 mb-1">Inches</label>
										<input
											type="number"
											value={(formData.height ?? 70) % 12}
											onChange={(e) => {
												const inches = Math.min(11, Math.max(0, parseInt(e.target.value) || 0));
												const feet = Math.floor((formData.height ?? 70) / 12);
												setFormData((prev) => ({
													...prev,
													height: feet * 12 + inches,
												}));
											}}
											className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base"
											min="0"
											max="11"
										/>
									</div>
								</div>

								{/* Activity Level */}
								<div>
									<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Activity Level</label>
									<select
										name="activityLevel"
										value={formData.activityLevel || "moderately_active"}
										onChange={handleInputChange}
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base">
										<option value="sedentary">Sedentary (little/no exercise)</option>
										<option value="lightly_active">Lightly Active (1-3 days/week)</option>
										<option value="moderately_active">Moderately Active (3-5 days/week)</option>
										<option value="very_active">Very Active (6-7 days/week)</option>
										<option value="extremely_active">Extremely Active (2x per day)</option>
									</select>
								</div>

								{/* Goal */}
								<div>
									<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Primary Goal</label>
									<select
										name="goal"
										value={formData.goal || "lose_weight"}
										onChange={handleInputChange}
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base">
										<option value="lose_weight">Lose Weight</option>
										<option value="maintain">Maintain Weight</option>
										<option value="gain_weight">Gain Weight</option>
									</select>
								</div>

								{/* Weekly Weight Loss Target */}
								<div className="sm:col-span-2">
									<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
										Weekly Weight Loss Target
									</label>
									<select
										name="weeklyWeightLossTarget"
										value={formData.weeklyWeightLossTarget || 1.5}
										onChange={handleInputChange}
										className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm sm:text-base">
										<option value="0.5">0.5 lbs/week (Conservative)</option>
										<option value="1">1 lbs/week (Moderate)</option>
										<option value="1.5">1.5 lbs/week (Aggressive)</option>
										<option value="2">2 lbs/week (Very Aggressive)</option>
										<option value="3">3 lbs/week (Extreme)</option>
									</select>
								</div>
							</div>
						</div>

						{/* MENTAL HEALTH SECTION */}
						<div className="border-t pt-8">
							<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
								<span className="text-xl">🧠</span> Mental Health Challenges
							</h3>
							<p className="text-gray-600 text-sm mb-4">Select any that apply (optional):</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{mentalHealthOptions.map((option) => (
									<button
										key={option}
										type="button"
										onClick={() => handleCheckboxChange("mentalHealthChallenges", option)}
										className={`p-3 rounded-lg border-2 font-medium text-sm text-left transition ${
											(formData.mentalHealthChallenges || []).includes(option)
												? "bg-blue-600 text-white border-blue-600"
												: "bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
										}`}>
										{option}
									</button>
								))}
							</div>
						</div>

						{/* SUPPORT AREAS SECTION */}
						<div className="border-t pt-8">
							<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
								<span className="text-xl">🤝</span> Areas You'd Like Support With
							</h3>
							<p className="text-gray-600 text-sm mb-4">Select the areas you want to work on:</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{supportAreasOptions.map((option) => (
									<button
										key={option}
										type="button"
										onClick={() => handleCheckboxChange("supportAreas", option)}
										className={`p-3 rounded-lg border-2 font-medium text-sm text-left transition ${
											(formData.supportAreas || []).includes(option)
												? "bg-emerald-600 text-white border-emerald-600"
												: "bg-white border-gray-300 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50"
										}`}>
										{option}
									</button>
								))}
							</div>
						</div>
					</div>
					{/* OVERWHELM TRIGGERS SECTION */}
					<div className="border-t pt-8">
						<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
							<span className="text-xl">⚡</span> What Tends to Overwhelm You Most?
						</h3>
						<p className="text-gray-600 text-sm mb-4">Select what overwhelms you (we'll create targeted support):</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{overwhelmTriggersOptions.map((option) => (
								<button
									key={option}
									type="button"
									onClick={() => handleCheckboxChange("overwhelmTriggers", option)}
									className={`p-3 rounded-lg border-2 font-medium text-sm text-left transition ${
										(formData.overwhelmTriggers || []).includes(option)
											? "bg-orange-600 text-white border-orange-600"
											: "bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
									}`}>
									{option}
								</button>
							))}
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
						{currentUser ? "Update Profile" : "Create Profile & Get Starter Plan"}
					</button>
				</form>
			</div>
		</div>
	);
};
