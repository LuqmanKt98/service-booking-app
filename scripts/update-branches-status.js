// This script updates all branches to be online and visible
// Run this from the browser console on the admin page while signed in

const updateAllBranches = async () => {
  try {
    console.log('Fetching all branches...');
    const { collection, getDocs, updateDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../app/lib/firebase');

    const branchesSnapshot = await getDocs(collection(db, 'branches'));

    if (branchesSnapshot.empty) {
      console.log('No branches found in the database.');
      return;
    }

    console.log(`Found ${branchesSnapshot.size} branches. Updating...`);

    let updateCount = 0;
    const updatePromises = [];

    branchesSnapshot.forEach((docSnapshot) => {
      const branchRef = doc(db, 'branches', docSnapshot.id);
      const updatePromise = updateDoc(branchRef, {
        online: true,
        visible: true
      }).then(() => {
        updateCount++;
        console.log(`Updated branch: ${docSnapshot.data().name} (ID: ${docSnapshot.id})`);
      });
      updatePromises.push(updatePromise);
    });

    await Promise.all(updatePromises);
    console.log(`\n✅ Successfully updated ${updateCount} branches!`);
    console.log('All branches are now set to online: true and visible: true');

    // Verify the updates
    console.log('\nVerifying updates...');
    const verifySnapshot = await getDocs(collection(db, 'branches'));
    verifySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      console.log(`- ${data.name}: online=${data.online}, visible=${data.visible}`);
    });

    return 'Update complete!';
  } catch (error) {
    console.error('Error updating branches:', error);
    throw error;
  }
};

// For browser console usage
if (typeof window !== 'undefined') {
  window.updateAllBranches = updateAllBranches;
  console.log('Run updateAllBranches() to update all branches to online status');
}

export { updateAllBranches };

