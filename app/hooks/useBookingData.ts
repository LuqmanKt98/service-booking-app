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
        // Query for branches where online=true and visible=true
        const q = query(
          collection(db, 'branches'),
          where('online', '==', true),
          where('visible', '==', true)
        );
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
        // Get all services for this branch
        const servicesQuery = query(
          collection(db, 'services'),
          where('branches', 'array-contains', branchId)
        );
        const servicesSnapshot = await getDocs(servicesQuery);
        const servicesData = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];

        // Get all staff members
        const staffSnapshot = await getDocs(collection(db, 'staff'));
        const staffData = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Staff[];

        // Filter services that meet ALL criteria:
        // 1. Available (if field exists, default to true)
        // 2. Visible (if field exists, default to true)
        // 3. Has at least one staff member assigned who:
        //    - Is assigned to the selected branch
        //    - Has the service in their services array
        const filteredServices = servicesData.filter((service) => {
          // Check if service is available (default to true if not specified)
          const isAvailable = service.available !== false;

          // Check if service is visible (default to true if not specified)
          const isVisible = service.visible !== false;

          if (!isAvailable || !isVisible) {
            return false;
          }

          // Check if service has staff assigned
          if (!service.staffIds || service.staffIds.length === 0) {
            return false;
          }

          // Check if at least one assigned staff member works at this branch
          // and has this service in their services array
          const hasValidStaff = service.staffIds.some((staffId) => {
            const staffMember = staffData.find((s) => s.id === staffId);
            if (!staffMember) return false;

            // Check if staff member works at this branch
            const worksAtBranch = staffMember.branches?.includes(branchId);

            // Check if staff member provides this service
            const providesService = staffMember.services?.includes(service.id);

            return worksAtBranch && providesService;
          });

          return hasValidStaff;
        });

        setServices(filteredServices);
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

export const useStaff = (serviceId: string | null, branchId: string | null = null) => {
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
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Staff[];

        // If branchId is provided, filter staff who work at that branch
        if (branchId) {
          data = data.filter((staffMember) =>
            staffMember.branches?.includes(branchId)
          );
        }

        setStaff(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [serviceId, branchId]);

  return { staff, loading, error };
};

