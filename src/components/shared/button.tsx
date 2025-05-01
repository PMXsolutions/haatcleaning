
interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled,
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = 'px-6 py-2 rounded-full font-medium transition-all duration-300 border border-color cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-gold hover:bg-white text-white hover:text-gold',
    
    outline: 'bg-white hover:bg-gold text-gold hover:text-white'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {label}
    </button>
  );
};
