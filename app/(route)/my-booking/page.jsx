"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipboardList, Clock, CalendarCheck, XCircle, FileText, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyBookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { tags: ['bookinglist'] }
      });

      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      setBookings(data);
      localStorage.setItem('bookingHistory', JSON.stringify(data));
    } catch (error) {
      console.error('Error:', error);
      const savedBookings = localStorage.getItem('bookingHistory');
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
        toast.warning('Showing cached data');
      } else {
        toast.error('Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBookings();
    const handleStorageChange = () => {
      const savedBookings = localStorage.getItem('bookingHistory');
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Cancellation failed');
      
      // Update local state immediately for better UX
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      );
      
      setBookings(updatedBookings);
      localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));
      
      // Refresh data from server
      await fetchBookings();
      
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel appointment');
      
      // Local fallback if API fails
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      );
      setBookings(updatedBookings);
      localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings by status
  const filterBookings = (statusFilter) => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      
      if (statusFilter === 'upcoming') {
        return booking.status === 'confirmed' && bookingDate >= now;
      } else if (statusFilter === 'past') {
        return booking.status === 'confirmed' && bookingDate < now;
      } else if (statusFilter === 'cancelled') {
        return booking.status === 'cancelled';
      }
      return false;
    });
  };

  // Format date display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Booking Details Component
  const BookingDetails = ({ booking, onClose, onCancel }) => (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Booking Details</h2>
        <Button onClick={onClose} variant="ghost">Close</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Reference</p>
          <p className="font-medium">{booking.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium capitalize">{booking.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{formatDate(booking.date)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time</p>
          <p className="font-medium">{booking.time}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Doctor</p>
          <p className="font-medium">{booking.doctorName}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button 
          onClick={() => {
            const content = `Booking Details\n\n${JSON.stringify(booking, null, 2)}`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `booking-${booking.id}.txt`;
            a.click();
          }}
          variant="outline"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export
        </Button>
        {booking.status === 'confirmed' && (
          <Button 
            onClick={() => {
              onCancel(booking.id);
              onClose();
            }}
            variant="destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Appointment
          </Button>
        )}
      </div>
    </div>
  );

  // Booking List Component
  const BookingList = ({ bookings, onSelect, onCancel }) => (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={booking.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{formatDate(booking.date)} at {booking.time}</h3>
              <p className="text-sm text-gray-500">Dr. {booking.doctorName}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.status}
            </span>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              onClick={() => onSelect(booking)}
              variant="outline"
              size="sm"
            >
              Details
            </Button>
            {booking.status === 'confirmed' && (
              <Button 
                onClick={() => onCancel(booking.id)}
                variant="destructive"
                size="sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Empty State Component
  const EmptyState = ({ message }) => (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">{message}</p>
      <Button onClick={() => router.push('/book-appointment')}>
        Book New Appointment
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <ClipboardList className="mr-2" />
          Your Booking History
        </h1>
        <Button 
          onClick={fetchBookings}
          variant="outline"
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            <Clock className="mr-2 h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Past
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            <XCircle className="mr-2 h-4 w-4" />
            Cancelled
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedBooking ? (
            <BookingDetails 
              booking={selectedBooking} 
              onClose={() => setSelectedBooking(null)}
              onCancel={handleCancelBooking}
            />
          ) : filterBookings('upcoming').length === 0 ? (
            <EmptyState message="You have no upcoming appointments" />
          ) : (
            <BookingList 
              bookings={filterBookings('upcoming')} 
              onSelect={setSelectedBooking}
              onCancel={handleCancelBooking}
            />
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedBooking ? (
            <BookingDetails 
              booking={selectedBooking} 
              onClose={() => setSelectedBooking(null)}
              onCancel={handleCancelBooking}
            />
          ) : filterBookings('past').length === 0 ? (
            <EmptyState message="You have no past appointments" />
          ) : (
            <BookingList 
              bookings={filterBookings('past')} 
              onSelect={setSelectedBooking}
              onCancel={handleCancelBooking}
            />
          )}
        </TabsContent>
        
        <TabsContent value="cancelled">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedBooking ? (
            <BookingDetails 
              booking={selectedBooking} 
              onClose={() => setSelectedBooking(null)}
              onCancel={handleCancelBooking}
            />
          ) : filterBookings('cancelled').length === 0 ? (
            <EmptyState message="You have no cancelled appointments" />
          ) : (
            <BookingList 
              bookings={filterBookings('cancelled')} 
              onSelect={setSelectedBooking}
              onCancel={handleCancelBooking}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}