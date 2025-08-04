
interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'icon' | 'danger';
  className?: string;
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  // size?: "sm" | "md" | "lg"
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled,
  variant = 'primary',
  className = '',
  icon,
  iconPosition = "right",
  // size = "md",
}) => {
  const baseClasses = 'px-6 py-2 font-medium transition-all duration-300 border border-color cursor-pointer rounded-lg flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gold hover:bg-white text-white hover:text-gold',
    outline: 'bg-white hover:bg-gold text-gold hover:text-white',
    icon: "bg-white hover:bg-gold text-gold hover:text-white",
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon && iconPosition === "left" && icon}
      {label}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};
