# Quick Reference - New Features

## 🔐 LoginScreen

### File Location

`src/components/LoginScreen.tsx`

### When It Appears

- On first app open
- When all users are deleted
- After logging out of cloud sync

### Two Modes

#### 1. Quick Start (Local)

- **Speed**: Instant ✨
- **Data**: Stored locally on device
- **Setup**: None
- **Sync**: No (use cloud sync instead)
- **Use Case**: Quick testing, single device

#### 2. Cloud Sync

- **Speed**: 1 second to sign up
- **Data**: Synced to Firebase
- **Setup**: Need Firebase project
- **Sync**: Yes! Works on all devices
- **Use Case**: Production, multi-device

### Code Usage

```tsx
import { LoginScreen } from "./components/LoginScreen";

<LoginScreen onLoginSuccess={() => setView("home")} />;
```

---

## 🍔 USDA FoodData Central API

### File Location

`src/utils/usdaFoodApi.ts`

### Functions

#### Search Foods

```typescript
const results = await searchUSDAFoods("hamburger");
// Returns: Array of ~10 matching foods with FDC ID
```

#### Get Nutrition Details

```typescript
const food = await getUSDAFoodDetails("fdcId_here", 100);
// Returns: {
//   name: "Hamburger, NFS",
//   serving: "100g",
//   calories: 180,
//   protein: 24.5,
//   carbs: 0,
//   fat: 8.5
// }
```

#### Batch Search

```typescript
const foods = await searchFoodWithServings("chicken", 5);
// Returns: Array of 5 foods with full nutrition details
```

### Configuration

#### Using Demo Key (Testing)

```typescript
// Current setup - works for testing with limited requests
const USDA_API_KEY = "DEMO_KEY";
```

#### Using Real Key (Production)

```typescript
// 1. Sign up: https://fdc.nal.usda.gov/api-key-signup
// 2. Copy your key
// 3. Replace in src/utils/usdaFoodApi.ts:

const USDA_API_KEY = "paste-your-key-here";
```

### Rate Limits

- Demo Key: 50 requests/hour
- Real Key: 1,000 requests/hour (free!)

### Error Handling

- Gracefully falls back to local database if API unavailable
- Errors logged to console but don't break app
- User sees "USDA database offline" notice

---

## 🍽️ Enhanced Foods Database

### New Items in `src/data/foods.ts`

#### Meat Section

```typescript
{
  id: "hamburger-patty-4oz",
  name: "Hamburger Patty 93% (4 oz)",
  category: "meat",
  serving: "4 oz",
  servingGrams: 113,
  calories: 180,
  protein: 24,
  carbs: 0,
  fat: 8.5,
},
```

#### Grains Section

```typescript
{
  id: "hamburger-bun",
  name: "Hamburger Bun (1)",
  category: "grain",
  serving: "1 bun",
  servingGrams: 43,
  calories: 120,
  protein: 4,
  carbs: 21,
  fat: 2,
},
```

### Adding More Foods

Edit `src/data/foods.ts`, add to appropriate category array:

- `meatFoods` - Proteins (chicken, beef, fish, etc.)
- `vegetableFoods` - Vegetables
- `fruitFoods` - Fruits
- `dairyFoods` - Milk, cheese, yogurt
- `grainFoods` - Bread, rice, pasta
- `condimentFoods` - Sauces, oils
- `processedFoods` - Prepared meals

---

## 🔍 MealLogger Updates

### File Location

`src/components/MealLogger.tsx`

### New Features

#### 1. Dual Search

- **Local Database** (📚) - Pre-configured foods
- **USDA Results** (🔍) - Real-time government data

#### 2. Auto-Search

- Types trigger USDA search after 500ms (debounced)
- Shows results from both sources simultaneously
- Loading state while fetching

#### 3. Selection

- Click any result (local or USDA)
- Nutrients auto-populated
- Adjust serving multiplier as needed

### Code Changes

```typescript
// New imports
import { searchUSDAFoods, getUSDAFoodDetails } from "../utils/usdaFoodApi";

// New state
const [usedaResults, setUSDAResults] = useState<any[]>([]);
const [usdaLoading, setUSDALoading] = useState(false);
const [showUSDAResults, setShowUSDAResults] = useState(false);

// New handler
const handleSelectUSDAFood = async (fdcId: string) => {
	const details = await getUSDAFoodDetails(fdcId, 100);
	// ... populate food data
};
```

### User Flow

```
Type "chicken" in search
        ↓
Local results appear (📚 database)
        ↓
Wait 500ms (debounce)
        ↓
USDA search completes (🔍 results)
        ↓
User sees ~20 options total
        ↓
Clicks one → Gets exact macros
        ↓
Logs meal with accurate data
```

---

## 🚀 Deployment Checklist

- [ ] Test LoginScreen on mobile
- [ ] Test USDA API with real foods
- [ ] Configure Firebase (optional)
- [ ] Add USDA API key (optional but recommended)
- [ ] Test cloud sync end-to-end
- [ ] Run `npm run build`
- [ ] Deploy `dist/` folder
- [ ] Test on production URL

---

## 📚 Resources

- **USDA FoodData Central**: https://fdc.nal.usda.gov/
- **Get Free API Key**: https://fdc.nal.usda.gov/api-key-signup
- **API Documentation**: https://fdc.nal.usda.gov/api-guide
- **Firebase Setup**: See FIREBASE_SETUP.md
- **Project Updates**: See UPDATES.md

---

## 🐛 Troubleshooting

### LoginScreen not showing

- Check `src/App.tsx` line 59-66
- Verify `if (!currentUser) return <LoginScreen ... />`
- Clear localStorage: `localStorage.clear()`

### USDA search shows nothing

- Check DEMO_KEY has requests left
- Try with real API key
- Verify internet connection
- Check browser console for errors

### Hamburger macros still wrong

- Make sure you're selecting "Hamburger Patty" separately
- Add "Hamburger Bun" as second item
- Don't use old "Hamburger (1)" entry

### Cloud sync not working

- Follow FIREBASE_SETUP.md completely
- Verify Firebase project is created
- Check API key in `src/utils/firebase.ts`
- Use same email/password on both devices

---

**Last Updated**: January 20, 2026
