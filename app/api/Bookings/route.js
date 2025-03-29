// app/api/bookings/route.js
import { NextResponse } from 'next/server';

// In-memory storage for bookings (replace with a database in production)
let bookings = [];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }

  // Fetch bookings for the user
  const userBookings = bookings.filter((booking) => booking.userId === userId);

  return NextResponse.json(userBookings);
}

export async function POST(request) {
  const body = await request.json();
  const { userId, date, timeSlot, name, email, phone } = body;

  // Input validation
  const requiredFields = ['userId', 'date', 'timeSlot', 'name', 'email'];
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { message: `Missing required fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }

  // Check if the date is valid (not in the past or a weekend)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(date);

  if (bookingDate < today) {
    return NextResponse.json(
      { message: 'Cannot book appointments in the past' },
      { status: 400 }
    );
  }

  const day = bookingDate.getDay();
  if (day === 0 || day === 6) {
    return NextResponse.json(
      { message: 'Weekend appointments are not available' },
      { status: 400 }
    );
  }

  // Check for duplicate bookings (same user, date, and time slot)
  const isDuplicate = bookings.some(
    (booking) =>
      booking.userId === userId &&
      booking.date === date &&
      booking.timeSlot === timeSlot
  );

  if (isDuplicate) {
    return NextResponse.json(
      { message: 'You already have a booking for this date and time' },
      { status: 400 }
    );
  }

  // Create a new booking
  const newBooking = {
    id: bookings.length + 1, // Generate a simple ID (replace with UUID in production)
    userId,
    date,
    timeSlot,
    name,
    email,
    phone: phone || null,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  // Save to in-memory storage
  bookings.push(newBooking);

  return NextResponse.json(
    { message: 'Booking created successfully!', booking: newBooking },
    { status: 201 }
  );
}