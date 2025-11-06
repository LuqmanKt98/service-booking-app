import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { staffId, serviceId, branchId, date } = await request.json();

    // Generate mock time slots for demonstration
    // In a real app, this would check actual availability from database
    const generateTimeSlots = () => {
      const slots = [];
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of [0, 30]) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const displayTime = hour > 12 
            ? `${hour - 12}:${minute.toString().padStart(2, '0')} PM`
            : hour === 12
            ? `12:${minute.toString().padStart(2, '0')} PM`
            : `${hour}:${minute.toString().padStart(2, '0')} AM`;
          
          slots.push({
            time: displayTime,
            iso: `${date}T${timeString}:00`
          });
        }
      }
      
      return slots;
    };

    const slots = generateTimeSlots();

    return NextResponse.json({
      success: true,
      slots
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}