import React from "react";

interface SplashScreenProps {
	onCreateCub: () => void;
	onLogin: () => void;
}

// Animated cartoon polar bear face
const PolarBearFace: React.FC<{ className?: string }> = ({ className }) => (
	<svg className={className} viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<defs>
			<style>{`
				@keyframes bounce {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-15px); }
				}
				@keyframes blink {
					0%, 49%, 100% { cy: 110; ry: 18; }
					50%, 98% { cy: 115; ry: 5; }
				}
				@keyframes wag {
					0%, 100% { transform: rotate(-15deg); }
					50% { transform: rotate(15deg); }
				}
				.bear-body {
					animation: bounce 2s ease-in-out infinite;
				}
				.bear-eye-left {
					animation: blink 3s ease-in-out infinite;
				}
				.bear-eye-right {
					animation: blink 3s ease-in-out infinite 0.1s;
				}
				.bear-ear-left {
					animation: wag 1.5s ease-in-out infinite;
					transform-origin: 65px 30px;
				}
				.bear-ear-right {
					animation: wag 1.5s ease-in-out infinite;
					transform-origin: 175px 30px;
				}
			`}</style>
		</defs>

		{/* Body -->*/}
		<g className="bear-body">
			{/* Main head circle */}
			<circle cx="120" cy="140" r="85" fill="#e8f0f7" stroke="#a0adc4" strokeWidth="3" />

			{/* Ears */}
			<circle cx="65" cy="60" r="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" className="bear-ear-left" />
			<circle cx="175" cy="60" r="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" className="bear-ear-right" />

			{/* Inner ears */}
			<circle cx="65" cy="65" r="16" fill="#c0c8d8" className="bear-ear-left" />
			<circle cx="175" cy="65" r="16" fill="#c0c8d8" className="bear-ear-right" />

			{/* Snout/muzzle */}
			<ellipse cx="120" cy="165" rx="45" ry="50" fill="#f0f5fa" stroke="#a0adc4" strokeWidth="2" />

			{/* Eyes */}
			<circle cx="95" cy="110" r="16" fill="#1a1a2e" />
			<circle cx="145" cy="110" r="16" fill="#1a1a2e" />

			{/* Eye shine/sparkle */}
			<circle cx="98" cy="107" r="6" fill="#ffffff" opacity="0.8" />
			<circle cx="148" cy="107" r="6" fill="#ffffff" opacity="0.8" />

			{/* Nose */}
			<ellipse cx="120" cy="145" rx="12" ry="15" fill="#1a1a2e" />

			{/* Smile/mouth */}
			<path d="M 120 155 Q 115 165 110 163" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
			<path d="M 120 155 Q 125 165 130 163" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />

			{/* Cheeks - pink blush */}
			<ellipse cx="65" cy="140" rx="18" ry="22" fill="#ffc0cb" opacity="0.4" />
			<ellipse cx="175" cy="140" rx="18" ry="22" fill="#ffc0cb" opacity="0.4" />

			{/* Front paws */}
			<ellipse cx="85" cy="220" rx="20" ry="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" />
			<ellipse cx="155" cy="220" rx="20" ry="28" fill="#d4dce8" stroke="#8b93a8" strokeWidth="2" />

			{/* Paw pads */}
			<circle cx="85" cy="245" r="8" fill="#1a1a2e" />
			<circle cx="155" cy="245" r="8" fill="#1a1a2e" />

			{/* Belly spot */}
			<ellipse cx="120" cy="180" rx="35" ry="40" fill="#ffffff" opacity="0.6" />
		</g>
	</svg>
);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onCreateCub, onLogin }) => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-cyan-50 to-emerald-50">
			<div className="w-full max-w-md px-6">
				<div className="flex flex-col items-center text-center mb-8 animate-fade-in">
					<PolarBearFace className="w-48 h-56 drop-shadow-xl" />
					<h1 className="mt-6 text-4xl font-extrabold text-slate-800 tracking-tight">Snowball</h1>
					<p className="mt-2 text-lg text-slate-600">Your new helpful best friend</p>
				</div>

				<div className="space-y-4">
					<button
						onClick={onCreateCub}
						className="w-full py-3 px-4 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-200 transform hover:scale-105 active:scale-95">
						Create your new cub
					</button>
					<button
						onClick={onLogin}
						className="w-full py-3 px-4 rounded-xl bg-white text-slate-700 font-semibold shadow-md border border-slate-200 hover:bg-slate-50 transition-all duration-200 transform hover:scale-105 active:scale-95">
						Log in
					</button>
				</div>

				<div className="mt-8 text-center text-xs text-slate-500">Meet your new self-care companion</div>
			</div>
		</div>
	);
};

export default SplashScreen;
