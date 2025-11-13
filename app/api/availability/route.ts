import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

// Helper function to convert time string (HH:mm) to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to convert minutes since midnight to time string (HH:mm)
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Helper function to format time for display (12-hour format)
function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Helper function to get day of week from date string (YYYY-MM-DD)
function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export async function POST(request: NextRequest) {
  try {
    const { staffId, serviceId, branchId, date } = await request.json();

    // Validate required fields
    if (!staffId || !serviceId || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get staff member details
    const staffDoc = await getDoc(doc(db, 'staff', staffId));
    if (!staffDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }
    const staffData = { id: staffDoc.id, ...staffDoc.data() } as any;

    // Get service details
    const serviceDoc = await getDoc(doc(db, 'services', serviceId));
    if (!serviceDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    const serviceData = { id: serviceDoc.id, ...serviceDoc.data() } as any;
    const serviceDuration = serviceData.duration || 60; // Default to 60 minutes

    // Get day of week for the selected date
    const dayOfWeek = getDayOfWeek(date);

    // Check if staff member works on this day
    const workingHours = staffData.workingHours?.[dayOfWeek];
    if (!workingHours || !workingHours.isWorking) {
      return NextResponse.json({
        success: true,
        slots: [],
        message: `Staff member does not work on ${dayOfWeek}s`
      });
    }

    // Get staff working hours for this day
    const workStart = timeToMinutes(workingHours.start);
    const workEnd = timeToMinutes(workingHours.end);

    // Get existing bookings for this staff member on this date
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('staffId', '==', staffId),
      where('date', '==', date),
      where('status', 'in', ['confirmed', 'pending'])
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const existingBookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Create array of booked time ranges (robust to legacy '10:00 AM' values)
    const bookedRanges: Array<{ start: number; end: number }> = existingBookings
      .map((booking) => {
        const raw = (booking.startTime || booking.time || '').toString();
        let startTime = -1;
        if (/^\d{1,2}:\d{2}$/.test(raw)) {
          startTime = timeToMinutes(raw);
        } else {
          const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (match) {
            let h = parseInt(match[1], 10) % 12;
            const m = parseInt(match[2], 10);
            if (match[3].toUpperCase() === 'PM') h += 12;
            startTime = h * 60 + m;
          }
        }
        const duration = Number(booking.duration) || serviceDuration;
        return startTime >= 0
          ? { start: startTime, end: startTime + duration }
          : { start: -1, end: -1 };
      })
      .filter((r) => r.start >= 0);

    // Global blocked times for this date (e.g., holidays)
    const blockedTimesSnap = await getDocs(
      query(collection(db, 'blocked_times'), where('date', '==', date))
    );
    const blockedRanges: Array<{ start: number; end: number }> = blockedTimesSnap.docs.map((d) => {
      const b = d.data() as any;
      if (b.allDay) return { start: 0, end: 24 * 60 };
      const s = timeToMinutes(b.startTime || '00:00');
      const e = timeToMinutes(b.endTime || '23:59');
      return { start: s, end: e };
    });

    const unavailableRanges = [...bookedRanges, ...blockedRanges];

    // Generate available time slots
    const slots = [];
    const slotInterval = 15; // 15-minute intervals
    const bufferTime = 0; // No buffer time between appointments

    for (let currentTime = workStart; currentTime + serviceDuration <= workEnd; currentTime += slotInterval) {
      const slotEnd = currentTime + serviceDuration;

      // Check if this slot overlaps with any existing booking or blocked time
      const isBooked = unavailableRanges.some((range) => {
        // Overlap check
        return currentTime < range.end && slotEnd > range.start;
      });

      if (!isBooked) {
        const timeString = minutesToTime(currentTime);
        const displayTime = formatTimeDisplay(timeString);

        slots.push({
          time: displayTime,
          iso: `${date}T${timeString}:00`,
          value: timeString // HH:mm format for backend
        });
      }
    }

    return NextResponse.json({
      success: true,
      slots,
      workingHours: {
        start: workingHours.start,
        end: workingHours.end
      }
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}