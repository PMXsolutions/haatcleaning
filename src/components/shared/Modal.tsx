import React from 'react';
// import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    // <div className="fixed inset-0 z-50 overflow-y-auto">
    //   <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
    //     {/* Background overlay */}
    //     <div 
    //       className="fixed inset-0 transition-opacity bg-pink-500 bg-opacity-75"
    //       onClick={onClose}
    //     ></div>

    //     {/* Modal panel */}
    //     <div className={`inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg`}>
    //       {/* Header */}
    //       <div className="flex items-center justify-between mb-4">
    //         <h3 className="text-lg font-semibold text-gray-900">
    //           {title}
    //         </h3>
    //         <button
    //           onClick={onClose}
    //           className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
    //         >
    //           <FiX className="w-5 h-5" />
    //         </button>
    //       </div>

    //       {/* Content */}
    //       <div>
    //         {children}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Background overlay with click handler to close modal */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal panel container, positioned relative to the screen */}
      <div className={`relative w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left bg-white rounded-lg shadow-xl`}>
        {/* Header with title and close button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Modal content area */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};