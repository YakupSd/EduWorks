import { Delete, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { theme } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface NumpadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export default function Numpad({ value, onChange, onSubmit, onClear }: NumpadProps) {
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'CLEAR', '0', 'BACKSPACE'
  ];

  const handlePress = (btn: string) => {
    if (btn === 'BACKSPACE') {
      onChange(value.slice(0, -1));
    } else if (btn === 'CLEAR') {
      onClear();
    } else {
      if (value.length < 10) {
        onChange(value + btn);
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[300px]">
      {buttons.map((btn) => (
        <motion.button
          key={btn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={theme.bounce}
          onClick={() => handlePress(btn)}
          className={cn(
            "h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-md",
            btn === 'BACKSPACE' ? "bg-warning/20 text-warning" :
            btn === 'CLEAR' ? "bg-team-2/20 text-team-2" :
            "bg-white text-text-dark hover:bg-primary/10"
          )}
        >
          {btn === 'BACKSPACE' ? <Delete /> : btn === 'CLEAR' ? <X /> : btn}
        </motion.button>
      ))}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        className="col-span-3 h-16 bg-success text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-success/30 mt-2"
      >
        <Check size={32} className="mr-2" /> TAMAM
      </motion.button>
    </div>
  );
}
