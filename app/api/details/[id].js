import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }
    
    // Use the same directory structure as your other API route
    const filePath = path.join(process.cwd(), 'admin', 'appointment.txt');
    
    // Check if file exists before reading
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Appointments file not found' });
    }
    
    try {
      // Use async fs methods for better performance
      const fileData = await fs.readFile(filePath, 'utf8');
      
      // Handle empty file case
      if (!fileData.trim()) {
        return res.status(404).json({ message: 'No bookings found' });
      }
      
      const bookings = JSON.parse(fileData);
      
      // Find the booking with the specified ID (support both string and integer IDs)
      const booking = bookings.find(booking => 
        booking.id === id || booking.id === parseInt(id)
      );
      
      if (booking) {
        return res.status(200).json(booking);
      } else {
        return res.status(404).json({ message: 'Booking not found' });
      }
    } catch (error) {
      // More specific error handling
      if (error.code === 'ENOENT') {
        return res.status(404).json({ message: 'Appointments file not found' });
      } else if (error.code === 'EACCES') {
        return res.status(403).json({ message: 'Permission denied: Cannot access appointments file' });
      } else if (error instanceof SyntaxError) {
        return res.status(500).json({ message: 'Invalid JSON in appointments file' });
      } else {
        throw error; // Re-throw unexpected errors
      }
    }
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}