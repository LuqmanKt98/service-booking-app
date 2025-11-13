export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  online: boolean;
  visible: boolean;
  // Legacy fields (may not be present in all branches)
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image?: string;
  branches: string[]; // branch IDs where this service is available
  staffIds: string[]; // staff members assigned to this service
  visible?: boolean; // whether the service is visible to customers
  available?: boolean; // whether the service is currently available for booking
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  services: string[]; // service IDs they can provide
  branches: string[]; // branch IDs they work at
  workingHours: {
    [day: string]: {
      start: string; // HH:mm format
      end: string; // HH:mm format
      isWorking: boolean;
    };
  };
}

export interface TimeSlot {
  time: string; // HH:mm format
  available: boolean;
}

export interface Booking {
  id?: string;
  branchId: string;
  serviceId: string;
  staffId: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:mm format (legacy field)
  startTime: string; // HH:mm format
  duration?: number; // in minutes
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
}

export interface BookingWizardState {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  selectedBranch: Branch | null;
  selectedService: Service | null;
  selectedStaff: Staff | null;
  selectedDate: string | null;
  selectedTime: string | null;
}

