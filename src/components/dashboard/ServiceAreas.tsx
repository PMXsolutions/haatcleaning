import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import { apiService } from '@/api/services';
import { ServiceArea, CreateServiceAreaRequest } from '@/api/types';
import { Modal } from '@/components/shared/Modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/shared/button';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  areaName: yup.string().required('Area name is required').min(2, 'Area name must be at least 2 characters'),
  postalCode: yup.string().required('Postal code is required').min(3, 'Postal code must be at least 3 characters')
});

const ITEMS_PER_PAGE = 10;

const ServiceAreas: React.FC = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'areaName' | 'postalCode'>('areaName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { areaName: '', postalCode: '' }
  });

  // Fetch service areas
  const fetchServiceAreas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllServiceAreas();
      setServiceAreas(data);
    } catch (error) {
      toast.error('Failed to fetch service areas');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  // Filter and sort service areas
  const filteredAreas = serviceAreas
    .filter(area => 
      area.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.postalCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const paginatedAreas = filteredAreas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Handle sort
  const handleSort = (field: 'areaName' | 'postalCode') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  type ServiceAreaFormData = {
    areaName: string;
    postalCode: string;
  };

  // Handle form submission (both add and edit)
  const onSubmit = async (data: ServiceAreaFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedArea) {
        const request: ServiceArea = {
          serviceAreaId: selectedArea.serviceAreaId,
          areaName: data.areaName.trim(),
          postalCode: data.postalCode.trim()
        };
        await apiService.updateServiceArea(request);
        toast.success('Service area updated');
      } else {
        const request: CreateServiceAreaRequest = {
          areaName: data.areaName.trim(),
          postalCode: data.postalCode.trim()
        };
        await apiService.addServiceArea(request);
        toast.success('Service area added');
      }
      fetchServiceAreas();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      reset();
      setSelectedArea(null);
    } catch (err) {
      toast.error('Failed to save service area');
      console.error('Save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedArea) return;
    try {
      setIsSubmitting(true);
      await apiService.deleteServiceArea(selectedArea.serviceAreaId);
      toast.success('Service area deleted');
      fetchServiceAreas();
      setIsDeleteDialogOpen(false);
      setSelectedArea(null);
    } catch (error) {
      toast.error('Failed to delete service area');
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SortIcon = ({ field }: { field: 'areaName' | 'postalCode' }) => {
    if (sortField !== field) {
      return <FiChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <FiChevronUp className="w-4 h-4 text-gray-600" /> : 
      <FiChevronDown className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Areas</h1>
            <p className="text-gray-600 mt-1">
              Manage the regions where your services are available.
            </p>
          </div>
          <Button
            label="New Service Area"
            variant="primary"
            icon={<FiPlus />}
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto"
          />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search areas..."
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('areaName')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Area Name
                      <SortIcon field="areaName" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('postalCode')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Postal Code
                      <SortIcon field="postalCode" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : paginatedAreas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No service areas found.
                    </td>
                  </tr>
                ) : (
                  paginatedAreas.map((area) => (
                    <tr key={area.serviceAreaId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {area.areaName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {area.postalCode}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedArea(area);
                              reset(area);
                              setIsEditModalOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                          >
                            <FiEdit2 className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedArea(area);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                          >
                            <FiTrash2 className="w-3 h-3 mr-1" />
                            Delete
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
            <Button
              label="Previous"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(filteredAreas.length / ITEMS_PER_PAGE)}
            </span>
            <Button
              label="Next"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= filteredAreas.length}
            />
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          reset();
          setSelectedArea(null);
        }}
        title={isEditModalOpen ? 'Edit Service Area' : 'Add Service Area'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area Name
            </label>
            <input
              {...register('areaName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.areaName && (
              <p className="text-sm text-red-500 mt-1">{errors.areaName.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              {...register('postalCode')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              label={isSubmitting ? 'Saving...' : 'Save'}
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedArea(null);
        }}
        onConfirm={handleDelete}
        title="Delete Service Area"
        message={`Are you sure you want to delete "${selectedArea?.areaName}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        type="danger"
      />
    </div>
  );
};

export default ServiceAreas;