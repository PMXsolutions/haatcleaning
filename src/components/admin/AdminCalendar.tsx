
import type React from "react"
import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import type { BookingRecord } from "@/types"
// import type { DayProps } from "react-day-picker"

interface AdminCalendarControlProps {
  unavailableDates: Date[]
  bookings: BookingRecord[]
  onBlockDates: (dates: Date[]) => Promise<void>
  onFreeDate: (date: Date) => Promise<void>
}

export const AdminCalendarControl: React.FC<AdminCalendarControlProps> = ({
  unavailableDates,
  bookings,
  onBlockDates,
  onFreeDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isBlocking, setIsBlocking] = useState<boolean>(false)
  const [isFreeing, setIsFreeing] = useState<boolean>(false)
  const [selectedDateBookings, setSelectedDateBookings] = useState<BookingRecord[]>([])

  // Update selected date bookings when date is selected
  useEffect(() => {
    if (selectedDate) {
      const bookingsOnDate = bookings.filter(
        (booking) => booking.selectedDate && booking.selectedDate.toDateString() === selectedDate.toDateString(),
      )
      setSelectedDateBookings(bookingsOnDate)
    } else {
      setSelectedDateBookings([])
    }
  }, [selectedDate, bookings])

  // Helper to check if a date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    return unavailableDates.some((unavailableDate) => unavailableDate.toDateString() === date.toDateString())
  }

  // Custom day rendering to show booking counts
  // const renderDay = (day: Date) => {
  //   const bookingCount = bookings.filter(
  //     (booking) => booking.selectedDate && booking.selectedDate.toDateString() === day.toDateString(),
  //   ).length
  //   return (
  //     <div className="relative">
  //       <div>{day.getDate()}</div>
  //       {bookingCount > 0 && (
  //         <div className="absolute bottom-10 right-0 bg-gold text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
  //           {bookingCount}
  //         </div>
  //       )}
  //     </div>
  //   )
  // }

  // const CustomDayRenderer = ({ day, modifiers, ...htmlProps }: DayProps): JSX.Element => {
  //   // day is CalendarDay (which has date), modifiers has boolean states
  //   const currentDate = day.date; // The actual Date object

  //   const bookingCount = bookings.filter(
  //     (booking) => booking.selectedDate && booking.selectedDate.toDateString() === currentDate.toDateString(),
  //   ).length;

  //   // It's crucial to spread htmlProps here, as it contains className, onClick, aria-attributes, etc.
  //   // from react-day-picker.
  //   return (
  //     <div
  //       {...htmlProps} // This applies the necessary classes and attributes for the cell
  //       className={`${htmlProps.className || ""} relative`} // Ensure you combine classes
  //     >
  //       <div>{currentDate.getDate()}</div>
  //       {bookingCount > 0 && (
  //         <div 
  //           className="absolute bg-gold text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
  //           // Adjusted positioning. "bottom-10" seemed very high.
  //           // This positions it at the bottom-right corner of the day cell.
  //           style={{ bottom: '2px', right: '2px' }} 
  //         >
  //           {bookingCount}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };


  // Handle blocking the currently selected date
  const handleBlockSelected = async () => {
    if (!selectedDate) return

    setIsBlocking(true)
    try {
      // Add the selected date to the list if it's not already there
      if (!isDateUnavailable(selectedDate)) {
        await onBlockDates([...unavailableDates, selectedDate])
      }
      setSelectedDate(undefined)
    } catch (error) {
      console.error("Error blocking date:", error)
    } finally {
      setIsBlocking(false)
    }
  }

  // Handle freeing the currently selected date
  const handleFreeSelected = async () => {
    if (!selectedDate) return

    setIsFreeing(true)
    try {
      await onFreeDate(selectedDate)
      setSelectedDate(undefined)
    } catch (error) {
      console.error("Error freeing date:", error)
    } finally {
      setIsFreeing(false)
    }
  }

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
            hasBookings: bookings.map((booking) => booking.selectedDate).filter(Boolean) as Date[],
          }}
          modifiersStyles={{
            unavailable: {
              backgroundColor: " hsl(35 85% 55%)",
              color: "#fff",
              textDecoration: "line-through",
            },
            hasBookings: {
              fontWeight: "bold",
              border: "2px solid hsl(35 85% 55%)",
            },
            selected: {
              borderColor: "hsl(35 85% 55%)",
            },
          }}
          showOutsideDays
          // components={{
          //   Day: CustomDayRenderer,
          // }}
          // components={{
          //   Day: (props: DayProps) => {
          //     return renderDay(props.day.date)
          //   },
          // }}
          classNames={{
            chevron: "fill-amber-500",
            selected: "text-gold font-bold",
            root: 'w-full',
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-medium text-gray-700',
            nav: 'flex items-center',
            nav_button: 'h-6 w-6 bg-white absolute hover:bg-gray-50 rounded-md flex items-center justify-center',
            nav_button_previous: 'left-1',
            nav_button_next: 'right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-gray-500 rounded-md w-8 h-8 font-normal text-[0.8rem]',
            row: 'flex w-full mt-1',
            cell: 'text-gray-600 rounded-md w-8 h-8 flex items-center justify-center text-sm p-0 relative',
            day: 'w-8 h-8 rounded-md hover:bg-gray-100 transition-colors',
            day_selected: '!bg-blue-500 !text-white',
            day_today: 'bg-blue-100 text-blue-700',
            day_disabled: 'text-gray-400 line-through',
            day_outside: 'text-gray-400 opacity-50',
            day_range_middle: 'aria-selected:bg-gray-100 aria-selected:text-gray-700',
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
                  {selectedDateBookings.map((booking) => (
                    <li key={booking.id} className="text-sm">
                      <div className="font-medium">
                        {booking.contactDetails.firstName} {booking.contactDetails.lastName}
                      </div>
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
              <div className="text-sm text-primary italic mb-2">No bookings for this date.</div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleBlockSelected}
            disabled={!selectedDate || isBlocking || (selectedDate && isDateUnavailable(selectedDate))}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBlocking ? "Blocking..." : "Block Date"}
          </button>

          <button
            onClick={handleFreeSelected}
            disabled={!selectedDate || isFreeing || (selectedDate && !isDateUnavailable(selectedDate))}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFreeing ? "Freeing..." : "Free Date"}
          </button>
        </div>
      </div>
    </div>
  )
}
