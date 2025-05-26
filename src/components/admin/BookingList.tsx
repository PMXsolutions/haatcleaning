import React, { useState } from 'react';
import { BookingRecord } from '@/types';
import { getAvailableExtras } from '@/services/bookingService';
import { FaEdit, FaEye, FaEyeSlash, FaSave, FaClock } from "react-icons/fa";
import { MdOutlineRadioButtonChecked, MdOutlineCancel } from "react-icons/md";
import { FaRegCircleXmark } from "react-icons/fa6";

interface BookingListProps {
  bookings: BookingRecord[];
  onConfirmPayment: (bookingId: string) => Promise<void>;
  onCancelBooking?: (bookingId: string) => Promise<void>;
  onModifyBooking?: (bookingId: string, updates: Partial<BookingRecord>) => Promise<void>;
}

export const BookingList: React.FC<BookingListProps> = ({ 
  bookings, 
  onConfirmPayment,
  onCancelBooking,
  onModifyBooking
}) => {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BookingRecord>>({});
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const availableExtras = getAvailableExtras();

  const toggleDetails = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  // const toggleEdit = (bookingId: string) => {
  //   setEditingBooking(editingBooking === bookingId ? null : bookingId);
  // };

  const toggleEdit = (bookingId: string) => {
    if (editingBooking === bookingId) {
      setEditingBooking(null);
      setEditForm({});
    } else {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        setEditingBooking(bookingId);
        setEditForm({
          contactDetails: { ...booking.contactDetails },
          propertyInfo: { ...booking.propertyInfo },
          addressDetails: { ...booking.addressDetails },
          frequency: booking.frequency,
          selectedDate: booking.selectedDate
        });
      }
    }
  };

  const handleEditChange = (field: string, value: unknown, subField?: string) => {
    setEditForm(prev => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...((prev[field as keyof BookingRecord] as object) || {}),
            [subField]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSaveEdit = async (bookingId: string) => {
    if (!onModifyBooking) return;
    
    setIsLoading(bookingId);
    try {
      await onModifyBooking(bookingId, editForm);
      setEditingBooking(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleAction = async (action: () => Promise<void>, bookingId: string) => {
    setIsLoading(bookingId);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No bookings found.</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-white rounded-lg shadow border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{booking.id.slice(-8)}</div>
                      <div className="text-sm text-gray-500">
                        {booking.propertyInfo.bedrooms}BR/{booking.propertyInfo.bathrooms}BA
                      </div>
                      <div className="text-xs text-gray-400">{booking.frequency}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {booking.contactDetails.firstName} {booking.contactDetails.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{booking.contactDetails.email}</div>
                      <div className="text-xs text-gray-400">{booking.contactDetails.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.selectedDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Booked: {new Date(booking.bookingTimestamp).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.paymentStatus || 'unknown')}`}>
                      {booking.paymentStatus || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleDetails(booking.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title={expandedBooking === booking.id ? 'Hide Details' : 'View Details'}
                      >
                        {expandedBooking === booking.id ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                      </button>
                      
                      {booking.paymentStatus !== 'confirmed' && (
                        <button
                          onClick={() => onConfirmPayment(booking.id)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Confirm Payment"
                        >
                          <MdOutlineRadioButtonChecked className="h-4 w-4" />
                        </button>
                      )}
                      
                      {onModifyBooking && (
                        <button
                          onClick={() => toggleEdit(booking.id)}
                          className="text-orange-600 hover:text-orange-900 transition-colors"
                          title="Edit Booking"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      
                      {onCancelBooking && booking.paymentStatus !== 'confirmed' && (
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Cancel Booking"
                        >
                          <FaRegCircleXmark className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                
                {expandedBooking === booking.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      {editingBooking === booking.id ? (
                        // Edit Form
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Booking #{booking.id.slice(-8)}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Property Details */}
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-3">Property Details</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Bedrooms</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={editForm.propertyInfo?.bedrooms || ''}
                                    onChange={(e) => handleEditChange('propertyInfo', parseInt(e.target.value) || 1, 'bedrooms')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Bathrooms</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={editForm.propertyInfo?.bathrooms || ''}
                                    onChange={(e) => handleEditChange('propertyInfo', parseInt(e.target.value) || 1, 'bathrooms')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Frequency</label>
                                  <select
                                    value={editForm.frequency || ''}
                                    onChange={(e) => handleEditChange('frequency', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="weekly">Weekly</option>
                                    <option value="bi-weekly">Bi-weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="one-time">One-time</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            
                            {/* Contact Information */}
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-3">Contact Information</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                                  <input
                                    type="text"
                                    value={editForm.contactDetails?.firstName || ''}
                                    onChange={(e) => handleEditChange('contactDetails', e.target.value, 'firstName')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                                  <input
                                    type="text"
                                    value={editForm.contactDetails?.lastName || ''}
                                    onChange={(e) => handleEditChange('contactDetails', e.target.value, 'lastName')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                  <input
                                    type="email"
                                    value={editForm.contactDetails?.email || ''}
                                    onChange={(e) => handleEditChange('contactDetails', e.target.value, 'email')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                  <input
                                    type="tel"
                                    value={editForm.contactDetails?.phone || ''}
                                    onChange={(e) => handleEditChange('contactDetails', e.target.value, 'phone')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Service Address */}
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-3">Service Address</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">Street</label>
                                  <input
                                    type="text"
                                    value={editForm.addressDetails?.street || ''}
                                    onChange={(e) => handleEditChange('addressDetails', e.target.value, 'street')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                                  <input
                                    type="text"
                                    value={editForm.addressDetails?.city || ''}
                                    onChange={(e) => handleEditChange('addressDetails', e.target.value, 'city')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">ZIP Code</label>
                                  <input
                                    type="text"
                                    value={editForm.addressDetails?.zipCode || ''}
                                    onChange={(e) => handleEditChange('addressDetails', e.target.value, 'zipCode')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => toggleEdit(booking.id)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <MdOutlineCancel className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(booking.id)}
                              disabled={isLoading === booking.id}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              {isLoading === booking.id ? (
                                <FaClock className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <FaSave className="h-4 w-4 mr-1" />
                              )}
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Details
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Property Details</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Bedrooms:</span> {booking.propertyInfo.bedrooms}</p>
                              <p><span className="font-medium">Bathrooms:</span> {booking.propertyInfo.bathrooms}</p>
                              <p><span className="font-medium">Frequency:</span> {booking.frequency}</p>
                              <p><span className="font-medium">Booking Date:</span> {new Date(booking.bookingTimestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Contact Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Name:</span> {booking.contactDetails.firstName} {booking.contactDetails.lastName}</p>
                              <p><span className="font-medium">Email:</span> {booking.contactDetails.email}</p>
                              <p><span className="font-medium">Phone:</span> {booking.contactDetails.phone}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Service Address</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Street:</span> {booking.addressDetails.street}</p>
                              <p><span className="font-medium">City:</span> {booking.addressDetails.city}</p>
                              <p><span className="font-medium">ZIP Code:</span> {booking.addressDetails.zipCode}</p>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 lg:col-span-1">
                            <h4 className="font-semibold text-gray-700 mb-3">Additional Services</h4>
                            {booking.selectedExtras && booking.selectedExtras.length > 0 ? (
                              <ul className="space-y-1 text-sm">
                                {booking.selectedExtras.map((extra, index) => {
                                  const extraInfo = availableExtras.find(e => e.id === extra.id);
                                  return (
                                    <li key={index} className="flex justify-between">
                                      <span>
                                        {extraInfo?.name || extra.id} 
                                        {extra.quantity > 1 ? ` (${extra.quantity})` : ''}
                                      </span>
                                      <span className="font-medium">
                                        ${extraInfo ? extraInfo.price * extra.quantity : '?'}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No additional services selected</p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Quick Actions - Only show when not editing */}
                      {editingBooking !== booking.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {booking.paymentStatus !== 'confirmed' && (
                              <button
                                onClick={() => handleAction(() => onConfirmPayment(booking.id), booking.id)}
                                disabled={isLoading === booking.id}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                              >
                                {isLoading === booking.id ? (
                                  <FaClock className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <MdOutlineRadioButtonChecked className="h-4 w-4 mr-1" />
                                )}
                                Confirm Payment
                              </button>
                            )}
                            
                            {onModifyBooking && (
                              <button
                                onClick={() => toggleEdit(booking.id)}
                                disabled={isLoading === booking.id}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                              >
                                <FaEdit className="h-4 w-4 mr-1" />
                                Edit Details
                              </button>
                            )}
                            
                            {onCancelBooking && booking.paymentStatus !== 'confirmed' && (
                              <button
                                onClick={() => handleAction(() => onCancelBooking(booking.id), booking.id)}
                                disabled={isLoading === booking.id}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                              >
                                <FaRegCircleXmark className="h-4 w-4 mr-1" />
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}