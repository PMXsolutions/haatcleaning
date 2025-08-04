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

const ServiceAreas: React.FC = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'areaName' | 'postalCode'>('areaName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({ areaName: '', postalCode: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch service areas
  const fetchServiceAreas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllServiceAreas();
      setServiceAreas(data);
    } catch (error) {
      console.error('Error fetching service areas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  // Filter and sort service areas
  const filteredAndSortedAreas = serviceAreas
    .filter(area => 
      area.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.postalCode.includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Handle sort
  const handleSort = (field: 'areaName' | 'postalCode') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle add
  const handleAdd = async () => {
    if (!formData.areaName.trim() || !formData.postalCode.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const request: CreateServiceAreaRequest = {
        areaName: formData.areaName.trim(),
        postalCode: formData.postalCode.trim()
      };
      
      await apiService.addServiceArea(request);
      await fetchServiceAreas();
      setIsAddModalOpen(false);
      setFormData({ areaName: '', postalCode: '' });
    } catch (error) {
      console.error('Error adding service area:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = async () => {
    if (!selectedArea || !formData.areaName.trim() || !formData.postalCode.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const request: ServiceArea = {
        serviceAreaId: selectedArea.serviceAreaId,
        areaName: formData.areaName.trim(),
        postalCode: formData.postalCode.trim()
      };
      
      await apiService.updateServiceArea(request);
      await fetchServiceAreas();
      setIsEditModalOpen(false);
      setSelectedArea(null);
      setFormData({ areaName: '', postalCode: '' });
    } catch (error) {
      console.error('Error updating service area:', error);
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
      await fetchServiceAreas();
      setIsDeleteDialogOpen(false);
      setSelectedArea(null);
    } catch (error) {
      console.error('Error deleting service area:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (area: ServiceArea) => {
    setSelectedArea(area);
    setFormData({ areaName: area.areaName, postalCode: area.postalCode });
    setIsEditModalOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (area: ServiceArea) => {
    setSelectedArea(area);
    setIsDeleteDialogOpen(true);
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
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Areas</h1>
              <p className="text-gray-600 mt-1">
                Manage the regions where your services are available. Add, update, or remove areas by name and postal code.
              </p>
            </div>
            <Button
              label="New Service Area"
              variant="primary"
              icon={<FiPlus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
              className="w-full md:w-auto"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search areas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
            </div>
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
                      className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
                    >
                      Area Name
                      <SortIcon field="areaName" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('postalCode')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
                    >
                      Postal Code
                      <SortIcon field="postalCode" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-sm font-medium text-gray-900">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredAndSortedAreas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No areas found matching your search.' : 'No service areas found.'}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedAreas.map((area) => (
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
                            onClick={() => openEditModal(area)}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                          >
                            <FiEdit2 className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteDialog(area)}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
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
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData({ areaName: '', postalCode: '' });
        }}
        title="Add New Service Area"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area Name
            </label>
            <input
              type="text"
              value={formData.areaName}
              onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
              placeholder="Enter area name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              placeholder="Input postal code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              label={isSubmitting ? 'Saving...' : 'Save'}
              variant="primary"
              onClick={handleAdd}
              disabled={isSubmitting || !formData.areaName.trim() || !formData.postalCode.trim()}
              className="w-full"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedArea(null);
          setFormData({ areaName: '', postalCode: '' });
        }}
        title="Edit Service Area"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area Name
            </label>
            <input
              type="text"
              value={formData.areaName}
              onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
              placeholder="Input area name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              placeholder="Input postal code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              label={isSubmitting ? 'Updating...' : 'Update'}
              variant="primary"
              onClick={handleEdit}
              disabled={isSubmitting || !formData.areaName.trim() || !formData.postalCode.trim()}
              className="w-full"
            />
          </div>
        </div>
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