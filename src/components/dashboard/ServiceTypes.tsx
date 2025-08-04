import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { apiService } from '@/api/services';
import { ServiceType } from '@/api/types';
import { Modal } from '@/components/shared/Modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/shared/button';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required')
});

const ITEMS_PER_PAGE = 10;

const ServiceTypes: React.FC = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'price'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ServiceType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: '', description: '', price: 0 }
  });

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllServiceTypes();
      setServiceTypes(data);
    } catch (error) {
      toast.error('Failed to fetch service types');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const filteredTypes = serviceTypes
    .filter(type => type.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const paginatedTypes = filteredTypes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: 'name' | 'price') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  type ServiceTypeFormData = {
    name: string;
    description: string;
    price: number | string;
  };

  const onSubmit = async (data: ServiceTypeFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedType) {
        await apiService.updateServiceType({ ...data, price: Number(data.price), serviceTypeId: selectedType.serviceTypeId });
        toast.success('Service type updated');
      } else {
        await apiService.addServiceType({ ...data, price: Number(data.price) });
        toast.success('Service type added');
      }
      fetchServiceTypes();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      reset();
      setSelectedType(null);
    } catch (err) {
      toast.error('Failed to save service type');
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedType) return;
    try {
      setIsSubmitting(true);
      await apiService.deleteServiceType(selectedType.serviceTypeId);
      toast.success('Service type deleted');
      fetchServiceTypes();
      setIsDeleteDialogOpen(false);
      setSelectedType(null);
    } catch (error) {
      toast.error('Failed to delete service type');
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SortIcon = ({ field }: { field: 'name' | 'price' }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? <FiChevronUp className="w-4 h-4 text-gray-600" /> : <FiChevronDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Types</h1>
            <p className="text-gray-600 mt-1">Manage the service types available in your system.</p>
          </div>
          <Button label="New Service Type" variant="primary" icon={<FiPlus />} onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto" />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search types..."
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
                    <button onClick={() => handleSort('name')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Name
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button onClick={() => handleSort('price')} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      Price
                      <SortIcon field="price" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : paginatedTypes.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No service types found.</td></tr>
                ) : (
                  paginatedTypes.map((type) => (
                    <tr key={type.serviceTypeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{type.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">${type.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{type.description}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setSelectedType(type); reset(type); setIsEditModalOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                            <FiEdit2 className="w-3 h-3 mr-1" /> Edit
                          </button>
                          <button onClick={() => { setSelectedType(type); setIsDeleteDialogOpen(true); }} className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
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
            <span className="text-sm text-gray-600">Page {currentPage} of {Math.ceil(filteredTypes.length / ITEMS_PER_PAGE)}</span>
            <Button label="Next" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * ITEMS_PER_PAGE >= filteredTypes.length} />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); reset(); setSelectedType(null); }}
        title={isEditModalOpen ? 'Edit Service Type' : 'Add Service Type'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input {...register('name')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea {...register('description')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input type="number" step="0.01" {...register('price')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
          </div>
          <div className="pt-4">
            <Button label={isSubmitting ? 'Saving...' : 'Save'}  variant="primary" disabled={isSubmitting} className="w-full" />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedType(null); }}
        onConfirm={handleDelete}
        title="Delete Service Type"
        message={`Are you sure you want to delete "${selectedType?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        type="danger"
      />
    </div>
  );
};

export default ServiceTypes;
