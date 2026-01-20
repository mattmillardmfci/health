import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import type { SupplementStack, Supplement } from "../types";

const supplementDatabase: Record<string, Supplement[]> = {
	essential: [
		{
			id: "1",
			name: "Multivitamin",
			dosage: "1 tablet",
			frequency: "daily",
			purpose: "Cover micronutrient gaps",
			tier: "essential",
			estimatedCost: 0.3,
		},
		{
			id: "2",
			name: "Omega-3 (Fish Oil)",
			dosage: "2000mg EPA/DHA",
			frequency: "daily",
			purpose: "Cardiovascular & joint health",
			tier: "essential",
			estimatedCost: 0.4,
		},
		{
			id: "3",
			name: "Vitamin D3",
			dosage: "2000-4000 IU",
			frequency: "daily",
			purpose: "Bone health, mood, immune",
			tier: "essential",
			estimatedCost: 0.2,
		},
		{
			id: "4",
			name: "Electrolytes (Sodium/Potassium)",
			dosage: "1000mg Na, 500mg K",
			frequency: "daily with water",
			purpose: "Hydration & muscle function",
			tier: "essential",
			estimatedCost: 0.35,
		},
		{
			id: "5",
			name: "Fiber Supplement",
			dosage: "5-10g",
			frequency: "daily",
			purpose: "Digestive health",
			tier: "essential",
			estimatedCost: 0.25,
		},
	],
	recommended: [
		{
			id: "6",
			name: "Creatine Monohydrate",
			dosage: "5g",
			frequency: "daily",
			purpose: "Muscle strength & preservation",
			tier: "recommended",
			estimatedCost: 0.15,
		},
		{
			id: "7",
			name: "Beta-Alanine",
			dosage: "3-5g",
			frequency: "daily",
			purpose: "Endurance & muscle carnosine",
			tier: "recommended",
			estimatedCost: 0.2,
		},
		{
			id: "8",
			name: "Whey Protein Isolate",
			dosage: "25-30g",
			frequency: "as needed",
			purpose: "Protein target achievement",
			tier: "recommended",
			estimatedCost: 0.5,
		},
		{
			id: "9",
			name: "Caffeine",
			dosage: "100-200mg",
			frequency: "pre-workout",
			purpose: "Energy & metabolism",
			tier: "recommended",
			estimatedCost: 0.1,
		},
		{
			id: "10",
			name: "Magnesium Glycinate",
			dosage: "300mg",
			frequency: "evening",
			purpose: "Sleep quality, muscle recovery",
			tier: "recommended",
			estimatedCost: 0.3,
		},
	],
	optional: [
		{
			id: "11",
			name: "L-Carnitine",
			dosage: "2-3g",
			frequency: "daily",
			purpose: "Fat oxidation support",
			tier: "optional",
			estimatedCost: 0.25,
		},
		{
			id: "12",
			name: "NAC (N-Acetyl Cysteine)",
			dosage: "600mg",
			frequency: "daily",
			purpose: "Liver support, antioxidant",
			tier: "optional",
			estimatedCost: 0.35,
		},
		{
			id: "13",
			name: "Taurine",
			dosage: "3-5g",
			frequency: "daily",
			purpose: "Cardiac function, energy",
			tier: "optional",
			estimatedCost: 0.2,
		},
	],
};

export const SupplementStackBuilder: React.FC = () => {
	const { currentUser, updateUser } = useUsers();
	const [showModal, setShowModal] = useState(false);
	const [deficitLevel, setDeficitLevel] = useState<"moderate" | "aggressive" | "extreme">("moderate");
	const [daysStrict, setDaysStrict] = useState("14");
	const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);

	if (!currentUser) return <div className="text-center text-gray-600">Please select a user</div>;

	const stacks = currentUser.supplementStacks || [];
	const currentStack = stacks.length > 0 ? stacks[0] : null;

	const calculateRefeedDue = (daysStrictNum: number) => {
		const future = new Date();
		future.setDate(future.getDate() + daysStrictNum);
		return future;
	};

	const getDeficitDescription = (level: string): string => {
		switch (level) {
			case "moderate":
				return "500-750 cal/day deficit (safe for long-term)";
			case "aggressive":
				return "750-1000 cal/day deficit (4-6 weeks max)";
			case "extreme":
				return "1000+ cal/day deficit (7-14 days max, requires refeed)";
			default:
				return "";
		}
	};

	const getRecommendedSupplements = (level: string): Supplement[] => {
		const allSupps = [
			...supplementDatabase.essential,
			...(level !== "moderate" ? supplementDatabase.recommended : []),
			...(level === "extreme" ? supplementDatabase.optional : []),
		];
		return allSupps;
	};

	const recommendedSupps = getRecommendedSupplements(deficitLevel);
	const totalDailyCost = recommendedSupps.reduce((sum, s) => sum + s.estimatedCost, 0);

	const handleCreateStack = () => {
		const newStack: SupplementStack = {
			id: Date.now().toString(),
			userId: currentUser.id,
			deficitLevel: deficitLevel as any,
			daysStrict: parseInt(daysStrict),
			refeedDue: calculateRefeedDue(parseInt(daysStrict)),
			supplements: recommendedSupps,
			createdDate: new Date(),
		};

		const updated = {
			...currentUser,
			supplementStacks: [newStack, ...(stacks.slice(0, 4) || [])], // Keep last 5
		};
		updateUser(updated);
		setShowModal(false);
		setSelectedSupplements([]);
	};

	const handleDeleteStack = (id: string) => {
		const updated = { ...currentUser, supplementStacks: stacks.filter((s) => s.id !== id) };
		updateUser(updated);
	};

	return (
		<div className="w-full max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-purple-100">
				<h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
					Supplement Stack Builder
				</h2>

				{/* Current Stack */}
				{currentStack && (
					<div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg mb-6 border-2 border-purple-200">
						<div className="flex justify-between items-start mb-4">
							<div>
								<p className="text-sm text-gray-600 font-semibold">Current Stack</p>
								<p className="text-2xl font-bold text-purple-600 mt-1">
									{currentStack.deficitLevel.charAt(0).toUpperCase() + currentStack.deficitLevel.slice(1)} Deficit
								</p>
								<p className="text-sm text-gray-600 mt-2">{getDeficitDescription(currentStack.deficitLevel)}</p>
							</div>
							<button
								onClick={() => handleDeleteStack(currentStack.id)}
								className="text-red-500 hover:text-red-700 font-semibold text-lg">
								✕
							</button>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
							<div>
								<p className="text-xs text-gray-600">Duration</p>
								<p className="text-lg font-bold text-gray-800">{currentStack.daysStrict} days</p>
							</div>
							<div>
								<p className="text-xs text-gray-600">Refeed Due</p>
								<p className="text-lg font-bold text-gray-800">
									{new Date(currentStack.refeedDue).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-xs text-gray-600">Total Supplements</p>
								<p className="text-lg font-bold text-gray-800">{currentStack.supplements.length}</p>
							</div>
							<div>
								<p className="text-xs text-gray-600">Daily Cost</p>
								<p className="text-lg font-bold text-gray-800">
									${currentStack.supplements.reduce((sum, s) => sum + s.estimatedCost, 0).toFixed(2)}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Current Stack Details */}
				{currentStack && (
					<div className="mb-6 space-y-4">
						{["essential", "recommended", "optional"].map((tier) => {
							const tierSupps = currentStack.supplements.filter((s) => s.tier === tier);
							if (tierSupps.length === 0) return null;
							return (
								<div key={tier}>
									<h3 className="font-semibold text-gray-800 mb-2 text-lg">
										{tier === "essential" && "🔴 Essential"}
										{tier === "recommended" && "🟡 Recommended"}
										{tier === "optional" && "🟢 Optional"}
									</h3>
									<div className="space-y-2">
										{tierSupps.map((sup) => (
											<div
												key={sup.id}
												className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start">
												<div className="flex-1">
													<p className="font-semibold text-gray-800">{sup.name}</p>
													<p className="text-sm text-gray-600">{sup.dosage}</p>
													<p className="text-xs text-gray-500 mt-1">{sup.purpose}</p>
													<p className="text-xs text-gray-500">Frequency: {sup.frequency}</p>
												</div>
												<p className="ml-4 text-right">
													<span className="text-sm text-emerald-600 font-semibold">
														${sup.estimatedCost.toFixed(2)}/day
													</span>
												</p>
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Create New Stack Button */}
				<button
					onClick={() => setShowModal(true)}
					className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition mb-6">
					{currentStack ? "Create New Stack" : "Build Your Stack"}
				</button>

				{/* Modal */}
				{showModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-96 overflow-y-auto">
							<h3 className="text-2xl font-bold text-gray-800 mb-4">Build Supplement Stack</h3>

							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-700 mb-2">Deficit Level</label>
								<select
									value={deficitLevel}
									onChange={(e) => setDeficitLevel(e.target.value as any)}
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
									<option value="moderate">Moderate (500-750 cal/day)</option>
									<option value="aggressive">Aggressive (750-1000 cal/day)</option>
									<option value="extreme">Extreme (1000+ cal/day)</option>
								</select>
								<p className="text-xs text-gray-600 mt-2">{getDeficitDescription(deficitLevel)}</p>
							</div>

							<div className="mb-6">
								<label className="block text-sm font-semibold text-gray-700 mb-2">Days on Strict Deficit</label>
								<input
									type="number"
									value={daysStrict}
									onChange={(e) => setDaysStrict(e.target.value)}
									className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
									min="7"
									max="30"
								/>
								<p className="text-xs text-gray-600 mt-2">
									Refeed will be due on {new Date(calculateRefeedDue(parseInt(daysStrict))).toLocaleDateString()}
								</p>
							</div>

							<div className="bg-blue-50 border border-blue-200 p-3 rounded mb-6 text-sm">
								<p className="font-semibold text-blue-900">Stack Summary</p>
								<p className="text-blue-800 text-xs mt-1">{recommendedSupps.length} supplements included</p>
								<p className="text-blue-800 text-xs">Daily cost: ${totalDailyCost.toFixed(2)}</p>
								<p className="text-blue-800 text-xs">30-day cost: ${(totalDailyCost * 30).toFixed(2)}</p>
							</div>

							<div className="flex gap-2">
								<button
									onClick={() => setShowModal(false)}
									className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition">
									Cancel
								</button>
								<button
									onClick={handleCreateStack}
									className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition">
									Create Stack
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Safety Warnings */}
				<div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg mt-6">
					<p className="font-semibold text-red-900 mb-2">⚠️ Important Safety Notes</p>
					<ul className="text-sm text-red-800 space-y-1">
						<li>• Extreme deficits (1000+ cal/day) should NOT exceed 14 days</li>
						<li>• Mandatory refeed at maintenance TDEE every 10-14 days</li>
						<li>• Maintain 1g+ protein per lb bodyweight during cuts</li>
						<li>• Consult physician before starting any supplement regimen</li>
						<li>• Monitor for dizziness, fatigue, or mood changes</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
