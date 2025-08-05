import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { apiService } from '@/api/services';
import { ServiceOption, ServiceType } from '@/api/types';
import { Modal } from '@/components/shared/Modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/shared/button';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  optionName: yup.string().required('Option name is required').min(2, 'Option name must be at least 2 characters'),
  serviceTypeId: yup.string().required('Service type is required'),
  pricePerUnit: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price per unit is required')
});

const ITEMS_PER_PAGE = 10;

const ServiceOptions: React.FC = () => {
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'optionName' | 'pricePerUnit'>('optionName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { optionName: '', serviceTypeId: '', pricePerUnit: 0 }
  });

  const fetchServiceOptions = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllServiceOptions();
      setServiceOptions(data);
    } catch (error) {
      toast.error('Failed to fetch service options');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const data = await apiService.getAllServiceTypes();
      setServiceTypes(data);
    } catch (error) {
      console.error('Error fetching service types:', error);
      toast.error('Failed to fetch service types');
    }
  };

  useEffect(() => {
    fetchServiceOptions();
    fetchServiceTypes();
  }, []);

  // Get service type name by ID
  const getServiceTypeName = (serviceTypeId: string) => {
    const serviceType = serviceTypes.find(type => type.serviceTypeId === serviceTypeId);
    return serviceType?.name || 'Unknown Service Type';
  };

  const filteredOptions = serviceOptions
    .filter(option => 
      option.optionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getServiceTypeName(option.serviceTypeId).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'optionName') {
        const aValue = a[sortField].toString().toLowerCase();
        const bValue = b[sortField].toString().toLowerCase();
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  const paginatedOptions = filteredOptions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: 'optionName' | 'pricePerUnit') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  type ServiceOptionFormData = {
    optionName: string;
    serviceTypeId: string;
    pricePerUnit: number | string;
  };

  const onSubmit = async (data: ServiceOptionFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedOption) {
        await apiService.updateServiceOption({ 
          ...data, 
          pricePerUnit: Number(data.pricePerUnit), 
          serviceOptionId: selectedOption.serviceOptionId 
        });
        toast.success('Service option updated');
      } else {
        await apiService.addServiceOption({ 
          ...data, 
          pricePerUnit: Number(data.pricePerUnit) 
        });
        toast.success('Service option added');
      }
      fetchServiceOptions();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      reset();
      setSelectedOption(null);
    } catch (err) {
      toast.error('Failed to save service option');
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOption) return;
    try {
      setIsSubmitting(true);
      await apiService.deleteServiceOption(selectedOption.serviceOptionId);
      toast.success('Service option deleted');
      fetchServiceOptions();
      setIsDeleteDialogOpen(false);
      setSelectedOption(null);
    } catch (error) {
      toast.error('Failed to delete service option');
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SortIcon = ({ field }: { field: 'optionName' | 'pricePerUnit' }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? <FiChevronUp className="w-4 h-4 text-gray-600" /> : <FiChevronDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Options</h1>
            <p className="text-gray-600 mt-1">Manage additional service options and their pricing.</p>
          </div>
          <Button label="New Service Option" variant="primary" icon={<FiPlus />} onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto" />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search options..."
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
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button onClick={() => handleSort('optionName')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Option Name
                      <SortIcon field="optionName" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">Service Type</th>
                  <th className="px-6 py-3 text-left">
                    <button onClick={() => handleSort('pricePerUnit')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Price Per Unit
                      <SortIcon field="pricePerUnit" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : paginatedOptions.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No service options found.</td></tr>
                ) : (
                  paginatedOptions.map((option) => (
                    <tr key={option.serviceOptionId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{option.optionName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getServiceTypeName(option.serviceTypeId)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">${option.pricePerUnit}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setSelectedOption(option); reset(option); setIsEditModalOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                            <FiEdit2 className="w-3 h-3 mr-1" /> Edit
                          </button>
                          <button onClick={() => { setSelectedOption(option); setIsDeleteDialogOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                            <FiTrash2 className="w-3 h-3 mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-gray-200">
            <Button label="Previous" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} />
            <span className="text-sm text-gray-600">Page {currentPage} of {Math.ceil(filteredOptions.length / ITEMS_PER_PAGE)}</span>
            <Button label="Next" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * ITEMS_PER_PAGE >= filteredOptions.length} />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); reset(); setSelectedOption(null); }}
        title={isEditModalOpen ? 'Edit Service Option' : 'Add Service Option'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Option Name</label>
            <input {...register('optionName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
            {errors.optionName && <p className="text-sm text-red-500 mt-1">{errors.optionName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select {...register('serviceTypeId')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
              <option value="">Select a service type</option>
              {serviceTypes.map((type) => (
                <option key={type.serviceTypeId} value={type.serviceTypeId}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.serviceTypeId && <p className="text-sm text-red-500 mt-1">{errors.serviceTypeId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Unit</label>
            <input type="number" step="0.01" {...register('pricePerUnit')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
            {errors.pricePerUnit && <p className="text-sm text-red-500 mt-1">{errors.pricePerUnit.message}</p>}
          </div>
          <div className="pt-4">
            <Button label={isSubmitting ? 'Saving...' : 'Save'} variant="primary" disabled={isSubmitting} className="w-full" />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedOption(null); }}
        onConfirm={handleDelete}
        title="Delete Service Option"
        message={`Are you sure you want to delete "${selectedOption?.optionName}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        type="danger"
      />
    </div>
  );
};

export default ServiceOptions;