

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = 'px-6 py-2 rounded-full font-medium transition-all duration-300 border border-amber-500 cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-amber-500 hover:bg-white text-white hover:text-amber-500',
    
    outline: 'bg-white hover:bg-amber-500 text-amber-500 hover:text-white'
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {label}
    </button>
  );
};
