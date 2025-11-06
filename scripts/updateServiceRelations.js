// Script to update service with branch and staff relationships
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBvOkBH0ImFzjFhd09YoKJH6Uf-c_QMy-g",
  authDomain: "service-booking-9d8cb.firebaseapp.com",
  projectId: "service-booking-9d8cb",
  storageBucket: "service-booking-9d8cb.firebasestorage.app",
  messagingSenderId: "1008998558571",
  appId: "1:1008998558571:web:7c8f4c4b8f4c4b8f4c4b8f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateServiceRelations() {
  try {
    // Get all branches
    const branchesSnapshot = await getDocs(collection(db, 'branches'));
    const branches = branchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get all staff
    const staffSnapshot = await getDocs(collection(db, 'staff'));
    const staff = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get all services
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log('Found:', branches.length, 'branches,', staff.length, 'staff,', services.length, 'services');
    
    // Update each service to include branch and staff relationships
    for (const service of services) {
      const branchIds = branches.map(b => b.id);
      const staffIds = staff.map(s => s.id);
      
      await updateDoc(doc(db, 'services', service.id), {
        branches: branchIds,
        staffIds: staffIds
      });
      
      console.log(`Updated service ${service.name} with branches and staff`);
    }
    
    // Update each staff member to include services
    for (const staffMember of staff) {
      const serviceIds = services.map(s => s.id);
      
      await updateDoc(doc(db, 'staff', staffMember.id), {
        services: serviceIds
      });
      
      console.log(`Updated staff ${staffMember.name} with services`);
    }
    
    console.log('All relationships updated successfully!');
  } catch (error) {
    console.error('Error updating relationships:', error);
  }
}

updateServiceRelations();