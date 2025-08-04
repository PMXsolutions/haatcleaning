import React from 'react';
import { Modal } from './Modal';
import { Button } from './button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  type = 'danger'
}) => {
  const getConfirmVariant = () => {
    switch (type) {
      case 'danger':
        return 'danger' as const;
      case 'warning':
        return 'primary' as const;
      default:
        return 'primary' as const;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <Button
            label={cancelText}
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            label={isLoading ? 'Processing...' : confirmText}
            variant={getConfirmVariant()}
            onClick={onConfirm}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};