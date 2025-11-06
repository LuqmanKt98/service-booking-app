'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export function SeedDataButton() {
  const [loading, setLoading] = useState(false);

  const seedRelationships = async () => {
    setLoading(true);
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
        
        console.log(`Updated service ${service.id} with branches and staff`);
      }
      
      // Update each staff member to include services
      for (const staffMember of staff) {
        const serviceIds = services.map(s => s.id);
        
        await updateDoc(doc(db, 'staff', staffMember.id), {
          services: serviceIds
        });
        
        console.log(`Updated staff ${staffMember.id} with services`);
      }
      
      alert('All relationships updated successfully!');
    } catch (error) {
      console.error('Error updating relationships:', error);
      alert('Error updating relationships: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={seedRelationships} 
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Updating...
        </>
      ) : (
        'Link Services & Staff'
      )}
    </Button>
  );
}