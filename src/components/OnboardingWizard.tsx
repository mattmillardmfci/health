import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../types";
import { generateStarterTasks } from "../utils/starterTasksGenerator";

interface OnboardingWizardProps {
	onCompleted: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onCompleted }) => {
	const { addUser } = useUsers();
	const [step, setStep] = useState<Step>(0);
	const [name, setName] = useState("");
	const [ageRange, setAgeRange] = useState<string>("");
	const [gender, setGender] = useState<"male" | "female" | "other" | null>(null);
	const [activity, setActivity] = useState<
		"sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active"
	>("lightly_active");
	const [supportAreas, setSupportAreas] = useState<string[]>([]);
	const [error, setError] = useState("");

	const toggleSupportArea = (area: string) => {
		setSupportAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
	};

	const next = () => setStep((s) => Math.min(s + 1, 4) as Step);
	const back = () => setStep((s) => Math.max(s - 1, 0) as Step);

	const createUser = () => {
		if (!name.trim()) {
			setError("Please name your cub");
			return;
		}
		const now = new Date();
		const age =
			ageRange === "13-17"
				? 15
				: ageRange === "18-24"
					? 21
					: ageRange === "25-34"
						? 30
						: ageRange === "35-44"
							? 40
							: ageRange === "45-54"
								? 50
								: ageRange === "55-64"
									? 60
									: 70;
		const newUser: User = {
			id: `user-${Date.now()}`,
			name: name.trim(),
			gender: (gender || "male") as any,
			age,
			weight: 180,
			height: 70,
			activityLevel: activity,
			goal: "lose_weight",
			weeklyWeightLossTarget: 1,
			dietaryRestrictions: [],
			medicalConditions: [],
			companion: {
				id: `companion-${Date.now()}`,
				userId: "",
				name: "Polar Bear",
				level: 1,
				experience: 0,
				stage: "cub",
				happiness: 80,
				hunger: 20,
				energy: 70,
				health: 90,
				cleanliness: 80,
				lastFed: now,
				lastCaredFor: now,
				adventureProgress: 0,
				currentAdventure: "1st Adventure",
				totalPoints: 0,
				streakDays: 0,
				createdAt: now,
			},
			tasks: [],
			quests: [],
			specialQuests: [],
			mealLogs: [],
			activityLogs: [],
			journalEntries: [],
			mealTypes: ["Meal 1", "Meal 2", "Meal 3", "Meal 4", "Snacks", "Supplements"],
			createdAt: now,
			updatedAt: now,
		};

		const starterTasks = generateStarterTasks({
			mentalHealthChallenges: [],
			supportAreas,
			overwhelmTriggers: [],
		}).map((t) => ({ ...t, userId: newUser.id }));

		addUser({ ...newUser, tasks: starterTasks });
		onCompleted();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-4">
			<div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200">
				<div className="p-6">
					{/* Progress */}
					<div className="flex items-center gap-2 mb-6">
						{[0, 1, 2, 3, 4].map((idx) => (
							<div key={idx} className={`h-2 flex-1 rounded-full ${idx <= step ? "bg-emerald-500" : "bg-slate-200"}`} />
						))}
					</div>

					{/* Steps */}
					{step === 0 && (
						<div className="animate-slide-in">
							<h2 className="text-2xl font-bold text-slate-800 mb-2">A new cub is born! 🐻‍❄️</h2>
							<p className="text-slate-600 mb-6">Give your cub a name.</p>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === "Enter" && name.trim()) next();
								}}
								placeholder="e.g., Snowy"
								className="w-full px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-emerald-400"
								autoFocus
							/>
							{error && <div className="mt-3 text-sm text-rose-600">{error}</div>}
							<div className="mt-6 flex justify-end">
								<button
									onClick={next}
									disabled={!name.trim()}
									className="px-4 py-2 rounded-lg bg-emerald-500 text-white shadow hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed">
									Next
								</button>
							</div>
						</div>
					)}

					{step === 1 && (
						<div className="animate-slide-in">
							<h2 className="text-xl font-bold text-slate-800 mb-4">Age Range</h2>
							<div className="space-y-3">
								{[
									{ label: "13-17", value: "13-17" },
									{ label: "18-24", value: "18-24" },
									{ label: "25-34", value: "25-34" },
									{ label: "35-44", value: "35-44" },
									{ label: "45-54", value: "45-54" },
									{ label: "55-64", value: "55-64" },
									{ label: "65+", value: "65+" },
								].map((opt) => (
									<button
										key={opt.value}
										onClick={() => {
											setAgeRange(opt.value);
											next();
										}}
										className={`w-full text-left px-4 py-3 rounded-xl border shadow-sm transition ${
											ageRange === opt.value ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-300"
										}`}>
										{opt.label}
									</button>
								))}
							</div>
							<div className="mt-6 flex justify-start">
								<button onClick={back} className="px-4 py-2 rounded-lg bg-white border shadow">
									Back
								</button>
							</div>
						</div>
					)}

					{step === 2 && (
						<div className="animate-slide-in">
							<h2 className="text-xl font-bold text-slate-800 mb-4">Gender</h2>
							<div className="grid grid-cols-3 gap-3">
								{[
									{ label: "Male", value: "male" },
									{ label: "Female", value: "female" },
									{ label: "Other", value: "other" },
								].map((opt) => (
									<button
										key={opt.value}
										onClick={() => {
											setGender(opt.value as any);
											next();
										}}
										className={`px-4 py-3 rounded-xl border shadow-sm transition ${
											gender === opt.value ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-300"
										}`}>
										{opt.label}
									</button>
								))}
							</div>
							<div className="mt-6 flex justify-start">
								<button onClick={back} className="px-4 py-2 rounded-lg bg-white border shadow">
									Back
								</button>
							</div>
						</div>
					)}

					{step === 3 && (
						<div className="animate-slide-in">
							<h2 className="text-xl font-bold text-slate-800 mb-4">Energy & Activity</h2>
							<div className="space-y-3">
								{[
									{ label: "I'm on the move most of the day", value: "very_active" },
									{ label: "I balance stationary with some movement", value: "moderately_active" },
									{ label: "I don't move much and want to be more active", value: "lightly_active" },
									{ label: "I have conditions that limit movement", value: "sedentary" },
								].map((opt) => (
									<button
										key={opt.value}
										onClick={() => {
											setActivity(opt.value as any);
											next();
										}}
										className={`w-full text-left px-4 py-3 rounded-xl border shadow-sm transition ${
											activity === opt.value ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-300"
										}`}>
										{opt.label}
									</button>
								))}
							</div>
							<div className="mt-6 flex justify-start">
								<button onClick={back} className="px-4 py-2 rounded-lg bg-white border shadow">
									Back
								</button>
							</div>
						</div>
					)}

					{step === 4 && (
						<div className="animate-slide-in">
							<h2 className="text-xl font-bold text-slate-800 mb-2">Goals & Support Areas</h2>
							<p className="text-slate-600 mb-4">Choose what you'd like help with. We'll start you with tasks.</p>
							<div className="grid grid-cols-2 gap-3">
								{[
									"Be more active",
									"Sleep better",
									"Stay fresh and clean",
									"Build healthy eating habits",
									"Manage stress",
									"Get more organized",
								].map((area) => (
									<button
										key={area}
										onClick={() => toggleSupportArea(area)}
										className={`px-3 py-3 rounded-xl text-sm border shadow-sm transition ${
											supportAreas.includes(area) ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-300"
										}`}>
										{area}
									</button>
								))}
							</div>
							<div className="mt-6 flex justify-between">
								<button onClick={back} className="px-4 py-2 rounded-lg bg-white border shadow">
									Back
								</button>
								<button onClick={createUser} className="px-4 py-2 rounded-lg bg-emerald-600 text-white shadow">
									Finish
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default OnboardingWizard;
