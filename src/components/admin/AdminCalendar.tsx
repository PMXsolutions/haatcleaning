import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { BookingRecord } from '@/types';

interface AdminCalendarControlProps {
  unavailableDates: Date[];
  bookings: BookingRecord[];
  onBlockDates: (dates: Date[]) => Promise<void>;
  onFreeDate: (date: Date) => Promise<void>;
}

export const AdminCalendarControl: React.FC<AdminCalendarControlProps> = ({
  unavailableDates,
  bookings,
  onBlockDates,
  onFreeDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [isFreeing, setIsFreeing] = useState<boolean>(false);
  const [selectedDateBookings, setSelectedDateBookings] = useState<BookingRecord[]>([]);

  // Update selected date bookings when date is selected
  useEffect(() => {
    if (selectedDate) {
      const bookingsOnDate = bookings.filter(booking =>
        booking.selectedDate &&
        booking.selectedDate.toDateString() === selectedDate.toDateString()
      );
      setSelectedDateBookings(bookingsOnDate);
    } else {
      setSelectedDateBookings([]);
    }
  }, [selectedDate, bookings]);

  // Helper to check if a date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    return unavailableDates.some(unavailableDate =>
      unavailableDate.toDateString() === date.toDateString()
    );
  };

  // Custom day rendering to show booking counts
  const renderDay = (day: Date) => {
    const bookingCount = bookings.filter(booking =>
      booking.selectedDate && booking.selectedDate.toDateString() === day.toDateString()
    ).length;
    return (
      <div className="relative">
        <div>{day.getDate()}</div>
        {bookingCount > 0 && (
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {bookingCount}
          </div>
        )}
      </div>
    );
  };

  // Handle blocking the currently selected date
  const handleBlockSelected = async () => {
    if (!selectedDate) return;

    setIsBlocking(true);
    try {
      // Add the selected date to the list if it's not already there
      if (!isDateUnavailable(selectedDate)) {
        await onBlockDates([...unavailableDates, selectedDate]);
      }
      setSelectedDate(null);
    } catch (error) {
      console.error("Error blocking date:", error);
    } finally {
      setIsBlocking(false);
    }
  };

  // Handle freeing the currently selected date
  const handleFreeSelected = async () => {
    if (!selectedDate) return;

    setIsFreeing(true);
    try {
      await onFreeDate(selectedDate);
      setSelectedDate(null);
    } catch (error) {
      console.error("Error freeing date:", error);
    } finally {
      setIsFreeing(false);
    }
  };

  // day picker props
  // const dayPickerProps = {
  //   mode: 'single',
  //   selected: selectedDate,
  //   onSelect: setSelectedDate,
  //   fromDate: new Date(), // Can't select dates in the past
  //   modifiers: {
  //     unavailable: unavailableDates,
  //     hasBookings: bookings.map(booking => booking.selectedDate).filter(Boolean) as Date[]
  //   },
  //   modifiersStyles: {
  //     unavailable: {
  //       backgroundColor: 'rgba(255, 0, 0, 0.1)',
  //       color: '#d32f2f',
  //       textDecoration: 'line-through'
  //     },
  //     hasBookings: {
  //       fontWeight: 'bold',
  //       border: '2px solid #4299e1'
  //     }
  //   },
  //   // components: {
  //   //   Day: ({ day, modifiers }: { day: Date; modifiers: any }) => renderDay(day)
  //   // }
  // };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        fromDate={new Date()}
        modifiers={{
          unavailable: unavailableDates,
          hasBookings: bookings.map(booking => booking.selectedDate).filter(Boolean) as Date[],
        }}
        modifiersStyles={{
          unavailable: {
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: '#d32f2f',
            textDecoration: 'line-through',
          },
          hasBookings: {
            fontWeight: 'bold',
            border: '2px solid hsl(35 85% 55%)',
          },
        }}
          showOutsideDays
          render={{
            day: (date) => renderDay(date),
          }}
        />
      </div>

      <div className="mt-4">
        {selectedDate && (
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Selected: {selectedDate.toLocaleDateString()}
            </div>

            {selectedDateBookings.length > 0 ? (
              <div className="border rounded p-3 bg-blue-50">
                <h4 className="font-semibold mb-2">Bookings on this date:</h4>
                <ul className="space-y-2 text-primary">
                  {selectedDateBookings.map(booking => (
                    <li key={booking.id} className="text-sm">
                      <div className="font-medium">{booking.contactDetails.firstName} {booking.contactDetails.lastName}</div>
                      <div className="">
                        {booking.propertyInfo.bedrooms} bed, {booking.propertyInfo.bathrooms} bath
                        {booking.selectedExtras?.length > 0 && ` • ${booking.selectedExtras.length} extra service(s)`}
                      </div>
                      <div className="">
                        {booking.addressDetails.street}, {booking.addressDetails.city}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-sm text-primary italic mb-2">
                No bookings for this date.
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleBlockSelected}
            disabled={!selectedDate || isBlocking || isDateUnavailable(selectedDate)}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBlocking ? 'Blocking...' : 'Block Date'}
          </button>

          <button
            onClick={handleFreeSelected}
            disabled={!selectedDate || isFreeing || !isDateUnavailable(selectedDate)}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFreeing ? 'Freeing...' : 'Free Date'}
          </button>
        </div>
      </div>
    </div>
  );
};
