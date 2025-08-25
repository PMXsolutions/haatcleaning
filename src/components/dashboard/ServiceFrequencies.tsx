import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { apiService } from '@/api/services';
import { ServiceFrequency } from '@/api/types';
import { Modal } from '@/components/shared/Modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/shared/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  frequency: yup.string().required('Frequency name is required').min(2, 'Frequency name must be at least 2 characters'),
  discountPercentage: yup.number().typeError('Discount must be a number').min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%').required('Discount percentage is required')
});

const ITEMS_PER_PAGE = 10;

const ServiceFrequencies: React.FC = () => {
  const [serviceFrequencies, setServiceFrequencies] = useState<ServiceFrequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'frequency' | 'discountPercentage'>('frequency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<ServiceFrequency | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { frequency: '', discountPercentage: 0 }
  });

  const fetchServiceFrequencies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllServiceFrequencies();
      setServiceFrequencies(data);
    } catch (error) {
      toast.error('Failed to fetch service frequencies');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceFrequencies();
  }, []);

  const filteredFrequencies = serviceFrequencies
    .filter(frequency => frequency.frequency.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aValue = sortField === 'frequency' ? a[sortField].toString().toLowerCase() : a[sortField];
      const bValue = sortField === 'frequency' ? b[sortField].toString().toLowerCase() : b[sortField];
      
      if (sortField === 'discountPercentage') {
        return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
      
      return sortDirection === 'asc' ? 
        (aValue as string).localeCompare(bValue as string) : 
        (bValue as string).localeCompare(aValue as string);
    });

  const paginatedFrequencies = filteredFrequencies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: 'frequency' | 'discountPercentage') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  type ServiceFrequencyFormData = {
    frequency: string;
    discountPercentage: number | string;
  };

  const onSubmit = async (data: ServiceFrequencyFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedFrequency) {
        await apiService.updateServiceFrequency({ 
          ...data, 
          discountPercentage: Number(data.discountPercentage), 
          serviceFrequencyId: selectedFrequency.serviceFrequencyId 
        });
        toast.success('Service frequency updated');
      } else {
        await apiService.addServiceFrequency({ 
          ...data, 
          discountPercentage: Number(data.discountPercentage) 
        });
        toast.success('Service frequency added');
      }
      fetchServiceFrequencies();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      reset();
      setSelectedFrequency(null);
    } catch (err) {
      toast.error('Failed to save service frequency');
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFrequency) return;
    try {
      setIsSubmitting(true);
      await apiService.deleteServiceFrequency(selectedFrequency.serviceFrequencyId);
      toast.success('Service frequency deleted');
      fetchServiceFrequencies();
      setIsDeleteDialogOpen(false);
      setSelectedFrequency(null);
    } catch (error) {
      toast.error('Failed to delete service frequency');
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SortIcon = ({ field }: { field: 'frequency' | 'discountPercentage' }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? <FiChevronUp className="w-4 h-4 text-gray-600" /> : <FiChevronDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Frequencies</h1>
            <p className="text-gray-600 mt-1">Manage service frequencies and their discount percentages.</p>
          </div>
          <Button label="New Service Frequency" variant="primary" icon={<FiPlus />} onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto" />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search frequencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiFilter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {/* <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button onClick={() => handleSort('frequency')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Frequency Name
                      <SortIcon field="frequency" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button onClick={() => handleSort('discountPercentage')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Discount (%)
                      <SortIcon field="discountPercentage" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : paginatedFrequencies.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No service frequencies found.</td></tr>
                ) : (
                  paginatedFrequencies.map((frequency) => (
                    <tr key={frequency.serviceFrequencyId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{frequency.frequency}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{frequency.discountPercentage}%</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setSelectedFrequency(frequency); reset(frequency); setIsEditModalOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                            <FiEdit2 className="w-3 h-3 mr-1" /> Edit
                          </button>
                          <button onClick={() => { setSelectedFrequency(frequency); setIsDeleteDialogOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                            <FiTrash2 className="w-3 h-3 mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table> */}
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <button onClick={() => handleSort('frequency')} className="flex items-center gap-1 text-sm font-medium text-gray-900 break-words">
                      Frequency Name
                      <SortIcon field="frequency" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => handleSort('discountPercentage')} className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      Discount (%)
                      <SortIcon field="discountPercentage" />
                    </button>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium text-gray-900">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading...</TableCell></TableRow>
                ) : paginatedFrequencies.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="px-6 py-8 text-center text-gray-500">No service frequencies found.</TableCell></TableRow>
                ) : (
                  paginatedFrequencies.map((frequency) => (
                    <TableRow key={frequency.serviceFrequencyId} className="hover:bg-gray-50">
                      <TableCell className="p-2 text-sm font-medium text-gray-900">{frequency.frequency}</TableCell>
                      <TableCell className="p-2 text-sm text-gray-600">{frequency.discountPercentage}%</TableCell>
                      <TableCell className="p-2">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                          <button onClick={() => { setSelectedFrequency(frequency); reset(frequency); setIsEditModalOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                            <FiEdit2 className="w-3 h-3 mr-1" /> Edit
                          </button>
                          <button onClick={() => { setSelectedFrequency(frequency); setIsDeleteDialogOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                            <FiTrash2 className="w-3 h-3 mr-1" /> Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-gray-200">
            <Button label="Previous" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} />
            <span className="text-sm text-gray-600">Page {currentPage} of {Math.ceil(filteredFrequencies.length / ITEMS_PER_PAGE)}</span>
            <Button label="Next" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * ITEMS_PER_PAGE >= filteredFrequencies.length} />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); reset(); setSelectedFrequency(null); }}
        title={isEditModalOpen ? 'Edit Service Frequency' : 'Add Service Frequency'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency Name</label>
            <input {...register('frequency')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
            {errors.frequency && <p className="text-sm text-red-500 mt-1">{errors.frequency.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
            <input type="number" step="0.01" min="0" max="100" {...register('discountPercentage')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
            {errors.discountPercentage && <p className="text-sm text-red-500 mt-1">{errors.discountPercentage.message}</p>}
          </div>
          <div className="pt-4">
            <Button label={isSubmitting ? 'Saving...' : 'Save'} variant="primary" disabled={isSubmitting} className="w-full" />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedFrequency(null); }}
        onConfirm={handleDelete}
        title="Delete Service Frequency"
        message={`Are you sure you want to delete "${selectedFrequency?.frequency}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        type="danger"
      />
    </div>
  );
};

export default ServiceFrequencies;