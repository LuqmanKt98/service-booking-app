'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  specialization: string;
}

export function StaffManager() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photo: '',
    specialization: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'staff'));
      const staffData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Staff[];
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateDoc(doc(db, 'staff', editingStaff.id), formData);
      } else {
        await addDoc(collection(db, 'staff'), formData);
      }
      setDialogOpen(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      photo: staffMember.photo,
      specialization: staffMember.specialization,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteDoc(doc(db, 'staff', id));
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      photo: '',
      specialization: '',
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
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
              <DialogDescription>
                {editingStaff ? 'Update staff member information' : 'Add a new staff member'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo URL</Label>
                  <Input
                    id="photo"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingStaff ? 'Update' : 'Create'}</Button>
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
              <TableHead className="text-gray-700 font-semibold">Contact</TableHead>
              <TableHead className="text-gray-700 font-semibold">Specialization</TableHead>
              <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((staffMember) => (
              <TableRow key={staffMember.id} className="odd:bg-white even:bg-gray-50/40 hover:bg-blue-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{staffMember.name}</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-700">
                    <div>{staffMember.email}</div>
                    <div className="text-gray-600">{staffMember.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900">{staffMember.specialization}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(staffMember)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleDelete(staffMember.id)}>
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
        {staff.map((s) => (
          <div key={s.id} className="rounded-xl border-2 border-gray-200 bg-white p-4 shadow">
            <div className="text-gray-900 font-bold">{s.name}</div>
            <div className="mt-1 text-sm text-gray-700">{s.email}</div>
            <div className="mt-1 text-sm text-gray-700">{s.phone}</div>
            <div className="mt-2 text-gray-900 font-medium">{s.specialization}</div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(s)} className="flex-1">Edit</Button>
              <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-700" onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

