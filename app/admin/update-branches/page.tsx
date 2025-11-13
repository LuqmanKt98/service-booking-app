'use client';

import { useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function UpdateBranchesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; branches?: any[] } | null>(null);

  const updateAllBranches = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('Fetching all branches...');
      const branchesSnapshot = await getDocs(collection(db, 'branches'));
      
      if (branchesSnapshot.empty) {
        setResult({
          success: false,
          message: 'No branches found in the database.'
        });
        setLoading(false);
        return;
      }

      console.log(`Found ${branchesSnapshot.size} branches. Updating...`);
      
      const updatePromises: Promise<void>[] = [];
      const branchesData: any[] = [];

      branchesSnapshot.forEach((docSnapshot) => {
        const branchRef = doc(db, 'branches', docSnapshot.id);
        const branchData = docSnapshot.data();
        branchesData.push({
          id: docSnapshot.id,
          name: branchData.name,
          before: { online: branchData.online, visible: branchData.visible }
        });

        const updatePromise = updateDoc(branchRef, {
          online: true,
          visible: true
        });
        updatePromises.push(updatePromise);
      });

      await Promise.all(updatePromises);

      // Verify the updates
      const verifySnapshot = await getDocs(collection(db, 'branches'));
      const verifyMap = new Map();
      verifySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        verifyMap.set(docSnapshot.id, { online: data.online, visible: data.visible });
      });

      branchesData.forEach((branch) => {
        branch.after = verifyMap.get(branch.id) || { online: false, visible: false };
      });

      setResult({
        success: true,
        message: `Successfully updated ${branchesSnapshot.size} branches!`,
        branches: branchesData
      });
    } catch (error) {
      console.error('Error updating branches:', error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update All Branches</h1>
          <p className="text-gray-600 mb-8">
            This utility will set all branches to <strong>online: true</strong> and <strong>visible: true</strong>
          </p>

          <Button
            onClick={updateAllBranches}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update All Branches'
            )}
          </Button>

          {result && (
            <div className={`mt-8 p-6 rounded-xl border-2 ${
              result.success 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <h2 className={`text-xl font-semibold ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.message}
                </h2>
              </div>

              {result.branches && result.branches.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">Updated Branches:</h3>
                  {result.branches.map((branch) => (
                    <div key={branch.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900">{branch.name}</div>
                      <div className="text-sm text-gray-600 mt-2">
                        <div>
                          Before: online={String(branch.before.online)}, visible={String(branch.before.visible)}
                        </div>
                        <div className="text-green-600 font-medium">
                          After: online={String(branch.after.online)}, visible={String(branch.after.visible)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                >
                  Go to Admin Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

