# Snowball - Project Instructions

## Project Overview

Snowball is a scientific React + TypeScript webapp for personal life coaching and nutrition planning. It supports multiple users with gender-aware BMR/TDEE/macro calculations, provides harm-reduction focused guidance for extreme dieting scenarios, and features a Polar Bear companion that grows as you complete tasks and logging.

## Technology Stack

- React 18 + TypeScript
- Tailwind CSS 4 with `@tailwindcss/postcss`
- Vite 7 with HMR
- React Context API for state management
- localStorage for persistence

## Key Features

1. **Multi-user support** - Matt, Rachelle, Laura, Chance and custom users
2. **Scientific calculations** - Mifflin-St Jeor BMR, TDEE with activity multipliers
3. **Macro planning** - Protein-first approach for weight loss
4. **Extreme cutting support** - Supplement stacks, refeed scheduling, harm reduction
5. **Gamification with Polar Bear Companion**:
   - Level up your polar bear by completing tasks
   - Track daily checkpoints and streaks
   - Companion evolves through stages (cub → juvenile → adolescent → adult)
6. **Persistent Task System**:
   - Morning routines auto-reset daily
   - Anytime task progression chains (e.g., "Do 10 pushups" → "Do 20 pushups")
   - Daily checkpoint showing today's progress
   - Task-based quests that unlock bigger rewards
7. **Responsive design** - Works as website and mobile app

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── UserProfileForm.tsx      - User creation/editing
│   └── NutritionResults.tsx     - Results and coaching
├── context/
│   └── UserContext.tsx          - Multi-user state
├── hooks/
│   └── useUsers.ts              - User context hook
├── types/
│   └── index.ts                 - TypeScript definitions
├── utils/
│   ├── nutritionCalculations.ts - BMR/TDEE/macro math
│   ├── coachingEngine.ts        - Coaching advice generation
│   └── taskUtils.ts             - Task XP and quest logic
├── App.tsx                       - Main app
├── index.css                     - Tailwind directives
└── main.tsx                      - Entry point
```

## Task System Architecture

### Persistent Tasks

Tasks support recurring functionality (auto-resets daily):

- **Morning Routines**: Reset each day, track daily completion streaks
- **Anytime Tasks**: Can be added anytime, progress tracked per day
- **Task Properties**:
  - `isRecurring`: Whether task repeats daily
  - `progressionValue`: Starting rep count for chains (e.g., 10 for "Do 10 pushups")
  - `completedDate`: Last date task was marked complete
  - `dailyStreak`: Consecutive days completed
  - `reward`: XP awarded to companion (base 10, +5 per progression step)

### Progression Task Chains

When a task with `progressionValue` is completed, a new task is automatically created:

- **Example**: Complete "Do 10 pushups" → Creates "Do 20 pushups (10/20)" next
- **Bonus XP**: Progression tasks award +5 XP above base reward
- **Chain ID**: Tracks parent task for progression context

### Daily Checkpoint

Tasks show daily progress:

- "Morning Routines: 3 of 5 completed today"
- "Anytime Tasks: 2 of 8 completed today"
- Auto-resets at midnight based on `completedDate`

### Task-Based Quests

Three types of task quests track companion progression:

1. **Morning Champion** (Daily)
   - Complete 5 morning routine tasks
   - Reward: 50 points, 75 XP
   - Expires: Tomorrow at midnight

2. **Progressive Warrior** (Weekly)
   - Complete a progression chain (3 steps: 10→20→40)
   - Reward: 100 points, 150 XP
   - Expires: 7 days

3. **Task Master** (Daily)
   - Complete 10 anytime tasks
   - Reward: 75 points, 120 XP
   - Expires: Tomorrow at midnight

### Companion XP System

- Tasks award XP directly to companion on completion
- Base reward: 10 XP + task's reward value
- Progression bonus: +5 XP extra per chain step
- Level-up formula: 100 × current_level XP needed
- Evolution: Unlocks at levels 5 (juvenile), 10 (adolescent), 20 (adult)

### Task Utility Functions

**awardXpToCompanion(companion, xpAmount)**

- Adds XP and checks for level-ups
- Auto-promotes companion stage at thresholds
- Caps happiness at 100, increases by 5 per task

**checkTaskQuests(user, completedTaskId, newTaskCreated)**

- Evaluates task-chain quests
- Counts daily task completions by category
- Detects progression chains automatically
- Returns updated quests and completed IDs

**generateTaskQuests(userId)**

- Creates initial 3 task-based quests
- Sets up proper expiration dates
- Uses current user's timezone

## Scientific Basis

### BMR Calculation

Uses Mifflin-St Jeor equation (most accurate for modern populations):

- Males: 10(kg) + 6.25(cm) - 5(age) + 5
- Females: 10(kg) + 6.25(cm) - 5(age) - 161

### TDEE Calculation

Multiplies BMR by activity level:

- Sedentary: 1.2x | Lightly Active: 1.375x | Moderately Active: 1.55x
- Very Active: 1.725x | Extremely Active: 1.9x

### Macro Targeting

For weight loss, uses:

- Protein: 0.8-1.2g per lb (preserve muscle)
- Fat: minimum 0.3g per lb (hormonal health)
- Carbs: remaining calories (flexible)

### Caloric Deficit

Based on 1 lb fat = 3,500 calories:

- Weekly target × 3,500 ÷ 7 = daily deficit

## Important Notes

### Extreme Dieting Philosophy

The app takes a **harm reduction approach** to extreme dieting. It:

- Acknowledges that users WILL attempt extreme diets
- Provides scientific supplement recommendations
- Offers evidence-based refeed schedules
- Monitors for dangerous deficit levels
- Does NOT enable recklessness, but minimizes damage

### Supplement Recommendations

For extreme cuts (boiled chicken only, etc.):

- Multivitamin (daily micronutrients)
- Electrolytes (sodium/potassium/magnesium)
- Vitamin D3, Omega-3s, Fiber
- Performance supports (Creatine, Beta-Alanine)

### Refeed Scheduling

After 10-14 days of extreme cutting:

- Increase calories to maintenance TDEE
- Maintain protein (1g+ per lb)
- Add carbs back (2-3g per lb)
- Resets leptin, improves hormonal health

## Configuration Files

### tailwind.config.js

Standard Tailwind config with content paths configured for React/TypeScript files.

### postcss.config.js

Uses `@tailwindcss/postcss` (Tailwind v4 compatible). Must have:

```javascript
export default {
	plugins: {
		"@tailwindcss/postcss": {},
	},
};
```

### vite.config.ts

Standard Vite React config with React plugin enabled.

## State Management

Uses React Context API with localStorage:

- `UserContext` manages users array and current user
- Auto-saves to localStorage
- Auto-loads on app start
- Accessible via `useUsers()` custom hook

## Testing Locally

1. Create a new user (e.g., "Matt", Male, 180 lbs, 5'10")
2. Set activity level (e.g., "Moderately Active")
3. Set weight loss goal (e.g., "1.5 lbs/week")
4. View calculations and coaching advice
5. Switch between users with dropdown

## Next Steps for Enhancement

- Integrate meal logging with nutritional database
- Add workout tracking
- Implement progress photo tracking
- Create advanced analytics/charts
- Build mobile app version (React Native)
- Add cloud sync
- Expand supplement database
- Community features and challenges

## Important Implementation Details

### Type Safety

All components use TypeScript with proper types. Check `src/types/index.ts` for definitions.

### Performance

- Uses functional components with hooks
- Context API avoids prop drilling
- Tailwind purges unused CSS
- Vite handles fast HMR

### Accessibility

- Semantic HTML structure
- Proper form labels
- Contrast ratios meet WCAG standards
- Keyboard navigation supported

## Deployment

### Production Build

```bash
npm run build
```

Outputs optimized bundle to `dist/` directory.

### Hosting Options

- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Your own server

The app is static after build - no backend required.

## Troubleshooting

### Dev server not starting

```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

### CSS not applying

Verify `@tailwindcss/postcss` is installed and `postcss.config.js` is correct.

### Build fails

Run `npm run build` to see full error output.

### TypeScript errors

Check files in `src/types/index.ts` - ensure all component props match interfaces.

## Architecture Decisions

1. **React Context** - Sufficient for multi-user state, avoids Redux complexity
2. **localStorage** - Enables offline-first approach, persistence across sessions
3. **Tailwind CSS** - Rapid UI development, consistent styling
4. **Vite** - Lightning fast development, modern build tooling
5. **TypeScript** - Type safety for calculations-heavy codebase

## Code Style

- Use functional components and hooks
- Prefer composition over inheritance
- Keep calculations in utils, UI in components
- Use descriptive variable names
- Add comments to complex formulas

## Git Workflow

1. Feature branch from `main`
2. Make changes and test locally
3. Commit with descriptive messages
4. Push and create PR
5. Merge after review

## Resources

- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org)

---

**Last Updated**: January 20, 2026  
**Maintained By**: Development Team
