import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; 
import { format } from 'date-fns';

interface CalendarPickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  unavailableDays: Date[]; 
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  unavailableDays,
}) => {
  // Disable past dates and unavailable dates
  const disabledDays = [
    { before: new Date() },
    ...unavailableDays,
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={disabledDays}
        showOutsideDays
        fixedWeeks
        fromDate={new Date()}
        modifiersClassNames={{
          selected: '!bg-amber-500 !text-white font-medium',
          disabled: '!text-gray-400 !line-through',
          today: '!border-blue-200 !font-bold'
        }}
        footer={selectedDate ? (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            Selected: <span className="text-gold">{format(selectedDate, 'PPP')}</span>
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-gray-500">
            Please select a date
          </p>
        )}
        classNames={{
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
  );
};