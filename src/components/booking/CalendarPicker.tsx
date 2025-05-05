import React from 'react';
import { DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Default style, can customize with Tailwind
import { format } from 'date-fns'; // For formatting dates

interface CalendarPickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  unavailableDays: Date[]; // Dates that cannot be selected
  // Optional: Add bookedDays for different styling if needed
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  unavailableDays,
}) => {
  // Disable past dates and unavailable dates
  const disabledDays = [
    { before: new Date() }, // Disable all past dates
    ...unavailableDays, // Disable specific unavailable dates
  ];

  // Tailwind classes for styling (example)
  const css = `
    .rdp {
      --rdp-cell-size: 40px;
      margin: 1em 0;
    }
    .rdp-caption {
      text-transform: capitalize;
      font-weight: bold;
    }
    .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
      background-color: hsl(35 85% 55%); 
      color: white;
      font-weight: bold;
      border-radius: 50%;
    }
    .rdp-day_disabled {
        text-decoration: line-through;
        opacity: 0.5;
    }
    .rdp-day_today {
      font-weight: bold;
        border: 1px solid #cbd5e1; /* cool-gray-300 */
      border-radius: 50%;
    }
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: #f0f9ff; /* sky-50 */
      border-radius: 50%;
    }
  `;


  return (
    <div>
      <style>{css}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={disabledDays}
        showOutsideDays
        fixedWeeks // Ensures calendar height is consistent
        fromDate={new Date()} // Don't show past months
        footer={selectedDate ? `Selected: ${format(selectedDate, 'PPP')}` : 'Please select a date.'}
      />
    </div>
  );
};