# Service Booking Wizard - Setup Guide

## Project Overview

This is a modern, sleek multi-step service booking wizard built with Next.js, Tailwind CSS, and Framer Motion. It provides a smooth user experience for booking services with 4 main steps:

1. **Branch Selection** - Choose a service location
2. **Service Selection** - Pick the service you want
3. **Staff Selection** - Choose your preferred staff member
4. **Date & Time Selection** - Pick your appointment date and time

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase Firestore
- **Language**: TypeScript

## Project Structure

```
app/
├── components/
│   ├── booking/
│   │   ├── BookingWizard.tsx          # Main wizard component
│   │   ├── Step1BranchSelection.tsx   # Branch selection step
│   │   ├── Step2ServiceSelection.tsx  # Service selection step
│   │   ├── Step3StaffSelection.tsx    # Staff selection step
│   │   └── Step4DateTimeSelection.tsx # Date/time selection step
│   └── ui/
│       ├── Button.tsx                 # Reusable button component
│       ├── Card.tsx                   # Reusable card component
│       ├── ProgressBar.tsx            # Progress indicator
│       └── Skeleton.tsx               # Loading skeleton
├── hooks/
│   └── useBookingData.ts              # Custom hooks for Firebase data
├── lib/
│   └── firebase.ts                    # Firebase configuration
├── types/
│   └── index.ts                       # TypeScript type definitions
├── utils/
│   └── dateTime.ts                    # Date/time utility functions
├── layout.tsx                         # Root layout
├── page.tsx                           # Home page
└── globals.css                        # Global styles
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Update `app/lib/firebase.ts` with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Or use environment variables in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Update Firestore Security Rules

Replace your Firestore security rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to branches, services, and staff
    match /branches/{document=**} {
      allow read: if true;
    }
    match /services/{document=**} {
      allow read: if true;
    }
    match /staff/{document=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to create bookings
    match /bookings/{document=**} {
      allow create: if true;
      allow read: if true;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Create Firestore Collections

Create the following collections in Firestore with sample data:

#### Branches Collection
```json
{
  "id": "branch-1",
  "name": "Downtown Branch",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "status": "online",
  "phone": "(555) 123-4567",
  "email": "downtown@example.com"
}
```

#### Services Collection
```json
{
  "id": "service-1",
  "name": "Haircut",
  "description": "Professional haircut service",
  "duration": 30,
  "price": 45,
  "image": "https://example.com/haircut.jpg",
  "branches": ["branch-1"],
  "staffIds": ["staff-1", "staff-2"]
}
```

#### Staff Collection
```json
{
  "id": "staff-1",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 987-6543",
  "profilePhoto": "https://example.com/john.jpg",
  "services": ["service-1"],
  "branches": ["branch-1"],
  "workingHours": {
    "Monday": {
      "start": "09:00",
      "end": "17:00",
      "isWorking": true
    },
    "Tuesday": {
      "start": "09:00",
      "end": "17:00",
      "isWorking": true
    },
    "Wednesday": {
      "start": "09:00",
      "end": "17:00",
      "isWorking": true
    },
    "Thursday": {
      "start": "09:00",
      "end": "17:00",
      "isWorking": true
    },
    "Friday": {
      "start": "09:00",
      "end": "17:00",
      "isWorking": true
    },
    "Saturday": {
      "start": "10:00",
      "end": "14:00",
      "isWorking": true
    },
    "Sunday": {
      "start": "00:00",
      "end": "00:00",
      "isWorking": false
    }
  }
}
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Features

### Step 1: Branch Selection
- Automatically skips if only one branch exists
- Shows all online branches
- Displays branch name, address, and phone
- Radio button selection interface

### Step 2: Service Selection
- Filters services by selected branch
- Shows service name, description, duration, and price
- Displays service images if available
- Card-based layout

### Step 3: Staff Selection
- Shows staff assigned to selected service
- Displays staff name and profile photo
- Fallback avatar with initials if no photo
- Card-based selection

### Step 4: Date & Time Selection
- Calendar showing next 14 days
- Highlights current day
- Time slots based on staff working hours
- 15-minute intervals
- Booking summary sidebar

## Key Components

### BookingWizard
Main component that manages the wizard state and navigation between steps.

### Step Components
Each step is a separate component with its own logic and UI.

### UI Components
Reusable components: Button, Card, ProgressBar, Skeleton

### Hooks
- `useBranches()` - Fetch online branches
- `useServices()` - Fetch services for a branch
- `useStaff()` - Fetch staff for a service

### Utilities
- Date/time formatting and calculations
- Time slot generation based on working hours

## Customization

### Styling
All components use Tailwind CSS. Modify colors and styles in component files or update `tailwind.config.ts`.

### Animations
Animations are powered by Framer Motion. Adjust animation timings and effects in component files.

### Data Fetching
Modify `app/hooks/useBookingData.ts` to customize Firebase queries.

## Next Steps

1. Set up Firebase project and collections
2. Update security rules in Firestore
3. Add sample data to collections
4. Implement booking submission logic in `BookingWizard.tsx`
5. Add customer information step (Step 5)
6. Implement payment processing
7. Add email notifications

## Troubleshooting

### Firebase Connection Issues
- Verify Firebase credentials in `app/lib/firebase.ts`
- Check Firestore security rules
- Ensure collections exist in Firestore

### No Data Showing
- Check browser console for errors
- Verify Firestore collections have data
- Check security rules allow read access

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

