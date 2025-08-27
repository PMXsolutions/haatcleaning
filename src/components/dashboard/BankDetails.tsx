import React, { useEffect, useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiCreditCard } from 'react-icons/fi';
import { apiService } from '@/api/services';
import type { BankDetails } from '@/api/types';
import { Modal } from '@/components/shared/Modal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/shared/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  bankName: yup.string().required('Bank name is required'),
  accountNumber: yup.string().required('Account number is required'),
  accountName: yup.string().required('Account name is required'),
  bsb: yup.string().required('BSB is required'),
  sortCode: yup.string().required('Sort code is required')
});

type BankDetailsFormData = yup.InferType<typeof validationSchema>;

const ITEMS_PER_PAGE = 10;

const BankDetails: React.FC = () => {
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'bankName' | 'accountName'>('bankName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState<BankDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BankDetailsFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      bsb: '',
      sortCode: ''
    }
  });

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllBankDetails();
      setBankDetails(data);
    } catch (error) {
      toast.error('Failed to fetch bank details');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const filteredBankDetails = bankDetails
    .filter(bank => 
      bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const paginatedBankDetails = filteredBankDetails.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: 'bankName' | 'accountName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const onSubmit = async (data: BankDetailsFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedBankDetails) {
        await apiService.updateBankDetails(selectedBankDetails.bankDetailsId, {
          ...data,
          bankDetailsId: selectedBankDetails.bankDetailsId
        });
        toast.success('Bank details updated successfully');
      } else {
        await apiService.addBankDetails(data);
        toast.success('Bank details added successfully');
      }
      
      await fetchBankDetails();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      reset();
      setSelectedBankDetails(null);
    } catch (error) {
      toast.error('Failed to save bank details');
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBankDetails) return;
    
    try {
      setIsSubmitting(true);
      await apiService.deleteBankDetails(selectedBankDetails.bankDetailsId);
      toast.success('Bank details deleted successfully');
      await fetchBankDetails();
      setIsDeleteDialogOpen(false);
      setSelectedBankDetails(null);
    } catch (error) {
      toast.error('Failed to delete bank details');
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SortIcon = ({ field }: { field: 'bankName' | 'accountName' }) => {
    if (sortField !== field) return <FiChevronUp className="w-4 h-4 text-gray-400" />;
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
            <h1 className="text-2xl font-bold text-gray-900">Bank Details</h1>
            <p className="text-gray-600 mt-1">Manage bank account information for payments.</p>
          </div>
          <Button
            label="Add Bank Details"
            variant="primary"
            icon={<FiPlus />}
            onClick={() => {
              reset();
              setIsAddModalOpen(true);
            }}
            className="w-full md:w-auto"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bank details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <button
                      onClick={() => handleSort('bankName')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Bank Name
                      <SortIcon field="bankName" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleSort('accountName')}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900"
                    >
                      Account Name
                      <SortIcon field="accountName" />
                    </button>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm font-medium text-gray-900">
                    Account Number
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm font-medium text-gray-900">
                    BSB
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm font-medium text-gray-900">
                    Sort Code
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-900 text-center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading bank details...
                    </TableCell>
                  </TableRow>
                ) : paginatedBankDetails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FiCreditCard className="h-12 w-12 text-gray-400 mb-3" />
                        <p>No bank details found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBankDetails.map((bank) => (
                    <TableRow key={bank.bankDetailsId} className="hover:bg-gray-50">
                      <TableCell className="p-3 text-sm font-medium text-gray-900">
                        {bank.bankName}
                      </TableCell>
                      <TableCell className="p-3 text-sm text-gray-700">
                        {bank.accountName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-3 text-sm text-gray-700 font-mono">
                        {bank.accountNumber}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell p-3 text-sm text-gray-700 font-mono">
                        {bank.bsb}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell p-3 text-sm text-gray-700 font-mono">
                        {bank.sortCode}
                      </TableCell>
                      <TableCell className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBankDetails(bank);
                              reset(bank);
                              setIsEditModalOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                          >
                            <FiEdit2 className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBankDetails(bank);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                          >
                            <FiTrash2 className="w-3 h-3 mr-1" />
                            Delete
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
            <Button
              label="Previous"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.max(1, Math.ceil(filteredBankDetails.length / ITEMS_PER_PAGE))}
            </span>
            <Button
              label="Next"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * ITEMS_PER_PAGE >= filteredBankDetails.length}
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
          setSelectedBankDetails(null);
        }}
        title={isEditModalOpen ? 'Edit Bank Details' : 'Add Bank Details'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              {...register('bankName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.bankName && (
              <p className="text-sm text-red-500 mt-1">{errors.bankName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <input
              {...register('accountName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.accountName && (
              <p className="text-sm text-red-500 mt-1">{errors.accountName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              {...register('accountNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.accountNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BSB
              </label>
              <input
                {...register('bsb')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.bsb && (
                <p className="text-sm text-red-500 mt-1">{errors.bsb.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Code
              </label>
              <input
                {...register('sortCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
              {errors.sortCode && (
                <p className="text-sm text-red-500 mt-1">{errors.sortCode.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              label={isSubmitting ? 'Saving...' : (isEditModalOpen ? 'Update Bank Details' : 'Add Bank Details')}
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedBankDetails(null);
        }}
        onConfirm={handleDelete}
        title="Delete Bank Details"
        message={`Are you sure you want to delete the bank details for "${selectedBankDetails?.bankName}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
        type="danger"
      />
    </div>
  );
};

export default BankDetails;