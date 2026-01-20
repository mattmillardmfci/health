# LifeCoach Pro - Personal Life & Nutrition Webapp

A modern, scientific React + TypeScript webapp designed as both a website and mobile app for personal life coaching and advanced nutrition planning. Built with Tailwind CSS and Vite for maximum performance.

## Features

### 🎯 Multi-User Support

- Create and manage multiple user profiles
- Support for Matt, Rachelle, Laura, Chance, and any other users
- Gender-aware calculations (optimized for males and females)
- Local storage persistence across sessions

### 📊 Scientific Nutrition Calculations

- **BMR Calculation**: Mifflin-St Jeor equation (most accurate for modern populations)
- **TDEE Calculation**: Activity-level adjusted total daily energy expenditure
- **Macro Targeting**: Intelligent protein-first approach for muscle preservation
- **Caloric Deficit Planning**: Science-based weight loss targets (0.5-3+ lbs/week)

### 🏋️ Extreme Dieting Support (Harm Reduction Focused)

This app is built for **realistic scenarios** where users will attempt extreme diets. Instead of judgment, we provide:

- **Supplement Recommendations**: Critical micronutrients for extreme cuts (boiled chicken only, etc.)
  - Multivitamins, electrolytes, Vitamin D3, Omega-3s, Fiber
  - Performance supplements for energy/preservation (Creatine, Beta-Alanine, etc.)
- **Refeed Scheduling**: Scientifically-timed refeeds to reset hormones
  - After 10-14 days of extreme cutting
  - Maintenance calories + high carbs + maintained protein
- **Meal Structure Guidance**: Realistic eating protocols
  - Boiled chicken + vegetable approaches
  - Meal timing and frequency recommendations
- **Health Monitoring Alerts**: When to know you're going too hard
  - Deficit percentage warnings
  - Performance loss tracking
  - Fatigue and hormonal health indicators

### 💪 Personalized Coaching

- Goal-specific advice (lose 2 lbs/week, lose 10 lbs/month healthy, etc.)
- Realistic assessment of extreme goals
- Evidence-based supplement stacks
- Monitoring and adjustment protocols

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS 4 (PostCSS v4 compatible)
- **Build Tool**: Vite 7 (ultra-fast development)
- **State Management**: React Context API + localStorage
- **Development**: Hot Module Replacement (HMR) for instant updates

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Start Development Server**

```bash
npm run dev
```

The app will open at `http://localhost:5173/`

3. **Build for Production**

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── UserProfileForm.tsx    # User creation/editing
│   └── NutritionResults.tsx   # Results display & coaching
├── context/             # React Context
│   └── UserContext.tsx        # Multi-user management
├── hooks/               # Custom React hooks
│   └── useUsers.ts           # User context hook
├── types/               # TypeScript definitions
│   └── index.ts              # User, Nutrition, Coaching types
├── utils/               # Utility functions
│   ├── nutritionCalculations.ts  # BMR, TDEE, Macro math
│   └── coachingEngine.ts          # Advice generation
├── App.tsx              # Main app component
├── index.css            # Tailwind directives
└── main.tsx             # React entry point
```

## Key Formulas & Science

### BMR - Mifflin-St Jeor Equation

**Males**: 10(kg) + 6.25(cm) - 5(age) + 5  
**Females**: 10(kg) + 6.25(cm) - 5(age) - 161

### TDEE Multipliers (by activity level)

- Sedentary: 1.2x BMR
- Lightly Active: 1.375x BMR
- Moderately Active: 1.55x BMR
- Very Active: 1.725x BMR
- Extremely Active: 1.9x BMR

### Caloric Deficit

1 lb of body fat ≈ 3,500 calories  
Weekly target (lbs) × 3,500 ÷ 7 = daily deficit

### Macro Targets (for weight loss)

- **Protein**: 0.8-1.2g per lb (preserve muscle)
- **Fat**: 0.3g per lb minimum (hormonal health)
- **Carbs**: Remaining calories (flexible)

## Coaching Philosophy

We understand that some users will pursue extreme dieting goals. Rather than pretending this doesn't happen, we:

1. **Acknowledge Reality**: People DO eat boiled chicken for weeks
2. **Prioritize Safety**: Supplement recommendations focus on micronutrient/hormonal preservation
3. **Provide Science**: Evidence-based guidance on refeeds, monitoring, and adjustments
4. **Enable Harm Reduction**: Make dangerous choices as healthy as possible

This isn't enabling recklessness—it's accepting that people will do these things anyway and providing expert guidance to minimize health damage.

## Features in Development

- [ ] Workout tracking integration
- [ ] Meal logging and tracking
- [ ] Weekly progress analytics
- [ ] Photo progress tracking
- [ ] Mobile app (React Native)
- [ ] Cloud sync for multi-device
- [ ] Advanced supplement database
- [ ] Food database integration (USDA)
- [ ] Community challenges
- [ ] Expert coach marketplace

## User Profiles

The app supports multiple user types with gender-aware calculations:

| Name     | Gender | Notes                        |
| -------- | ------ | ---------------------------- |
| Matt     | Male   | Primary test user            |
| Rachelle | Female | Female-specific calculations |
| Laura    | Female | Female-specific calculations |
| Chance   | Male   | Male-specific calculations   |

## Configuration

### Tailwind CSS

Configuration in `tailwind.config.js` - customize colors, fonts, and breakpoints

### PostCSS

Uses Tailwind CSS v4 with `@tailwindcss/postcss` plugin (configured in `postcss.config.js`)

## Troubleshooting

### Dev server not starting

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### CSS not loading

Ensure `@tailwindcss/postcss` is installed:

```bash
npm install -D @tailwindcss/postcss
```

### Build errors

Check TypeScript errors:

```bash
npm run build
```

## License

Private project - not for redistribution

## Support

For questions about calculations, supplementation, or coaching protocols, refer to the scientific sources cited in the code comments.

---

**Built with ❤️ for serious fitness enthusiasts who demand science-based guidance**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			// Other configs...

			// Remove tseslint.configs.recommended and replace with this
			tseslint.configs.recommendedTypeChecked,
			// Alternatively, use this for stricter rules
			tseslint.configs.strictTypeChecked,
			// Optionally, add this for stylistic rules
			tseslint.configs.stylisticTypeChecked,

			// Other configs...
		],
		languageOptions: {
			parserOptions: {
				project: ["./tsconfig.node.json", "./tsconfig.app.json"],
				tsconfigRootDir: import.meta.dirname,
			},
			// other options...
		},
	},
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			// Other configs...
			// Enable lint rules for React
			reactX.configs["recommended-typescript"],
			// Enable lint rules for React DOM
			reactDom.configs.recommended,
		],
		languageOptions: {
			parserOptions: {
				project: ["./tsconfig.node.json", "./tsconfig.app.json"],
				tsconfigRootDir: import.meta.dirname,
			},
			// other options...
		},
	},
]);
```
