import React, { useEffect, useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { apiService } from '@/api/services';
import { Cleaner } from '@/api/types';
import { Modal } from '@/components/shared/Modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/shared/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required')
});

// FIX: Infer the form data type from the yup schema
type CleanerFormData = yup.InferType<typeof validationSchema>;

interface AssignedBooking {
  assignedCleanerId?: string;
}

const ITEMS_PER_PAGE = 10;

const Cleaners: React.FC = () => {
  const { user } = useAuth();
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'firstName' | 'email' | 'status'>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [assignedMap, setAssignedMap] = useState<Record<string, number>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'available'>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState<Cleaner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIX: Use the inferred type in useForm
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CleanerFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    }
  });

  const fetchCleaners = async () => {
    try {
      const cleanersData = await apiService.getAllCleaners();
      setCleaners(cleanersData);
    } catch (err: unknown) { // FIX: Changed from 'any' to 'unknown'
      const error = err as { response?: { status: number }; message?: string }; // Type assertion for safety
      const msg = error?.response?.status === 404
        ? 'Cleaners endpoint not found (404). Check route casing, auth, or environment.'
        : error?.message || 'Failed to fetch cleaners.';
      // toast.error(msg);
      console.error('Error fetching cleaners:', msg);
      if (typeof err === 'object' && err !== null && 'response' in err) {
        console.error('Cleaners load failed:', err.response);
      } else {
        console.error('Cleaners load failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCleaners();
      try {
        const assigned = await apiService.getAllAssignedBookings();
        const counts: Record<string, number> = {};
        // FIX: Use the new AssignedBooking interface
        (assigned || []).forEach((bk: AssignedBooking) => {
          if (bk.assignedCleanerId) {
            counts[bk.assignedCleanerId] = (counts[bk.assignedCleanerId] || 0) + 1;
          }
        });
        setAssignedMap(counts);
      } catch (e) {
        console.error('Failed to fetch assigned bookings:', e);
      }
    })();
  }, []);

  const filteredCleaners = cleaners
    .filter(cleaner =>
      cleaner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cleaner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cleaner.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(c => {
      if (filterStatus === 'all') return true;
      const assignedCount = assignedMap[c.userId || c.id] || 0;
      return filterStatus === 'assigned' ? assignedCount > 0 : assignedCount === 0;
    })
    .sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (sortField === 'firstName') {
        aValue = a.firstName.toLowerCase();
        bValue = b.firstName.toLowerCase();
      } else if (sortField === 'email') {
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
      } else {
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
      }

      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const paginatedCleaners = filteredCleaners.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: 'firstName' | 'email' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // FIX: Update the onSubmit function to accept the form data type
  const onSubmit = async (data: CleanerFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedCleaner) {
        toast('Edit functionality not yet implemented');
      } else {
        if (!user?.userId) {
          // toast.error('Unable to add cleaner: Admin user not found. Please log in again.');
          console.error('Admin user not found:', user);
          return;
        }

        const adminUserId = user.userId;
        
        await apiService.addUser(data, adminUserId);
        toast.success('Cleaner added successfully! Login credentials will be sent to their email.');
        
        fetchCleaners(); // Refetch cleaners to update the list
        setIsAddModalOpen(false);
        reset();
      }
    } catch (err: unknown) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error object:', err);
      
      const errorMessage = 'Failed to save cleaner. The email might already be in use.';
      
      // toast.error(errorMessage);
      console.error('Error during cleaner submission:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    toast('Delete cleaner: to be implemented once endpoint is provided.');
    setIsDeleteDialogOpen(false);
    setSelectedCleaner(null);
  };

  const SortIcon = ({ field }: { field: 'firstName' | 'email' | 'status' }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? <FiChevronUp className="w-4 h-4 text-gray-600" /> : <FiChevronDown className="w-4 h-4 text-gray-600" />;
  };

  if (!user) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-600">Please log in to manage cleaners.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cleaners</h1>
            <p className="text-gray-600 mt-1">Manage your cleaning staff and their assignments.</p>
          </div>
          <Button
            label="Add Cleaner"
            variant="primary"
            icon={<FiPlus />}
            onClick={() => {
              reset(); // Clear form before opening
              setIsAddModalOpen(true);
            }}
            className="w-full md:w-auto"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cleaners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="min-w-[180px]">
              <Select value={filterStatus} onValueChange={(v: 'all' | 'assigned' | 'available') => setFilterStatus(v)}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Filter cleaners" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Cleaners</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <button onClick={() => handleSort('firstName')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Name
                      <SortIcon field="firstName" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => handleSort('email')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Email
                      <SortIcon field="email" />
                    </button>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-sm font-medium text-gray-900'>Phone</TableCell>
                  {/* <TableCell className="hidden sm:table-cell text-sm font-medium text-gray-900 text-center">Assigned</TableCell> */}
                  <TableCell className="text-sm font-medium text-gray-900 text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow key="loading">
                    <TableCell colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</TableCell>
                  </TableRow>
                ) : paginatedCleaners.length === 0 ? (
                  <TableRow key="no-cleaners">
                    <TableCell colSpan={5} className="px-6 py-8 text-center text-gray-500">No cleaners found.</TableCell>
                  </TableRow>
                ) : (
                  paginatedCleaners.map((cleaner) => (
                    <TableRow key={`cleaner-${cleaner.id || cleaner.userId}`} className="hover:bg-gray-50">
                      <TableCell className="p-2 text-sm font-medium text-gray-900">
                        {cleaner.firstName} {cleaner.lastName}
                      </TableCell>
                      <TableCell className="p-2 text-sm text-gray-600">{cleaner.email}</TableCell>
                      <TableCell className="p-2 hidden sm:table-cell text-sm text-gray-600">{cleaner.phoneNumber}</TableCell>
                      {/* <TableCell className="p-2 hidden sm:table-cell text-sm text-gray-600 text-center">
                        {assignedMap[cleaner.userId || cleaner.id] || 0}
                      </TableCell> */}
                      <TableCell className="p-2 text-right">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedCleaner(cleaner);
                              reset({
                                firstName: cleaner.firstName,
                                lastName: cleaner.lastName,
                                email: cleaner.email,
                                phoneNumber: cleaner.phoneNumber,
                                password: '',
                                confirmPassword: ''
                              });
                              setIsEditModalOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                          >
                            <FiEdit2 className="w-3 h-3 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => { setSelectedCleaner(cleaner); setIsDeleteDialogOpen(true); }}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                          >
                            <FiTrash2 className="w-3 h-3 mr-1" /> Remove
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 flex items-center justify-between border-t border-gray-200">
            <Button
              label="Previous"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(filteredCleaners.length / ITEMS_PER_PAGE)}
            </span>
            <Button
              label="Next"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= filteredCleaners.length}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          reset();
          setSelectedCleaner(null);
        }}
        title={isEditModalOpen ? 'Edit Cleaner' : 'Add New Cleaner'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                {...register('firstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                {...register('lastName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              {...register('phoneNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                autoComplete='new-password'
                {...register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                autoComplete='new-password'
                {...register('confirmPassword')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-600 text-sm">
                <strong>Note:</strong> Login credentials will be automatically sent to the cleaner's email address after account creation.
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              label={isSubmitting ? 'Saving...' : (isEditModalOpen ? 'Save Changes' : 'Add Cleaner')}
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedCleaner(null); }}
        onConfirm={handleDelete}
        title="Remove Cleaner"
        message={`Are you sure you want to remove "${selectedCleaner?.firstName} ${selectedCleaner?.lastName}"? This action cannot be undone.`}
        confirmText="Remove"
        isLoading={isSubmitting}
        type="danger"
      />
    </div>
  );
};

export default Cleaners;