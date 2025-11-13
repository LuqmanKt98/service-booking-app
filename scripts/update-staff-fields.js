const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9FzSJC55Cd94yNWuKDY8ZTFWrU2ub86s",
  authDomain: "service-booking-9d8cb.firebaseapp.com",
  projectId: "service-booking-9d8cb",
  storageBucket: "service-booking-9d8cb.firebasestorage.app",
  messagingSenderId: "349785909415",
  appId: "1:349785909415:web:73059f0565c77b70c65382"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateStaffFields() {
  try {
    console.log('Fetching all staff members...');
    const staffSnapshot = await getDocs(collection(db, 'staff'));

    console.log(`Found ${staffSnapshot.size} staff members\n`);

    // Define default working hours (Monday-Friday 9 AM - 5 PM)
    const defaultWorkingHours = {
      Monday: { start: '09:00', end: '17:00', isWorking: true },
      Tuesday: { start: '09:00', end: '17:00', isWorking: true },
      Wednesday: { start: '09:00', end: '17:00', isWorking: true },
      Thursday: { start: '09:00', end: '17:00', isWorking: true },
      Friday: { start: '09:00', end: '17:00', isWorking: true },
      Saturday: { start: '10:00', end: '16:00', isWorking: true },
      Sunday: { start: '00:00', end: '00:00', isWorking: false }
    };

    // Get all branches to assign staff to
    const branchesSnapshot = await getDocs(collection(db, 'branches'));
    const branchIds = branchesSnapshot.docs.map(doc => doc.id);
    console.log(`Found ${branchIds.length} branches: ${branchIds.join(', ')}\n`);

    for (const staffDoc of staffSnapshot.docs) {
      const staffId = staffDoc.id;
      const staffData = staffDoc.data();
      
      console.log(`\nProcessing staff: ${staffData.name} (${staffId})`);
      console.log(`  Current data:`, JSON.stringify(staffData, null, 2));

      const updates = {};

      // Add branches field if it doesn't exist
      if (!staffData.branches || staffData.branches.length === 0) {
        // Assign to all branches
        updates.branches = branchIds;
        console.log(`  ✓ Adding branches field: ${branchIds.join(', ')}`);
      } else {
        console.log(`  - Branches field already exists: ${staffData.branches.join(', ')}`);
      }

      // Add workingHours field if it doesn't exist
      if (!staffData.workingHours) {
        updates.workingHours = defaultWorkingHours;
        console.log(`  ✓ Adding workingHours field with default schedule`);
      } else {
        console.log(`  - workingHours field already exists`);
      }

      // Update the staff document if there are changes
      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'staff', staffId), updates);
        console.log(`  ✅ Updated staff member: ${staffData.name}`);
      } else {
        console.log(`  ℹ️  No updates needed for: ${staffData.name}`);
      }
    }

    console.log('\n✅ All staff members have been updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating staff:', error);
    process.exit(1);
  }
}

updateStaffFields();

