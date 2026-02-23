import { motion } from 'motion/react';
import { theme } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface MultipleChoiceOptionsProps {
  options: string[];
  selected: number | null;
  onSelect: (index: number) => void;
}

export default function MultipleChoiceOptions({ options, selected, onSelect }: MultipleChoiceOptionsProps) {
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02, x: 10 }}
          whileTap={{ scale: 0.98 }}
          transition={theme.spring}
          onClick={() => onSelect(index)}
          className={cn(
            "p-6 rounded-2xl flex items-center gap-6 text-left text-xl font-bold transition-all border-4",
            selected === index
              ? "bg-primary text-white border-primary shadow-xl shadow-primary/30"
              : "bg-white text-text-dark border-transparent hover:border-primary/20 shadow-md"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black shrink-0",
            selected === index ? "bg-white text-primary" : "bg-primary/10 text-primary"
          )}>
            {labels[index]}
          </div>
          {option}
        </motion.button>
      ))}
    </div>
  );
}
