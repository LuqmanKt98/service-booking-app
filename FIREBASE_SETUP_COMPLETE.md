# Firebase Firestore Setup & Configuration Guide

## Project Information

- **Firebase Project:** service-booking-9d8cb
- **Database:** Firestore (NoSQL)
- **Region:** us-central1 (default)
- **Console URL:** https://console.firebase.google.com/project/service-booking-9d8cb

---

## Step 1: Apply Firestore Security Rules

### Instructions:

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/project/service-booking-9d8cb
   - Navigate to: **Firestore Database** → **Rules**

2. **Replace Existing Rules:**
   - Clear all existing rules
   - Copy the rules from `FIRESTORE_RULES_UPDATED.txt` (lines 6-51)
   - Paste into the Rules editor

3. **Development Rules (Recommended for Testing):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for all collections
    match /branches/{branchId} {
      allow read: if true;
      allow write: if false;
    }
    match /services/{serviceId} {
      allow read: if true;
      allow write: if false;
    }
    match /staff/{staffId} {
      allow read: if true;
      allow write: if false;
    }
    match /schedules/{scheduleId} {
      allow read: if true;
      allow write: if false;
    }
    match /blocked_times/{blockedTimeId} {
      allow read: if true;
      allow write: if false;
    }
    // Public create for bookings, no update/delete
    match /bookings/{bookingId} {
      allow read: if true;
      allow create: if true;
      allow update: if false;
      allow delete: if false;
    }
  }
}
```

4. **Publish Rules:**
   - Click **Publish** button
   - Wait for confirmation message

---

## Step 2: Create Firestore Collections

### Required Collections:

1. **branches** - Store locations
2. **services** - Available services
3. **staff** - Staff members
4. **schedules** - Staff working hours
5. **blocked_times** - Unavailable dates/times
6. **bookings** - Customer appointments

### Manual Creation Steps:

1. In Firestore Console, click **+ Start Collection**
2. Enter collection name (e.g., "branches")
3. Click **Next**
4. Add first document (or skip for now)
5. Repeat for each collection

---

## Step 3: Populate Sample Data

### Option A: Using Firebase Console (Manual)

1. Open each collection
2. Click **+ Add Document**
3. Copy data from `SAMPLE_DATA_COMPLETE.json`
4. Paste into document fields
5. Click **Save**

### Option B: Using Node.js Script (Automated)

**Prerequisites:**
```bash
npm install firebase-admin
```

**Run Script:**
```bash
node scripts/populate-firestore.js
```

**What it does:**
- Creates all collections automatically
- Adds sample data for:
  - 3 branches
  - 8 services
  - 6 staff members
  - Staff schedules
  - Blocked times

---

## Step 4: Verify Data Structure

### Expected Collections:

#### branches
```json
{
  "name": "Downtown Branch",
  "address": "123 Main Street",
  "phone": "+1 (555) 123-4567",
  "email": "downtown@bookeasy.com",
  "online": true,
  "visible": true
}
```

#### services
```json
{
  "name": "Haircut & Styling",
  "description": "Professional haircut",
  "duration": 45,
  "price": 50,
  "image": "https://images.unsplash.com/..."
}
```

#### staff
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@bookeasy.com",
  "phone": "+1 (555) 111-2222",
  "photo": "https://i.pravatar.cc/150?img=1",
  "specialization": "Hair Styling"
}
```

#### schedules
```json
{
  "staffId": "staff_document_id",
  "monday": { "start": "09:00", "end": "17:00" },
  "tuesday": { "start": "09:00", "end": "17:00" },
  ...
}
```

#### blocked_times
```json
{
  "date": "2025-12-25",
  "reason": "Christmas Day",
  "startTime": "00:00",
  "endTime": "23:59",
  "allDay": true
}
```

#### bookings (Auto-created)
```json
{
  "branchId": "branch_id",
  "serviceId": "service_id",
  "staffId": "staff_id",
  "date": "2025-12-15",
  "time": "14:00",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1 (555) 999-8888",
  "notes": "Optional notes",
  "bookingCode": "1234",
  "status": "confirmed",
  "createdAt": "2025-11-01T10:30:00Z"
}
```

---

## Step 5: Test the Connection

### Using the Application:

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Test Landing Page:**
   - Visit: http://localhost:3000
   - Verify all sections load

3. **Test Booking Flow:**
   - Click "Book Now"
   - Verify branches load from Firestore
   - Select a branch
   - Verify services load
   - Continue through all steps

4. **Test Admin Dashboard:**
   - Visit: http://localhost:3000/admin
   - Verify all tabs load data
   - Test CRUD operations

### Troubleshooting:

**Error: "Missing or insufficient permissions"**
- ✅ Solution: Apply security rules (Step 1)

**Error: "No data displayed"**
- ✅ Solution: Populate collections with sample data (Step 3)

**Error: "Collection not found"**
- ✅ Solution: Create collections manually (Step 2)

---

## Step 6: Production Security Rules

For production deployment, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin-only write access
    function isAdmin() {
      return request.auth.token.admin == true;
    }
    
    match /branches/{branchId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /services/{serviceId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /staff/{staffId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /schedules/{scheduleId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /blocked_times/{blockedTimeId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /bookings/{bookingId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

---

## Step 7: Environment Variables

Ensure `.env.local` contains:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC9FzSJC55Cd94yNWuKDY8ZTFWrU2ub86s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=service-booking-9d8cb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=service-booking-9d8cb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=service-booking-9d8cb.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=349785909415
NEXT_PUBLIC_FIREBASE_APP_ID=1:349785909415:web:73059f0565c77b70c65382
```

---

## Checklist

- [ ] Security rules applied and published
- [ ] All 6 collections created
- [ ] Sample data populated
- [ ] Firestore connection verified
- [ ] Booking flow tested
- [ ] Admin dashboard tested
- [ ] API endpoints working
- [ ] Data persisting correctly
- [ ] No console errors
- [ ] Production rules ready

---

## Support

For issues:
1. Check Firebase Console for errors
2. Verify security rules are published
3. Ensure collections exist
4. Check browser console for errors
5. Review API response in Network tab

---

## Next Steps

1. ✅ Apply security rules
2. ✅ Create collections
3. ✅ Populate sample data
4. ✅ Test application
5. 🔄 Run comprehensive tests
6. 🚀 Deploy to production

