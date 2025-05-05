import { ExtraService, SelectedExtra } from '../../types';
import { Popover, Transition } from '@headlessui/react' // Using Popover for hover captions

interface ExtraServicesProps {
  availableExtras: ExtraService[];
  selectedExtras: SelectedExtra[];
  onChange: (selected: SelectedExtra[]) => void;
}

interface ExtraServiceItemProps {
  service: ExtraService;
  isSelected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (newQuantity: number) => void;
}

// Individual Service Item Component
const ExtraServiceItem: React.FC<ExtraServiceItemProps> = ({
  service, isSelected, quantity, onToggle, onQuantityChange
}) => {
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggle when clicking +/-
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggle
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    } else {
      // If quantity becomes 0 or less, deselect the service
      onToggle();
    }
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as="div"> {/* Use div to prevent button styling */}
            <button
              type="button"
              onClick={onToggle}
              className={`
                p-4 border rounded-lg text-center cursor-pointer transition-colors duration-150 w-full h-full flex flex-col items-center justify-center relative
                ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
              `}
            >
              <span className="text-3xl mb-1">{service.icon}</span>
              <span className="text-xs font-medium">{service.name}</span>
              {isSelected && service.hasQuantity && (
                <div className="absolute bottom-1 right-1 flex items-center bg-white border border-gray-300 rounded text-xs">
                  <button type="button" onClick={handleDecrement} className="px-1.5 py-0.5 hover:bg-gray-200 rounded-l">-</button>
                  <span className="px-1.5 py-0.5 font-semibold">{quantity}</span>
                  <button type="button" onClick={handleIncrement} className="px-1.5 py-0.5 hover:bg-gray-200 rounded-r">+</button>
                </div>
              )}
              {isSelected && !service.hasQuantity && (
                  <div className="absolute top-1 right-1 text-blue-500">✓</div>
              )}
            </button>
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute z-10 w-48 p-2 mt-1 text-xs text-center text-white bg-gray-700 rounded-md shadow-lg -translate-x-1/2 left-1/2">
                  {service.description} (${service.price}{service.hasQuantity ? '/item' : ''})
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};  


// Main Extras Component
export const ExtraServices: React.FC<ExtraServicesProps> = ({ availableExtras, selectedExtras, onChange }) => {

  const handleToggle = (serviceId: string) => {
    const currentIndex = selectedExtras.findIndex(e => e.id === serviceId);
    const serviceDefinition = availableExtras.find(s => s.id === serviceId);
    if (!serviceDefinition) return;

    let newSelected: SelectedExtra[];

    if (currentIndex === -1) {
      // Add new service
      newSelected = [...selectedExtras, { id: serviceId, quantity: 1 }];
    } else {
      // Remove existing service
      newSelected = selectedExtras.filter(e => e.id !== serviceId);
    }
    onChange(newSelected);
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    onChange(
      selectedExtras.map(e => e.id === serviceId ? { ...e, quantity: newQuantity } : e)
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Select Extra Services</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {availableExtras.map(service => {
          const selectedItem = selectedExtras.find(e => e.id === service.id);
          return (
            <ExtraServiceItem
              key={service.id}
              service={service}
              isSelected={!!selectedItem}
              quantity={selectedItem?.quantity ?? 0}
              onToggle={() => handleToggle(service.id)}
              onQuantityChange={(newQuantity) => handleQuantityChange(service.id, newQuantity)}
            />
          );
        })}
      </div>
    </div>
  );
};