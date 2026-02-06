import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className = '' }) => {
  const baseStyles = "relative px-8 py-3 rounded-full text-sm font-medium tracking-wide overflow-hidden transition-all duration-300 group";
  
  const variants = {
    primary: "bg-midnight text-white hover:bg-slate-800 border border-transparent",
    secondary: "bg-white text-midnight border border-slate-200 hover:border-slate-400",
    outline: "bg-transparent text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
    </motion.button>
  );
};

export default Button;