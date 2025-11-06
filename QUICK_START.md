# ⚡ Quick Start Guide

Get your Service Booking Wizard up and running in 5 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
npm install
```

## Step 2: Set Up Firebase (2 minutes)

1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new project
3. Create a Firestore database (start in test mode)
4. Copy your Firebase config from Project Settings

## Step 3: Configure Environment (1 minute)

Create `.env.local` in the root directory:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 4: Update Firestore Rules (1 minute)

1. Go to Firestore → Rules
2. Copy rules from `FIRESTORE_RULES.txt`
3. Click "Publish"

## Step 5: Add Sample Data (Optional)

1. In Firestore, create these collections:
   - `branches`
   - `services`
   - `staff`

2. Use data from `SAMPLE_DATA.json` to populate them

## Step 6: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎉 You're Done!

The booking wizard is now running. You should see:
- Step 1: Branch Selection
- Step 2: Service Selection
- Step 3: Staff Selection
- Step 4: Date & Time Selection

## 📝 Next Steps

1. **Customize Styling**: Edit Tailwind classes in component files
2. **Add Your Data**: Replace sample data with your actual business data
3. **Implement Booking Logic**: Update `BookingWizard.tsx` to save bookings to Firestore
4. **Deploy**: Use Vercel or your preferred hosting platform

## 🆘 Troubleshooting

### "No data showing"
- Check Firestore collections exist
- Verify security rules are published
- Check browser console for errors

### "Firebase connection error"
- Verify `.env.local` has correct credentials
- Check Firebase project is active
- Ensure Firestore database is created

### "Styling looks broken"
- Clear cache: `rm -rf .next`
- Rebuild: `npm run build`

## 📚 Full Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup
- [Firestore Rules](./FIRESTORE_RULES.txt) - Security rules
- [Sample Data](./SAMPLE_DATA.json) - Data structure
- [README](./README.md) - Full documentation

## 🚀 Ready to Deploy?

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
```bash
npm run build
npm start
```

---

**Questions?** Check the full documentation files or review the component code!

