import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../dialog";  // Adjust the path as needed
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar';

const BookAppointment = () => {
    const [date, setDate] = React.useState(new Date());
  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded-md">Book Appointment</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Appointment</DialogTitle>
          <DialogDescription>
           <div>
              <div className-='grid grid-cols-2'>
                {/*Calender */}
                <div>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow"
                 />
                </div>

                {/*Time Slot */}
              </div>
           </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointment;