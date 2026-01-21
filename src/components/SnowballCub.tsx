import React from "react";

export type SnowballCubStage = "cub" | "juvenile" | "adolescent" | "adult";
export type SnowballCubMood = "idle" | "happy" | "sad" | "hungry" | "sleeping";

const stageToSize: Record<SnowballCubStage, number> = {
	cub: 120,
	juvenile: 150,
	adolescent: 180,
	adult: 210,
};

export const SnowballCub: React.FC<{
	stage?: SnowballCubStage;
	mood?: SnowballCubMood;
	size?: number;
	className?: string;
}> = ({ stage = "cub", mood = "idle", size, className }) => {
	const finalSize = size ?? stageToSize[stage];

	const mouthPath = (() => {
		switch (mood) {
			case "happy":
				return "M 92 114 Q 100 122 108 114";
			case "sad":
				return "M 92 120 Q 100 112 108 120";
			case "hungry":
				return "M 92 116 Q 100 126 108 116";
			case "sleeping":
				return "M 92 118 Q 100 118 108 118";
			default:
				return "M 92 116 Q 100 120 108 116";
		}
	})();

	const showBlush = mood === "happy";

	return (
		<svg
			width={finalSize}
			height={finalSize}
			viewBox="0 0 200 200"
			className={className ?? "drop-shadow-lg"}
			role="img"
			aria-label="Snowball the polar bear cub">
			{/*
				Color strategy:
				- Use Tailwind classes inside SVG + currentColor
				- Avoid hard-coded hex colors
			*/}

			{/* Gentle float */}
			<g>
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0 0; 0 2; 0 0"
					dur="2.8s"
					repeatCount="indefinite"
				/>

				{/* Shadow */}
				<g className="text-slate-300" opacity="0.35">
					<ellipse cx="100" cy="168" rx="52" ry="12" fill="currentColor" />
				</g>

				{/* Body */}
				<g className="text-white">
					<path
						d="M 60 130 C 58 106 72 88 100 88 C 128 88 142 106 140 130 C 138 154 124 166 100 168 C 76 166 62 154 60 130 Z"
						fill="currentColor"
					/>
				</g>

				{/* Body shading */}
				<g className="text-slate-200" opacity="0.65">
					<path
						d="M 112 94 C 128 98 138 112 138 130 C 136 150 124 160 112 164 C 132 150 132 110 112 94 Z"
						fill="currentColor"
					/>
				</g>

				{/* Head */}
				<g className="text-white">
					<circle cx="100" cy="86" r="42" fill="currentColor" />
				</g>

				{/* Head shading */}
				<g className="text-slate-200" opacity="0.55">
					<path
						d="M 114 50 C 134 58 146 76 146 96 C 146 108 142 120 134 128 C 146 110 146 76 114 50 Z"
						fill="currentColor"
					/>
				</g>

				{/* Ears */}
				<g>
					<g className="text-white">
						<circle cx="68" cy="52" r="16" fill="currentColor" />
						<circle cx="132" cy="52" r="16" fill="currentColor" />
					</g>
					<g className="text-slate-200" opacity="0.7">
						<circle cx="70" cy="54" r="8" fill="currentColor" />
						<circle cx="130" cy="54" r="8" fill="currentColor" />
					</g>
				</g>

				{/* Snout */}
				<g className="text-slate-100">
					<path
						d="M 72 102 C 78 90 90 84 100 84 C 110 84 122 90 128 102 C 130 118 120 128 100 130 C 80 128 70 118 72 102 Z"
						fill="currentColor"
					/>
				</g>

				{/* Nose + mouth */}
				<g className="text-slate-900">
					<path d="M 94 104 Q 100 98 106 104 Q 100 112 94 104 Z" fill="currentColor" />
					<path d={mouthPath} stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
				</g>

				{/* Cheeks (only on happy) */}
				{showBlush && (
					<g className="text-rose-200" opacity="0.9">
						<circle cx="66" cy="104" r="7" fill="currentColor" />
						<circle cx="134" cy="104" r="7" fill="currentColor" />
					</g>
				)}

				{/* Eyes */}
				<g className="text-slate-900">
					{mood === "sleeping" ? (
						<>
							<path d="M 76 84 Q 84 90 92 84" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
							<path
								d="M 108 84 Q 116 90 124 84"
								stroke="currentColor"
								strokeWidth="5"
								strokeLinecap="round"
								fill="none"
							/>
						</>
					) : (
						<>
							<g>
								<ellipse id="eyeL" cx="82" cy="82" rx="6" ry="8" fill="currentColor" />
								<animate
									xlinkHref="#eyeL"
									attributeName="ry"
									values="8;8;1;8;8"
									keyTimes="0;0.43;0.5;0.57;1"
									dur="4.2s"
									repeatCount="indefinite"
								/>
							</g>
							<g>
								<ellipse id="eyeR" cx="118" cy="82" rx="6" ry="8" fill="currentColor" />
								<animate
									xlinkHref="#eyeR"
									attributeName="ry"
									values="8;8;1;8;8"
									keyTimes="0;0.46;0.53;0.6;1"
									dur="4.2s"
									repeatCount="indefinite"
								/>
							</g>
							<g className="text-white" opacity="0.9">
								<circle cx="84" cy="78" r="2" fill="currentColor" />
								<circle cx="120" cy="78" r="2" fill="currentColor" />
							</g>
						</>
					)}
				</g>

				{/* Tiny "Z" when sleeping */}
				{mood === "sleeping" && (
					<g className="text-slate-700" opacity="0.65">
						<path
							d="M 138 52 L 156 52 L 140 72 L 158 72"
							stroke="currentColor"
							strokeWidth="4"
							strokeLinecap="round"
							fill="none"
						/>
						<animateTransform
							attributeName="transform"
							type="translate"
							values="0 0; 0 -6; 0 0"
							dur="2.2s"
							repeatCount="indefinite"
						/>
					</g>
				)}
			</g>
		</svg>
	);
};
