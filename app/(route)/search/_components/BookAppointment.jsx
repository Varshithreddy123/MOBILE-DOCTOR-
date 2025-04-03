"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../dialog";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, CheckCircle, Download, Image, FileText, History, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';

// List of available doctors
const doctors = [
  { id: 'dr-mehta', name: 'Dr. Aarav Mehta', specialty: 'Cardiology', availableDays: [1, 2, 3, 4, 5] }, // Mon-Fri
  { id: 'dr-patel', name: 'Dr. Karan Patel', specialty: 'Neurologist', availableDays: [2, 3, 4] }, // Tue-Thu
  { id: 'dr-menon', name: 'Dr. Rajiv Menon', specialty: 'Otology', availableDays: [2, 3, 4] }, // Tue-Thu
  { id: 'dr-Sophia', name: 'Dr. Sophia Rao', specialty: 'Dermatology', availableDays: [1, 3, 5] }, // Mon, Wed, Fri
  { id: 'dr-Sharma', name: 'Dr. Rohan Sharma', specialty: 'Orthopedics', availableDays: [1, 2, 4, 5] }, // Mon, Tue, Thu, Fri
  { id: 'dr-das', name: 'Dr. Meera Das', specialty: 'General Doctor', availableDays: [1, 2, 3, 4, 5] }, // Mon-Fri
  { id: 'dr-singh', name: 'Dr. Ananya Singh', specialty: 'Surgeon', availableDays: [1, 2, 3, 4, 5] }, // Mon-Fri
  { id: 'dr-Rao', name: 'Dr. Vikram Rao', specialty: 'Psychotropic', availableDays: [1, 2, 3, 4] }, // Mon-Thu
  { id: 'dr-Kapoor', name: 'Dr. Neha Kapoor', specialty: 'Eye Specialist', availableDays: [1, 2, 3, 4, 5] }, // Mon-Fri
];

// Generate time slots from 9 AM to 5 PM
const timeSlots = (() => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    slots.push(`${displayHour}:00 ${period}`);
    slots.push(`${displayHour}:30 ${period}`);
  }
  return slots;
})();

// BookingConfirmation component - displays booking details and provides download options
const BookingConfirmation = ({ booking, onClose }) => {
  const confirmationRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAsImage = useCallback(async () => {
    if (!confirmationRef.current) return;
    setIsDownloading(true);

    try {
      // Check if html2canvas is already loaded
      if (typeof window.html2canvas === 'undefined') {
        // Load html2canvas dynamically
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load html2canvas'));
          document.head.appendChild(script);
        });
      }
      
      // Use html2canvas to capture the confirmation box
      const canvas = await window.html2canvas(confirmationRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Ignore any elements that might cause issues
          return false;
        }
      });
      
      // Convert to image and download
      const link = document.createElement('a');
      link.download = `booking-confirmation-${booking.bookingReference}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Error downloading as image:', error);
      toast.error('Failed to download as image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [booking]);

  const downloadAsText = useCallback(() => {
    try {
      const content = `
BOOKING CONFIRMATION
--------------------
Reference: ${booking.bookingReference}
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Doctor: ${booking.doctorName} (${booking.doctorSpecialty})
Date: ${booking.date}
Time: ${booking.timeSlot}
Status: ${booking.status}
${booking.isDemoBooking ? '(Demo Booking)' : ''}

Please arrive 10 minutes before your scheduled time.
If you need to reschedule or cancel, please contact us at least 24 hours in advance.
Clinic Address: 123 Medical Drive, Health City, HC 12345
      `.trim();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `booking-confirmation-${booking.bookingReference}.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading as text:', error);
      toast.error('Failed to download as text file');
    }
  }, [booking]);

  return (
    <div className="space-y-4">
      <div ref={confirmationRef} className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center mb-2">
          <CheckCircle className="text-green-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-blue-800">Booking Confirmed</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-sm font-medium">{booking.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm font-medium">{booking.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-sm font-medium">{booking.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Doctor</p>
            <p className="text-sm font-medium">{booking.doctorName} ({booking.doctorSpecialty})</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="text-sm font-medium">{booking.date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Time</p>
            <p className="text-sm font-medium">{booking.timeSlot}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Reference</p>
            <p className="text-sm font-medium">{booking.bookingReference}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button
          onClick={downloadAsImage}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Image size={16} />
              Download as Image
            </>
          )}
        </Button>
        <Button
          onClick={downloadAsText}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FileText size={16} />
          Download as Text
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

// BookingHistory component - displays past bookings
const BookingHistory = ({ bookings, onClose, onCancelBooking }) => {
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (booking) => {
    setCancellingId(booking.bookingReference);
    try {
      await onCancelBooking(booking);
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Booking History</h3>
        <Button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
        >
          Close
        </Button>
      </div>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No previous bookings found
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {bookings.map((booking, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{booking.date} at {booking.timeSlot}</p>
                  <p className="text-sm text-gray-600">Ref: {booking.bookingReference}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p>{booking.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p>{booking.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Doctor</p>
                  <p>{booking.doctorName} ({booking.doctorSpecialty})</p>
                </div>
                {booking.phone && (
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p>{booking.phone}</p>
                  </div>
                )}
                {booking.isDemoBooking && (
                  <div className="col-span-2">
                    <p className="text-xs text-yellow-600">Demo booking (not saved to server)</p>
                  </div>
                )}
              </div>
              {booking.status !== 'Cancelled' && (
                <div className="mt-3 flex justify-end">
                  <Button
                    onClick={() => handleCancel(booking)}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    disabled={cancellingId === booking.bookingReference}
                  >
                    {cancellingId === booking.bookingReference ? (
                      <>
                        <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Appointment'
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main BookAppointment component - handles the entire booking flow
const BookAppointment = () => {
  const { data: session } = useSession();
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState(doctors);

  // Filter doctors based on selected day
  const filterDoctorsByDay = useCallback((day) => {
    return doctors.filter(doctor => doctor.availableDays.includes(day));
  }, []);

  // Update available doctors when date changes
  useEffect(() => {
    if (date) {
      const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      setAvailableDoctors(filterDoctorsByDay(day));
      // Reset selected doctor if not available on the new day
      if (selectedDoctor) {
        const selectedDoc = doctors.find(d => d.id === selectedDoctor);
        if (selectedDoc && !selectedDoc.availableDays.includes(day)) {
          setSelectedDoctor('');
        }
      }
    }
  }, [date, selectedDoctor, filterDoctorsByDay]);

  // Load saved bookings and form data on component mount
  useEffect(() => {
    // Check if we're running in a development environment or if API endpoints aren't available
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    const apiEndpointsAvailable = typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      !window.location.hostname.includes('vercel.app');
    
    setIsDemoMode(isDevEnvironment || !apiEndpointsAvailable);

    // Load saved form data
    const savedFormData = localStorage.getItem('bookingFormData');
    if (savedFormData) {
      try {
        const { name, email, phone } = JSON.parse(savedFormData);
        setName(name || '');
        setEmail(email || '');
        setPhone(phone || '');
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }

    // Load booking history
    const savedBookings = localStorage.getItem('bookingHistory');
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings);
        setBookings(parsedBookings);
      } catch (e) {
        console.error('Failed to parse booking history', e);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = { name, email, phone };
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [name, email, phone]);

  const validateForm = useCallback(() => {
    if (!date) {
      toast.error('Please select a date');
      return false;
    }
    if (!timeSlot) {
      toast.error('Please select a time slot');
      return false;
    }
    if (!name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return false;
    }
    return true;
  }, [date, timeSlot, name, email, selectedDoctor]);

  const isDateInvalid = useCallback((dateToCheck) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateToCheck < today) return true;
    const day = dateToCheck.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const handleDemoBooking = useCallback(() => {
    const bookingReference = `DEMO-${Date.now().toString().slice(-6)}`;
    const formattedDate = formatDate(date);
    const selectedDoc = doctors.find(d => d.id === selectedDoctor);

    // Create booking data object
    const bookingData = {
      date: formattedDate,
      timeSlot,
      name,
      email,
      phone: phone || 'Not provided',
      status: 'Pending',
      bookingReference,
      doctorId: selectedDoctor,
      doctorName: selectedDoc?.name || 'Not specified',
      doctorSpecialty: selectedDoc?.specialty || 'General',
      createdAt: new Date().toISOString(),
      isDemoBooking: true
    };

    // Save to localStorage (for history)
    const updatedHistory = [bookingData, ...bookings.slice(0, 9)]; // Keep last 10 bookings
    localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory));
    setBookings(updatedHistory);

    return bookingData;
  }, [date, timeSlot, name, email, phone, selectedDoctor, formatDate, bookings]);

  const handleBooking = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setBookingConfirmed(false);
    setConfirmedBooking(null);

    try {
      if (isDateInvalid(date)) {
        throw new Error('Please select a valid weekday in the future');
      }

      // If in demo mode, don't try to make API calls
      if (isDemoMode) {
        const bookingData = handleDemoBooking();
        console.log('Demo booking created:', bookingData);
        setConfirmedBooking(bookingData);
        setBookingConfirmed(true);
        toast.success('Appointment booked successfully! (Demo Mode)');
        setIsLoading(false);
        return;
      }

      const bookingReference = `REF-${Date.now().toString().slice(-6)}`;
      const formattedDate = formatDate(date);
      const selectedDoc = doctors.find(d => d.id === selectedDoctor);

      // Create booking data object
      const bookingData = {
        userId: session?.user?.id || 'guest',
        date: date.toISOString().split('T')[0],
        timeSlot,
        doctorId: selectedDoctor,
        doctorName: selectedDoc?.name || 'Not specified',
        specialty: selectedDoc?.specialty || 'General',
        name,
        email,
        phone: phone || null,
        notes: '',
        status: 'pending',
        bookingReference,
        createdAt: new Date().toISOString()
      };

      // First save the booking to your database
      try {
        const bookingResponse = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          },
          body: JSON.stringify(bookingData),
        });

        if (!bookingResponse.ok) {
          const errorData = await bookingResponse.json();
          throw new Error(errorData.message || 'Failed to save booking');
        }

        const result = await bookingResponse.json();
        bookingData.status = result.booking?.status || 'confirmed';
        bookingData.id = result.booking?.id || bookingReference;
        
      } catch (apiError) {
        console.error('API call failed:', apiError);
        if (isDemoMode) {
          toast.warning('Running in demo mode. Saved locally only.');
        } else {
          throw apiError;
        }
      }

      // Save to localStorage (for history)
      const updatedHistory = [bookingData, ...bookings.slice(0, 9)]; // Keep last 10 bookings
      localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory));
      setBookings(updatedHistory);

      // Then send confirmation email if not in demo mode
      if (!isDemoMode) {
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              from: 'DocApp <no-reply@example.com>',
              subject: `Appointment Confirmation - ${name}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                  <h2 style="color: #2563eb; text-align: center;">Your appointment has been confirmed!</h2>
                  <div style="margin-top: 20px;">
                    <p><strong style="color: #4b5563;">Name:</strong> ${name}</p>
                    <p><strong style="color: #4b5563;">Email:</strong> ${email}</p>
                    <p><strong style="color: #4b5563;">Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong style="color: #4b5563;">Doctor:</strong> ${selectedDoc?.name || 'Not specified'} (${selectedDoc?.specialty || 'General'})</p>
                    <p><strong style="color: #4b5563;">Date:</strong> ${formattedDate}</p>
                    <p><strong style="color: #4b5563;">Time:</strong> ${timeSlot}</p>
                    <p><strong style="color: #4b5563;">Booking Reference:</strong> ${bookingReference}</p>
                    <p><strong style="color: #4b5563;">Clinic Address:</strong> 123 Medical Drive, Health City, HC 12345</p>
                  </div>
                  <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                    Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
                  </p>
                </div>
              `
            }),
          });

          if (!emailResponse.ok) {
            throw new Error('Failed to send confirmation email');
          }
        } catch (emailError) {
          console.error('Email API call failed:', emailError);
          // Continue even if email sending fails
          toast.warning('Appointment booked, but confirmation email could not be sent.');
        }
      }

      setConfirmedBooking(bookingData);
      setBookingConfirmed(true);
      toast.success('Appointment booked successfully!');
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  }, [date, timeSlot, name, email, phone, selectedDoctor, validateForm, isDateInvalid, formatDate, isDemoMode, handleDemoBooking, bookings, session]);

  const cancelBooking = useCallback(async (booking) => {
    try {
      if (booking.isDemoBooking) {
        // Handle demo cancellation
        const updatedBookings = bookings.map(b => 
          b.bookingReference === booking.bookingReference 
            ? { ...b, status: 'Cancelled' } 
            : b
        );
        localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
        return;
      }

      // Handle real API cancellation if not in demo mode
      if (!isDemoMode) {
        const response = await fetch(`/api/bookings/${booking.id || booking.bookingReference}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to cancel booking');
        }
      }

      // Update local state
      const updatedBookings = bookings.map(b => 
        b.bookingReference === booking.bookingReference 
          ? { ...b, status: 'Cancelled' } 
          : b
      );
      localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);

    } catch (error) {
      console.error('Cancellation error:', error);
      throw error;
    }
  }, [bookings, isDemoMode, session]);

  const handleClose = () => {
    if (bookingConfirmed) {
      // Reset form but keep email for future bookings
      setName('');
      setPhone('');
      setTimeSlot('');
      setDate(new Date());
      setSelectedDoctor('');
      setBookingConfirmed(false);
      setConfirmedBooking(null);
    }
    setOpen(false);
    setShowHistory(false);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      setBookingConfirmed(false);
      setConfirmedBooking(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2">
          <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md">
            Book Appointment
          </Button>
          {bookings.length > 0 && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                toggleHistory();
              }}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md"
            >
              <History size={16} className="mr-2" />
              History
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {showHistory ? 'Booking History' : 
             bookingConfirmed ? 'Appointment Confirmed' : 'Book Your Appointment'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {showHistory ? 'View and manage your previous bookings' : 
             bookingConfirmed ? 'Your appointment has been successfully booked. Details below.' :
             'Please select a date, time, and provide your details to book your appointment.'}
            {isDemoMode && !bookingConfirmed && !showHistory && (
              <span className="mt-2 inline-block p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                Running in demo mode. Appointments will be saved locally only.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {showHistory ? (
          <BookingHistory 
            bookings={bookings} 
            onClose={handleClose} 
            onCancelBooking={cancelBooking}
          />
        ) : bookingConfirmed && confirmedBooking ? (
          <BookingConfirmation booking={confirmedBooking} onClose={handleClose} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold">Select Date</h2>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow"
                  disabled={(date) => isDateInvalid(date) || isLoading}
                  fromDate={new Date()}
                />
                <p className="text-xs text-gray-500">
                  * Weekend appointments are not available
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold">Select Time</h2>
                </div>
                <Select onValueChange={setTimeSlot} disabled={isLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot, index) => (
                      <SelectItem key={index} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold">Select Doctor</h2>
                </div>
                <Select 
                  value={selectedDoctor} 
                  onValueChange={setSelectedDoctor}
                  disabled={isLoading || !date}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={date ? "Select a doctor" : "Select a date first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDoctors.length > 0 ? (
                      availableDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} ({doctor.specialty})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm p-2 text-gray-500">
                        No doctors available on selected day
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  * A confirmation email will be sent to this address
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}

        <DialogFooter>
          {showHistory || bookingConfirmed ? (
            <Button 
              onClick={handleClose}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
            >
              Close
            </Button>
          ) : (
            <Button
              onClick={handleBooking}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Confirm Appointment'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointment;