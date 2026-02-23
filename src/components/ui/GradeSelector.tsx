import { motion } from 'motion/react';
import { theme } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface GradeSelectorProps {
  grades: number[];
  selected: number;
  onChange: (grade: number) => void;
}

export default function GradeSelector({ grades, selected, onChange }: GradeSelectorProps) {
  return (
    <div className="flex gap-4 justify-center">
      {grades.map((grade) => (
        <motion.button
          key={grade}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={theme.bounce}
          onClick={() => onChange(grade)}
          className={cn(
            "px-8 py-3 rounded-full text-xl font-black transition-all shadow-md",
            selected === grade 
              ? "bg-primary text-white scale-110 shadow-primary/40" 
              : "bg-white text-text-dark hover:bg-primary/10"
          )}
        >
          {grade}. Sınıf
        </motion.button>
      ))}
    </div>
  );
}
