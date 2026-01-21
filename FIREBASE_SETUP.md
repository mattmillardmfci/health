# Firebase Setup Guide for Snowball

To enable cloud synchronization and cross-device user profiles, you need to set up a Firebase project. Follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "Snowball")
4. Follow the setup wizard, accept defaults

## 2. Enable Realtime Database

1. In Firebase Console, go to **Build → Realtime Database**
2. Click **Create Database**
3. Choose region (select one closest to your users)
4. Start in **Test mode** (we'll secure it later)
5. Click **Enable**

## 3. Enable Authentication

1. Go to **Build → Authentication**
2. Click **Get Started**
3. Click **Email/Password** provider
4. Toggle "Enable" → Enable password creation → **Save**

## 4. Get Your Firebase Config

1. In Firebase Console, click the gear icon (⚙️) → **Project settings**
2. Under "Your apps", click **Web** icon (looks like `</>`), or add if not present
3. Copy your Firebase config object that looks like:

```javascript
const firebaseConfig = {
	apiKey: "YOUR_API_KEY",
	authDomain: "your-project.firebaseapp.com",
	projectId: "your-project-id",
	storageBucket: "your-project.appspot.com",
	messagingSenderId: "123456789",
	appId: "1:123456789:web:abc123def456",
};
```

## 5. Update Firebase Config in App

1. Open `src/utils/firebase.ts`
2. Replace the `firebaseConfig` object with your real config:

```typescript
const firebaseConfig = {
	apiKey: "YOUR_API_KEY",
	authDomain: "your-project.firebaseapp.com",
	projectId: "your-project-id",
	storageBucket: "your-project.appspot.com",
	messagingSenderId: "123456789",
	appId: "1:123456789:web:abc123def456",
};
```

3. Save the file
4. Restart dev server (`npm run dev`)

## 6. Test Cloud Sync

1. Open the app at http://localhost:5173
2. Click **☁️ Cloud** button (top nav on desktop, or in mobile menu)
3. Go to **Account** tab
4. Click **Create Account**
5. Enter email and password → **Sign Up**
6. Once logged in, you should see "Cloud Sync: Enabled"
7. Create or edit a user profile - it will sync to Firebase
8. Open the app in a private/incognito window, log in with same account
9. Same user profiles should appear!

## 7. Secure Your Database (After Testing)

Once you've verified sync works, secure your database:

### Security Rules for Realtime Database

1. In Firebase Console → **Realtime Database** → **Rules** tab
2. Replace with these rules:

```json
{
	"rules": {
		"users": {
			"$uid": {
				".read": "$uid === auth.uid",
				".write": "$uid === auth.uid"
			}
		}
	}
}
```

3. Click **Publish**

This ensures users can only read/write their own data.

## 8. Deployment

Once everything works:

1. Run `npm run build`
2. Deploy `dist/` folder to your host (Vercel, Netlify, etc.)
3. Firebase credentials in `firebase.ts` are safe to commit (they're public API keys)

## Features Now Enabled

✅ **Cloud User Profiles** - Create accounts and sync profiles across devices  
✅ **Cross-Device Sync** - Use same account on desktop and mobile, data syncs in real-time  
✅ **Persistent Tasks** - Morning routine tasks sync to cloud and persist across sessions  
✅ **Persistent Companion** - Polar bear XP, levels, and happiness persist to cloud  
✅ **Persistent Quests** - Quest progress syncs across devices  
✅ **Persistent Meals** - Meal logging syncs to cloud  
✅ **Persistent Activities** - Activity tracking syncs  
✅ **Persistent Journal** - Journal entries saved to cloud

## Troubleshooting

### "Firebase is not initialized" error

- Check that firebaseConfig values are correct in `src/utils/firebase.ts`
- Verify Realtime Database is enabled in Firebase Console

### Cloud Sync shows "Offline"

- Check browser console for errors (F12)
- Verify Firebase credentials are correct
- Check internet connection
- Verify Realtime Database is enabled and in test mode (or rules are correct)

### Data not syncing

- Make sure you're logged in (Cloud Sync tab should show email)
- Check browser DevTools → Network tab for Firebase requests
- Verify user is the same on both devices/browsers

### App still works offline

- This is intentional! localStorage is primary storage
- Cloud sync is optional and graceful degradation is built in
- If Firebase is unavailable, app continues to work with just localStorage

## Optional: Enable Analytics

To track app usage:

1. Firebase Console → **Analytics**
2. Enable Google Analytics
3. Analytics events auto-capture user interactions

## Optional: Setup Hosting

To deploy with Firebase Hosting:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`
3. Set public directory to `dist`
4. Run `npm run build && firebase deploy`
5. App hosted at `your-project.firebaseapp.com`

---

**Need help?** Check:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
