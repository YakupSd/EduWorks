import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { Users } from 'lucide-react';
import { theme } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  players: string;
  onClick: () => void;
}

export default function GameCard({ title, description, icon, players, onClick }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={theme.bounce}
      onClick={onClick}
      className="bg-white rounded-3xl p-6 shadow-xl cursor-pointer group flex flex-col gap-4 border-2 border-transparent hover:border-primary/20"
    >
      <div className="h-40 bg-background rounded-2xl flex items-center justify-center text-primary overflow-hidden relative">
        <div className="text-6xl group-hover:scale-125 transition-transform duration-500">
          {icon}
        </div>
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-black text-primary shadow-sm">
          <Users size={14} />
          {players}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-black text-text-dark mb-1">{title}</h3>
        <p className="text-sm text-text-dark/60 font-medium leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="mt-auto pt-2">
        <div className="w-full py-2 bg-primary/10 text-primary rounded-xl text-center font-black text-sm group-hover:bg-primary group-hover:text-white transition-colors">
          OYNA
        </div>
      </div>
    </motion.div>
  );
}
