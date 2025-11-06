# 🔥 Firebase Setup Checklist

Complete this checklist to set up Firebase for your booking wizard.

## Step 1: Create Firebase Project

- [ ] Go to [firebase.google.com](https://firebase.google.com)
- [ ] Click "Get Started"
- [ ] Create a new project
- [ ] Name your project (e.g., "Service Booking")
- [ ] Accept terms and create project
- [ ] Wait for project to be created

## Step 2: Create Firestore Database

- [ ] In Firebase Console, click "Firestore Database"
- [ ] Click "Create Database"
- [ ] Select "Start in test mode" (for development)
- [ ] Choose your region (closest to your users)
- [ ] Click "Create"
- [ ] Wait for database to be created

## Step 3: Get Firebase Credentials

- [ ] In Firebase Console, click "Project Settings" (gear icon)
- [ ] Go to "General" tab
- [ ] Scroll down to "Your apps"
- [ ] Click "Web" icon to add a web app
- [ ] Register app with a name (e.g., "Booking Wizard")
- [ ] Copy the Firebase config object
- [ ] Save it somewhere safe

## Step 4: Create Environment File

- [ ] In your project root, create `.env.local` file
- [ ] Add your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

- [ ] Save the file
- [ ] **DO NOT commit this file to version control**

## Step 5: Update Firestore Security Rules

- [ ] In Firebase Console, go to "Firestore Database"
- [ ] Click "Rules" tab
- [ ] Delete all existing rules
- [ ] Copy rules from `FIRESTORE_RULES.txt`
- [ ] Paste into the rules editor
- [ ] Click "Publish"
- [ ] Wait for rules to be published

## Step 6: Create Collections

### Create "branches" Collection
- [ ] In Firestore, click "Create collection"
- [ ] Name it "branches"
- [ ] Click "Auto ID" for document ID
- [ ] Add first document with sample data:
```json
{
  "id": "branch-1",
  "name": "Downtown Branch",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "status": "online",
  "phone": "(555) 123-4567",
  "email": "downtown@example.com"
}
```
- [ ] Click "Save"

### Create "services" Collection
- [ ] Click "Create collection"
- [ ] Name it "services"
- [ ] Click "Auto ID" for document ID
- [ ] Add first document with sample data:
```json
{
  "id": "service-1",
  "name": "Haircut",
  "description": "Professional haircut with styling",
  "duration": 30,
  "price": 45,
  "image": "https://images.unsplash.com/photo-1599351431202-924373718c3e?w=400",
  "branches": ["branch-1"],
  "staffIds": ["staff-1"]
}
```
- [ ] Click "Save"

### Create "staff" Collection
- [ ] Click "Create collection"
- [ ] Name it "staff"
- [ ] Click "Auto ID" for document ID
- [ ] Add first document with sample data:
```json
{
  "id": "staff-1",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 111-1111",
  "profilePhoto": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  "services": ["service-1"],
  "branches": ["branch-1"],
  "workingHours": {
    "Monday": {"start": "09:00", "end": "17:00", "isWorking": true},
    "Tuesday": {"start": "09:00", "end": "17:00", "isWorking": true},
    "Wednesday": {"start": "09:00", "end": "17:00", "isWorking": true},
    "Thursday": {"start": "09:00", "end": "17:00", "isWorking": true},
    "Friday": {"start": "09:00", "end": "17:00", "isWorking": true},
    "Saturday": {"start": "10:00", "end": "14:00", "isWorking": true},
    "Sunday": {"start": "00:00", "end": "00:00", "isWorking": false}
  }
}
```
- [ ] Click "Save"

## Step 7: Test the Connection

- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Check browser console for errors
- [ ] Verify data loads from Firestore
- [ ] Test navigation through all steps

## Step 8: Add More Sample Data (Optional)

- [ ] Add more branches to "branches" collection
- [ ] Add more services to "services" collection
- [ ] Add more staff to "staff" collection
- [ ] Use data from `SAMPLE_DATA.json` for reference

## Step 9: Verify Everything Works

- [ ] Branch selection shows your branches
- [ ] Services filter by selected branch
- [ ] Staff shows for selected service
- [ ] Date/time selection works
- [ ] No console errors
- [ ] Animations are smooth

## Step 10: Production Setup (Later)

- [ ] Update Firestore rules for production
- [ ] Enable authentication
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test thoroughly

## 🆘 Troubleshooting

### "No data showing"
- [ ] Check collections exist in Firestore
- [ ] Verify security rules are published
- [ ] Check browser console for errors
- [ ] Verify `.env.local` has correct credentials

### "Firebase connection error"
- [ ] Verify `.env.local` file exists
- [ ] Check all credentials are correct
- [ ] Ensure Firestore database is created
- [ ] Check Firebase project is active

### "Permission denied" error
- [ ] Go to Firestore Rules
- [ ] Verify rules are published
- [ ] Check rules allow read access
- [ ] Restart development server

### "Collections not found"
- [ ] Create collections manually in Firestore
- [ ] Verify collection names match exactly
- [ ] Add at least one document to each collection

## ✅ Completion Checklist

- [ ] Firebase project created
- [ ] Firestore database created
- [ ] Credentials added to `.env.local`
- [ ] Security rules published
- [ ] Collections created (branches, services, staff)
- [ ] Sample data added
- [ ] Application tested
- [ ] No console errors
- [ ] Data loads correctly
- [ ] Ready for development!

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firestore Data Structure](https://firebase.google.com/docs/firestore/data-model)

## 🎉 You're All Set!

Once you complete this checklist, your booking wizard will be fully functional!

Run `npm run dev` and start booking! 🚀

---

**Need help?** Check `SETUP_GUIDE.md` for detailed instructions.

