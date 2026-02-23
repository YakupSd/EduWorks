import { motion } from 'motion/react';
import { theme } from '../../styles/theme';

interface TugRopeProps {
  ropePosition: number; // -100 to 100
  isGameOver?: boolean;
  winner?: 'left' | 'right';
}

export default function TugRope({ ropePosition, isGameOver, winner }: TugRopeProps) {
  // Map -100..100 to percentage 20%..80%
  const xPos = 50 + (ropePosition * 0.3);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 1000 400" className="w-full h-full">
        {/* Background Ground */}
        <rect x="0" y="300" width="1000" height="100" fill="#E2E8F0" />
        
        {/* Center Line */}
        <line x1="500" y1="280" x2="500" y2="350" stroke="#94A3B8" strokeWidth="4" strokeDasharray="8,8" />

        {/* The Rope */}
        <motion.line
          x1={0}
          y1="300"
          x2={1000}
          y2="300"
          stroke="#78350F"
          strokeWidth="12"
          animate={{ x: (ropePosition * 2) }}
          transition={theme.spring}
        />

        {/* Center Ribbon */}
        <motion.g
          animate={{ x: (ropePosition * 3) }}
          transition={theme.spring}
        >
          <rect x="495" y="280" width="10" height="40" fill="#EF4444" rx="2" />
        </motion.g>

        {/* Left Team Characters (Simplified) */}
        <motion.g animate={{ x: (ropePosition * 1.5) }} transition={theme.spring}>
          {[150, 250, 350].map((x, i) => (
            <motion.g 
              key={`left-${i}`}
              animate={{ rotate: ropePosition < 0 ? -10 : -5 }}
            >
              <circle cx={x} cy="260" r="25" fill="#3B82F6" />
              <rect x={x-15} y="285" width="30" height="50" fill="#3B82F6" rx="10" />
              <line x1={x} y1="300" x2={x+50} y2="300" stroke="#1E3A8A" strokeWidth="6" />
            </motion.g>
          ))}
        </motion.g>

        {/* Right Team Characters (Simplified) */}
        <motion.g animate={{ x: (ropePosition * 1.5) }} transition={theme.spring}>
          {[650, 750, 850].map((x, i) => (
            <motion.g 
              key={`right-${i}`}
              animate={{ rotate: ropePosition > 0 ? 10 : 5 }}
            >
              <circle cx={x} cy="260" r="25" fill="#EF4444" />
              <rect x={x-15} y="285" width="30" height="50" fill="#EF4444" rx="10" />
              <line x1={x} y1="300" x2={x-50} y2="300" stroke="#7F1D1D" strokeWidth="6" />
            </motion.g>
          ))}
        </motion.g>
      </svg>

      {/* Win Animation Overlay */}
      {isGameOver && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[50px] shadow-2xl border-8 border-primary text-center">
            <h2 className="text-6xl font-black text-primary mb-4">TEBRİKLER!</h2>
            <p className="text-3xl font-bold text-text-dark">
              {winner === 'left' ? 'MAVİ TAKIM' : 'KIRMIZI TAKIM'} KAZANDI!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
