import { NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
let bookings = [];

export async function POST(request, { params }) {
  const { id } = params;

  try {
    // Find the booking to cancel
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking status to cancelled
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(
      { 
        message: 'Booking cancelled successfully',
        booking: bookings[bookingIndex]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}