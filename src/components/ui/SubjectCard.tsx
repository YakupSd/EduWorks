import { motion } from 'motion/react';
import { theme } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface SubjectCardProps {
  icon: string;
  title: string;
  color: string;
  grade?: string;
  onClick: () => void;
}

export default function SubjectCard({ icon, title, color, grade, onClick }: SubjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      transition={theme.bounce}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div 
        className={cn(
          "relative bg-white rounded-3xl p-8 flex flex-col items-center justify-center gap-4 shadow-xl transition-all duration-300",
          "border-b-8 border-transparent hover:border-current"
        )}
        style={{ color: color }}
      >
        <div 
          className="text-6xl mb-2 transition-transform group-hover:scale-110 duration-300"
          role="img" 
          aria-label={title}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-black text-text-dark text-center">
          {title}
        </h3>
        {grade && (
          <span className="text-sm font-bold opacity-60 text-text-dark">
            {grade}
          </span>
        )}
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: color, boxShadow: `0 0 40px ${color}` }}
        />
      </div>
    </motion.div>
  );
}
