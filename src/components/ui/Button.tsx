import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { theme } from '../../styles/theme';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white shadow-lg shadow-primary/30',
    secondary: 'bg-white text-primary border-2 border-primary shadow-lg',
    success: 'bg-success text-white shadow-lg shadow-success/30',
    danger: 'bg-team-2 text-white shadow-lg shadow-team-2/30',
    ghost: 'bg-transparent text-primary hover:bg-primary/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
    xl: 'px-10 py-5 text-2xl font-black',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={theme.bounce}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        'rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
