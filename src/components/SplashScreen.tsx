import React from "react";
import { SnowballCub } from "./SnowballCub";

interface SplashScreenProps {
	onCreateCub: () => void;
	onLogin: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onCreateCub, onLogin }) => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-cyan-50 to-emerald-50">
			<div className="w-full max-w-md px-6">
				<div className="flex flex-col items-center text-center mb-8 animate-fade-in">
					<SnowballCub stage="cub" className="w-48 h-56 drop-shadow-xl" />
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
