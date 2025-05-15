import { useState, useEffect, useCallback} from 'react';
import {
  BookingData, PropertyInfo, Frequency, SelectedExtra,
  ContactDetails, AddressDetails, ExtraService
} from '@/types';
import {
  fetchUnavailableDates, submitBooking, getAvailableExtras
} from '@/services/bookingService'; 

import { PropertyDetails } from '@/components/booking/PropertyDetails';
import { FrequencySelector } from '@/components/booking/FrequencySelector';
import { CalendarPicker } from '@/components/booking/CalendarPicker';
import { ExtraServices } from '@/components/booking/ExtraServices';
import { AmountSummary } from '@/components/booking/AmountSummary';
import { ContactInfo } from '@/components/booking/ContactInfo';
import { AddressInfo } from '@/components/booking/AddressInfo';

type BookingFormErrors = Partial<
  Record<keyof ContactDetails | keyof AddressDetails | 'selectedDate' | 'form', string>
>;

const initialBookingData: BookingData = {
  propertyInfo: { bedrooms: 1, bathrooms: 1 },
  frequency: 'one-time',
  selectedDate: undefined,
  selectedExtras: [],
  contactDetails: { firstName: '', lastName: '', email: '', phone: '' },
  addressDetails: { street: '', city: '', zipCode: '' },
};

export const BookingPage: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [availableExtras, setAvailableExtras] = useState<ExtraService[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [errors, setErrors] = useState<BookingFormErrors>({});

  // Fetch initial data (unavailable dates, available extras)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingDates(true);
      try {
        const dates = await fetchUnavailableDates();
        setUnavailableDates(dates);
        const extras = getAvailableExtras(); // Get from service
        setAvailableExtras(extras);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        // Handle error display
      } finally {
        setIsLoadingDates(false);
      }
    };
    loadInitialData();
  }, []);

  const validateForm = (data: BookingData): BookingFormErrors => {
    const newErrors: BookingFormErrors = {};

    // Date
    if (!data.selectedDate) {
        newErrors.selectedDate = 'Please select a service date.';
    }

    // Contact Info
    if (!data.contactDetails.firstName.trim()) {
        newErrors.firstName = 'First name is required.';
    }
    if (!data.contactDetails.lastName.trim()) {
        newErrors.lastName = 'Last name is required.';
    }
    if (!data.contactDetails.email.trim()) {
        newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(data.contactDetails.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }
    if (!data.contactDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10,15}$/.test(data.contactDetails.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number.';
    }

    // Address Info
    if (!data.addressDetails.street.trim()) {
        newErrors.street = 'Street address is required.';
    }
    if (!data.addressDetails.city.trim()) {
        newErrors.city = 'City is required.';
    }
    if (!data.addressDetails.zipCode.trim()) {
        newErrors.zipCode = 'ZIP / Postal code is required.';
    } 

    return newErrors;
};

  // --- Update Handlers ---
  // Use useCallback to prevent unnecessary re-renders of child components if needed
  const handlePropertyChange = useCallback((propertyInfo: PropertyInfo) => {
    setBookingData(prev => ({ ...prev, propertyInfo }));
  }, []);

  const handleFrequencyChange = useCallback((frequency: Frequency) => {
    setBookingData(prev => ({ ...prev, frequency }));
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setBookingData(prev => ({ ...prev, selectedDate: date }));
    if (date) { 
      setErrors(prev => ({ ...prev, selectedDate: undefined }));
    }
  }, []);

  const handleExtrasChange = useCallback((selectedExtras: SelectedExtra[]) => {
    setBookingData(prev => ({ ...prev, selectedExtras }));
  }, []);

  const handleContactChange = useCallback((contactDetails: ContactDetails) => {
    setBookingData(prev => ({ ...prev, contactDetails }));
    setErrors(prev => ({
      ...prev,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
    }));
  }, []);

  const handleAddressChange = useCallback((addressDetails: AddressDetails) => {
    setBookingData(prev => ({ ...prev, addressDetails }));
    // Clear errors for all address fields
    setErrors(prev => ({
      ...prev,
      street: undefined,
      city: undefined,
      zipCode: undefined,
    }));
  }, []);

  const handleProceedToPayment = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');
    setErrors({});

    const validationErrors = validateForm(bookingData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setSubmitMessage('Please fix the errors above.');
        // setIsSubmitting(false)
        return; // Stop submission
      }
  
    try {
      const result = await submitBooking(bookingData);
  
      if (result.success) {
        setSubmitMessage('Booking successful!');
        
        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('localBookings') || '[]');
        localStorage.setItem('localBookings', JSON.stringify([...existing, {
          ...bookingData,
          id: result.bookingId || Date.now().toString(), // Fallback to timestamp
          paymentStatus: 'pending',
          bookingTimestamp: Date.now(),
        }]));
  
        // Optionally reset form
        setBookingData(initialBookingData);
      } else {
        setSubmitMessage('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission failed:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // const handleProceedToPayment = async () => {
  //   setSubmitMessage('');
  //   setErrors({}); 

  //   const validationErrors = validateForm(bookingData);
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     setSubmitMessage('Please fix the errors above.');
  //     return; // Stop submission
  //   }

  //   setIsSubmitting(true);
  //   // setSubmitMessage('');
  //   try {
  //     // ** API Integration Point **
  //     const result = await submitBooking(bookingData);
  //     if (result.success) {
  //       setSubmitMessage(`Booking successful! ID: ${result.bookingId}. Proceeding to payment...`);
  //       // TODO: Redirect to payment page (or show payment modal)
  //       // For now, just log and maybe reset the form
  //       console.log('Booking submitted:', bookingData);
  //       console.log('Would navigate to payment page now.');
  //         // Optionally reset form: setBookingData(initialBookingData);
  //     } else {
  //       setSubmitMessage(result.message || 'Booking failed. Please try again.');
  //       setErrors({ form: result.message || 'Submission failed.' });
  //     }
  //   } catch (error) {
  //     console.error("Booking submission error:", error);
  //     setSubmitMessage('An error occurred during submission.');
  //     setErrors({ form: 'An error occurred during submission.' });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-6xl text-primary font-heading font-bold text-center mb-8">Book Your Appointment</h1>

      {/* Display General/Form Errors */}
      {errors.form && (
        <div className="bg-red-100 border font-text border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errors.form}</span>
        </div>
      )}

      <div className="md:grid md:grid-cols-3 md:gap-8">
        {/* Booking Form */}
        <div className="md:col-span-2 space-y-8 mb-8 md:mb-0 font-text text-primary">
          <PropertyDetails value={bookingData.propertyInfo} onChange={handlePropertyChange} />
          <FrequencySelector value={bookingData.frequency} onChange={handleFrequencyChange} />

          <section>
            <h2 className="text-xl font-semibold mb-3">Select Date</h2>
            {isLoadingDates ? (
              <p>Loading available dates...</p>
            ) : (
              <CalendarPicker
                selectedDate={bookingData.selectedDate}
                onDateSelect={handleDateSelect}
                unavailableDays={unavailableDates}
              />
            )}
            {/* Display Date Error */}
            {errors.selectedDate && <p className="mt-2 text-sm text-red-600">{errors.selectedDate}</p>}
          </section>

          <ExtraServices
            availableExtras={availableExtras}
            selectedExtras={bookingData.selectedExtras}
            onChange={handleExtrasChange}
          />

          <ContactInfo
            value={bookingData.contactDetails}
            onChange={handleContactChange}
            // errors={getErrorsForComponent(['firstName', 'lastName', 'email', 'phone'])} // Option 1: Pass errors obj
            errors={errors}
          />
          <AddressInfo 
            value={bookingData.addressDetails} 
            onChange={handleAddressChange} 
            errors={errors} 
          />

          {submitMessage && !errors.form && ( 
            <p className={`text-center p-3 rounded text-sm ${
              submitMessage.includes('successful') ? 'bg-green-100 text-green-800' :
              submitMessage.includes('fix the errors') ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
              }`}>
              {submitMessage}
            </p>
            )}

          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={isLoadingDates}
            // disabled={isSubmitting || isLoadingDates}
            className="w-full bg-gold text-white cursor-pointer font-bold py-3 px-6 rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submit Again' : 'Proceed to Payment'}
          </button>
        </div>

        {/* Right Column (Sticky Summary) */}
        <div className="md:col-span-1">
          <AmountSummary bookingData={bookingData} />
        </div>

      </div>
    </div>
  );
};