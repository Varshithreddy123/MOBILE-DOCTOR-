import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../dialog";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const BookAppointment = () => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

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
    return true;
  }, [date, timeSlot, name, email]);

  const isDateInvalid = useCallback((dateToCheck) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateToCheck < today) return true;
    const day = dateToCheck.getDay();
    return day === 0 || day === 6;
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

  // Load saved form data from localStorage on component mount
  useEffect(() => {
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
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = { name, email, phone };
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
  }, [name, email, phone]);

  const handleBooking = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isDateInvalid(date)) {
        throw new Error('Please select a valid weekday in the future');
      }

      const bookingReference = `REF-${Date.now().toString().slice(-6)}`;
      const formattedDate = formatDate(date);

      // Create booking data object
      const bookingData = {
        date: formattedDate,
        timeSlot,
        name,
        email,
        phone: phone || 'Not provided',
        status: 'Pending',
        bookingReference,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (for history)
      const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      const updatedHistory = [bookingData, ...bookingHistory.slice(0, 9)]; // Keep last 10 bookings
      localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory));

      // First save the booking to your database
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      // Check if response is JSON before parsing
      const contentType = bookingResponse.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await bookingResponse.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an unexpected response');
      }

      const bookingResult = await bookingResponse.json();
      
      if (!bookingResponse.ok) {
        throw new Error(bookingResult.error || bookingResult.message || 'Failed to save booking');
      }

      // Then send confirmation email
      const emailResponse = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          from: 'DocApp <onboarding@resend.dev>',
          subject: `Appointment Confirmation - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #2563eb; text-align: center;">Your appointment has been confirmed!</h2>
              <div style="margin-top: 20px;">
                <p><strong style="color: #4b5563;">Name:</strong> ${name}</p>
                <p><strong style="color: #4b5563;">Email:</strong> ${email}</p>
                <p><strong style="color: #4b5563;">Phone:</strong> ${phone || 'Not provided'}</p>
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
        const errorData = await emailResponse.json();
        throw new Error(errorData.message || 'Failed to send confirmation email');
      }

      toast.success('Appointment booked successfully! Confirmation sent to your email.');
      setOpen(false);
      
      // Reset form but keep email for future bookings
      setName('');
      setPhone('');
      setTimeSlot('');
      setDate(new Date());
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  }, [date, timeSlot, name, email, phone, validateForm, isDateInvalid, formatDate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md">
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Confirm Your Appointment</DialogTitle>
          <DialogDescription className="text-gray-600">
            Please select a date, time, and provide your details to book your appointment.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
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

        <div className="flex justify-end mt-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointment;