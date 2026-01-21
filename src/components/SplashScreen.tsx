import React from "react";

interface SplashScreenProps {
	onCreateCub: () => void;
	onLogin: () => void;
}

// Simple inline SVG polar bear face (placeholder for a more realistic asset)
const PolarBearFace: React.FC<{ className?: string }> = ({ className }) => (
	<svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<circle cx="100" cy="100" r="80" fill="#f8fafc" stroke="#d1d5db" strokeWidth="4" />
		<circle cx="70" cy="90" r="12" fill="#111827" />
		<circle cx="130" cy="90" r="12" fill="#111827" />
		<path d="M85 120 q15 20 30 0" fill="#111827" />
		<ellipse cx="58" cy="58" rx="18" ry="14" fill="#ffffff" stroke="#d1d5db" />
		<ellipse cx="142" cy="58" rx="18" ry="14" fill="#ffffff" stroke="#d1d5db" />
	</svg>
);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onCreateCub, onLogin }) => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-teal-50">
			<div className="w-full max-w-md px-6">
				<div className="flex flex-col items-center text-center mb-8 animate-fade-in">
					<PolarBearFace className="w-28 h-28 drop-shadow-md" />
					<h1 className="mt-4 text-3xl font-extrabold text-slate-800 tracking-tight">Snowball</h1>
					<p className="mt-1 text-slate-600">Your new helpful best friend</p>
				</div>

				<div className="space-y-4">
					<button
						onClick={onCreateCub}
						className="w-full py-3 px-4 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-200">
						Create your new cub
					</button>
					<button
						onClick={onLogin}
						className="w-full py-3 px-4 rounded-xl bg-white text-slate-700 font-semibold shadow-md border border-slate-200 hover:bg-slate-50 transition-all duration-200">
						Log in
					</button>
				</div>

				<div className="mt-8 text-center text-xs text-slate-500">
					Smooth transitions and soft colors for a calm start
				</div>
			</div>
		</div>
	);
};

export default SplashScreen;
