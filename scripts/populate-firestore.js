/**
 * Firestore Data Population Script
 * 
 * This script populates your Firestore database with sample data
 * for testing the booking application.
 * 
 * PREREQUISITES:
 * 1. Apply Firestore security rules from FIRESTORE_RULES_UPDATED.txt
 * 2. Ensure Firebase config is correct in app/lib/firebase.ts
 * 
 * USAGE:
 * node scripts/populate-firestore.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, setDoc, doc } = require('firebase/firestore');

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

// Sample data
const sampleData = {
  branches: [
    {
      name: "Downtown Branch",
      address: "123 Main Street, Downtown, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "downtown@bookeasy.com",
      online: true,
      visible: true
    },
    {
      name: "Uptown Branch",
      address: "456 Park Avenue, Uptown, NY 10002",
      phone: "+1 (555) 234-5678",
      email: "uptown@bookeasy.com",
      online: true,
      visible: true
    },
    {
      name: "Westside Branch",
      address: "789 West Street, Westside, NY 10003",
      phone: "+1 (555) 345-6789",
      email: "westside@bookeasy.com",
      online: true,
      visible: true
    }
  ],
  services: [
    {
      name: "Haircut & Styling",
      description: "Professional haircut with styling consultation",
      duration: 45,
      price: 50,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400"
    },
    {
      name: "Hair Coloring",
      description: "Full hair coloring service with premium products",
      duration: 120,
      price: 150,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400"
    },
    {
      name: "Manicure",
      description: "Classic manicure with nail polish",
      duration: 30,
      price: 35,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400"
    },
    {
      name: "Pedicure",
      description: "Relaxing pedicure with foot massage",
      duration: 45,
      price: 45,
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400"
    },
    {
      name: "Facial Treatment",
      description: "Deep cleansing facial with moisturizing",
      duration: 60,
      price: 80,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400"
    },
    {
      name: "Massage Therapy",
      description: "Full body relaxation massage",
      duration: 90,
      price: 120,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400"
    },
    {
      name: "Makeup Application",
      description: "Professional makeup for special occasions",
      duration: 60,
      price: 75,
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400"
    },
    {
      name: "Waxing Service",
      description: "Professional waxing service",
      duration: 30,
      price: 40,
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400"
    }
  ],
  staff: [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@bookeasy.com",
      phone: "+1 (555) 111-2222",
      photo: "https://i.pravatar.cc/150?img=1",
      specialization: "Hair Styling & Coloring"
    },
    {
      name: "Michael Chen",
      email: "michael.chen@bookeasy.com",
      phone: "+1 (555) 222-3333",
      photo: "https://i.pravatar.cc/150?img=13",
      specialization: "Massage Therapy"
    },
    {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@bookeasy.com",
      phone: "+1 (555) 333-4444",
      photo: "https://i.pravatar.cc/150?img=5",
      specialization: "Nail Care & Manicure"
    },
    {
      name: "David Kim",
      email: "david.kim@bookeasy.com",
      phone: "+1 (555) 444-5555",
      photo: "https://i.pravatar.cc/150?img=14",
      specialization: "Hair Cutting"
    },
    {
      name: "Jessica Martinez",
      email: "jessica.martinez@bookeasy.com",
      phone: "+1 (555) 555-6666",
      photo: "https://i.pravatar.cc/150?img=9",
      specialization: "Facial & Skincare"
    },
    {
      name: "James Wilson",
      email: "james.wilson@bookeasy.com",
      phone: "+1 (555) 666-7777",
      photo: "https://i.pravatar.cc/150?img=12",
      specialization: "Makeup Artist"
    }
  ],
  blocked_times: [
    {
      date: "2025-12-25",
      reason: "Christmas Day",
      startTime: "00:00",
      endTime: "23:59",
      allDay: true
    },
    {
      date: "2025-01-01",
      reason: "New Year's Day",
      startTime: "00:00",
      endTime: "23:59",
      allDay: true
    }
  ]
};

async function populateFirestore() {
  console.log('🚀 Starting Firestore population...\n');

  try {
    // 1. Add Branches
    console.log('📍 Adding branches...');
    for (const branch of sampleData.branches) {
      const docRef = await addDoc(collection(db, 'branches'), branch);
      console.log(`  ✅ Added branch: ${branch.name} (ID: ${docRef.id})`);
    }

    // 2. Add Services
    console.log('\n✂️ Adding services...');
    for (const service of sampleData.services) {
      const docRef = await addDoc(collection(db, 'services'), service);
      console.log(`  ✅ Added service: ${service.name} (ID: ${docRef.id})`);
    }

    // 3. Add Staff
    console.log('\n👥 Adding staff members...');
    const staffIds = [];
    for (const member of sampleData.staff) {
      const docRef = await addDoc(collection(db, 'staff'), member);
      staffIds.push(docRef.id);
      console.log(`  ✅ Added staff: ${member.name} (ID: ${docRef.id})`);
    }

    // 4. Add Schedules for each staff member
    console.log('\n📅 Adding staff schedules...');
    for (const staffId of staffIds) {
      const schedule = {
        staffId: staffId,
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
        saturday: { start: "10:00", end: "16:00" },
        sunday: { start: "", end: "" }
      };
      const docRef = await addDoc(collection(db, 'schedules'), schedule);
      console.log(`  ✅ Added schedule for staff ID: ${staffId} (Schedule ID: ${docRef.id})`);
    }

    // 5. Add Blocked Times
    console.log('\n🚫 Adding blocked times...');
    for (const blockedTime of sampleData.blocked_times) {
      const docRef = await addDoc(collection(db, 'blocked_times'), blockedTime);
      console.log(`  ✅ Added blocked time: ${blockedTime.reason} (ID: ${docRef.id})`);
    }

    console.log('\n✨ Firestore population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Branches: ${sampleData.branches.length}`);
    console.log(`  - Services: ${sampleData.services.length}`);
    console.log(`  - Staff: ${sampleData.staff.length}`);
    console.log(`  - Schedules: ${staffIds.length}`);
    console.log(`  - Blocked Times: ${sampleData.blocked_times.length}`);
    console.log('\n✅ Your application is now ready to use!');
    console.log('🌐 Visit http://localhost:3000/booking to test the booking flow');

  } catch (error) {
    console.error('\n❌ Error populating Firestore:', error);
    console.error('\n⚠️ Make sure you have:');
    console.error('  1. Applied the Firestore security rules');
    console.error('  2. Enabled Firestore in your Firebase project');
    console.error('  3. Correct Firebase configuration');
  }
}

// Run the population script
populateFirestore();

