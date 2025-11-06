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

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  branches?: string[];
  staffIds?: string[];
}

interface Branch {
  id: string;
  name: string;
}

interface Staff {
  id: string;
  name: string;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    image: '',
    branches: [] as string[],
    staffIds: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesSnapshot, branchesSnapshot, staffSnapshot] = await Promise.all([
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'branches')),
        getDocs(collection(db, 'staff'))
      ]);
      
      const servicesData = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
      
      const branchesData = branchesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      })) as Branch[];
      
      const staffData = staffSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      })) as Staff[];
      
      setServices(servicesData);
      setBranches(branchesData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), formData);
      } else {
        await addDoc(collection(db, 'services'), formData);
      }
      
      // Update staff members to include this service
      for (const staffId of formData.staffIds) {
        const staffDoc = doc(db, 'staff', staffId);
        const staffSnapshot = await getDocs(collection(db, 'staff'));
        const staffMember = staffSnapshot.docs.find(d => d.id === staffId);
        if (staffMember) {
          const currentServices = staffMember.data().services || [];
          const serviceId = editingService?.id || 'new-service-id';
          if (!currentServices.includes(serviceId)) {
            await updateDoc(staffDoc, {
              services: [...currentServices, serviceId]
            });
          }
        }
      }
      
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      image: service.image,
      branches: service.branches || [],
      staffIds: service.staffIds || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', id));
        fetchData();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      duration: 60,
      price: 0,
      image: '',
      branches: [],
      staffIds: [],
    });
  };

  const handleBranchToggle = (branchId: string) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter(id => id !== branchId)
        : [...prev.branches, branchId]
    }));
  };

  const handleStaffToggle = (staffId: string) => {
    setFormData(prev => ({
      ...prev,
      staffIds: prev.staffIds.includes(staffId)
        ? prev.staffIds.filter(id => id !== staffId)
        : [...prev.staffIds, staffId]
    }));
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
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Update service information' : 'Add a new service offering'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                

              </div>
              <DialogFooter>
                <Button type="submit">{editingService ? 'Update' : 'Create'}</Button>
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
              <TableHead className="text-gray-700 font-semibold">Description</TableHead>
              <TableHead className="text-gray-700 font-semibold">Duration</TableHead>
              <TableHead className="text-gray-700 font-semibold">Price</TableHead>
              <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="odd:bg-white even:bg-gray-50/40 hover:bg-blue-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{service.name}</TableCell>
                <TableCell className="text-gray-900">{service.description}</TableCell>
                <TableCell><span className="inline-flex items-center px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-300 text-xs font-medium">{service.duration} min</span></TableCell>
                <TableCell><span className="inline-flex items-center px-2.5 py-1 rounded-full border bg-green-100 text-green-700 border-green-300 text-xs font-medium">${service.price.toFixed(2)}</span></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleDelete(service.id)}>
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
        {services.map((s) => (
          <div key={s.id} className="rounded-xl border-2 border-gray-200 bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div className="text-gray-900 font-bold">{s.name}</div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full border bg-green-100 text-green-700 border-green-300 text-xs font-medium">${s.price.toFixed(2)}</span>
            </div>
            <div className="mt-1 text-gray-700 text-sm">{s.description}</div>
            <div className="mt-2"><span className="inline-flex items-center px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-300 text-xs font-medium">{s.duration} min</span></div>
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

