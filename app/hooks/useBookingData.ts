'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Branch, Service, Staff } from '@/app/types';

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const q = query(collection(db, 'branches'), where('status', '==', 'online'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Branch[];
        setBranches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return { branches, loading, error };
};

export const useServices = (branchId: string | null) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!branchId) {
      setServices([]);
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const q = query(
          collection(db, 'services'),
          where('branches', 'array-contains', branchId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];
        // Filter services that have staff assigned
        setServices(data.filter((s) => s.staffIds && s.staffIds.length > 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [branchId]);

  return { services, loading, error };
};

export const useStaff = (serviceId: string | null) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setStaff([]);
      setLoading(false);
      return;
    }

    const fetchStaff = async () => {
      try {
        const q = query(
          collection(db, 'staff'),
          where('services', 'array-contains', serviceId)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Staff[];
        setStaff(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [serviceId]);

  return { staff, loading, error };
};

