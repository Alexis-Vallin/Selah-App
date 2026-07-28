import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  ...props 
}) => {
  const baseStyle = "w-full py-3 px-6 rounded-full font-sans font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-opacity-90",
    outline: "border-2 border-primary text-primary hover:bg-primary/5"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-pulse">Processing...</span>
      ) : children}
    </button>
  );
};