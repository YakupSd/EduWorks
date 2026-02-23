import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  onEnd: () => void;
}

export default function Timer({ seconds, isRunning, onEnd }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / seconds) * circumference;

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) onEnd();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onEnd]);

  const getColor = () => {
    const ratio = timeLeft / seconds;
    if (ratio > 0.5) return 'text-success';
    if (ratio > 0.2) return 'text-warning';
    return 'text-team-2';
  };

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-black/5"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          className={cn("transition-colors duration-500", getColor())}
        />
      </svg>
      <div className={cn(
        "absolute text-2xl font-black",
        timeLeft <= 5 && timeLeft > 0 ? "animate-pulse scale-125" : ""
      )}>
        {timeLeft}
      </div>
    </div>
  );
}
