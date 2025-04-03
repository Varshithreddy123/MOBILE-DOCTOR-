import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }
    
    const filePath = path.join(process.cwd(), 'admin', 'appointment.txt');
    
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Appointments file not found' });
    }
    
    const fileData = await fs.readFile(filePath, 'utf8');
    
    if (!fileData.trim()) {
      return res.status(404).json({ message: 'No bookings found' });
    }
    
    let bookings = JSON.parse(fileData);
    
    // Handle GET request - retrieve booking details
    if (req.method === 'GET') {
      const booking = bookings.find(booking => 
        booking.id === id || booking.id === parseInt(id)
      );
      
      if (booking) {
        return res.status(200).json(booking);
      } else {
        return res.status(404).json({ message: 'Booking not found' });
      }
    }
    // Handle DELETE request - cancel booking
    else if (req.method === 'DELETE') {
      const bookingIndex = bookings.findIndex(booking => 
        booking.id === id || booking.id === parseInt(id)
      );
      
      if (bookingIndex === -1) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Mark as cancelled instead of removing (for record keeping)
      bookings[bookingIndex].status = 'cancelled';
      bookings[bookingIndex].cancelledAt = new Date().toISOString();
      
      try {
        await fs.writeFile(filePath, JSON.stringify(bookings, null, 2));
        return res.status(200).json({ 
          message: 'Booking cancelled successfully',
          cancelledBooking: bookings[bookingIndex]
        });
      } catch (writeError) {
        console.error('Error saving cancellation:', writeError);
        return res.status(500).json({ message: 'Failed to save cancellation' });
      }
    }
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    if (error.code === 'ENOENT') {
      return res.status(404).json({ message: 'Appointments file not found' });
    } else if (error.code === 'EACCES') {
      return res.status(403).json({ message: 'Permission denied: Cannot access appointments file' });
    } else if (error instanceof SyntaxError) {
      return res.status(500).json({ message: 'Invalid JSON in appointments file' });
    } else {
      return res.status(500).json({ 
        message: 'Internal server error', 
        error: error.message 
      });
    }
  }
}