import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Generate a random 4-digit booking code
function generateBookingCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Validate required fields
    const requiredFields = ['branchId', 'serviceId', 'staffId', 'date', 'startTime', 'customerName', 'customerEmail', 'customerPhone'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(bookingData.customerPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Generate unique booking code
    const bookingCode = generateBookingCode();

    // Create booking document
    const booking = {
      branchId: bookingData.branchId,
      branchName: bookingData.branchName || '',
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName || '',
      staffId: bookingData.staffId,
      staffName: bookingData.staffName || '',
      date: bookingData.date,
      startTime: bookingData.startTime,
      duration: bookingData.duration || 60,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      customerNotes: bookingData.customerNotes || '',
      bookingCode,
      status: 'confirmed',
      channel: 'web',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'bookings'), booking);

    return NextResponse.json({
      success: true,
      bookingId: docRef.id,
      bookingCode,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

