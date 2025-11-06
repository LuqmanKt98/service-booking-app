'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  online: boolean;
  visible: boolean;
}

export function BranchesManager() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    online: true,
    visible: true,
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'branches'));
      const branchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Branch[];
      setBranches(branchesData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await updateDoc(doc(db, 'branches', editingBranch.id), formData);
      } else {
        await addDoc(collection(db, 'branches'), formData);
      }
      setDialogOpen(false);
      resetForm();
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      online: branch.online,
      visible: branch.visible,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteDoc(doc(db, 'branches', id));
        fetchBranches();
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      online: true,
      visible: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
              <DialogDescription>
                {editingBranch ? 'Update branch information' : 'Add a new branch location'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingBranch ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="text-gray-700 font-semibold">Name</TableHead>
              <TableHead className="text-gray-700 font-semibold">Address</TableHead>
              <TableHead className="text-gray-700 font-semibold">Contact</TableHead>
              <TableHead className="text-gray-700 font-semibold">Status</TableHead>
              <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id} className="odd:bg-white even:bg-gray-50/40 hover:bg-blue-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{branch.name}</TableCell>
                <TableCell className="text-gray-900">{branch.address}</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-blue-600" />{branch.phone}</div>
                    <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-purple-600" />{branch.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {branch.online ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-green-100 text-green-700 border-green-300 text-xs font-medium">Online</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-300 text-xs font-medium">Offline</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(branch)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleDelete(branch.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-xl border-2 border-gray-200 bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="text-gray-900 font-bold">{branch.name}</div>
              {branch.online ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-green-100 text-green-700 border-green-300 text-xs font-medium">Online</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-300 text-xs font-medium">Offline</span>
              )}
            </div>
            <div className="mt-2 text-gray-900 flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-600" />{branch.address}</div>
            <div className="mt-1 text-sm text-gray-700 flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-blue-600" />{branch.phone}</div>
            <div className="mt-1 text-sm text-gray-700 flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-purple-600" />{branch.email}</div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(branch)} className="flex-1">Edit</Button>
              <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-700" onClick={() => handleDelete(branch.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

