// This script helps create an admin user for Firebase Authentication
// Run this in your browser console on the sign-in page or create a temporary page

// Instructions:
// 1. Go to Firebase Console > Authentication > Users
// 2. Click "Add user" 
// 3. Enter email and password
// 4. The user will be created and can sign in to the admin dashboard

// Alternatively, you can use this code in a temporary React component:

/*
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

const createAdminUser = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@example.com', 
      'your-secure-password'
    );
    console.log('Admin user created:', userCredential.user);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
*/

console.log('To create an admin user:');
console.log('1. Go to Firebase Console > Authentication > Users');
console.log('2. Click "Add user"');
console.log('3. Enter email and password');
console.log('4. Save and use those credentials to sign in');