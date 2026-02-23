import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';
import { useRoomStore } from '../../store/roomStore';
import { Room } from '../../types/auth';

interface RoomCodeInputProps {
  onSuccess: (room: Room) => void;
  onError: (msg: string) => void;
  autoFocus?: boolean;
}

export default function RoomCodeInput({
  onSuccess,
  onError,
  autoFocus = true
}: RoomCodeInputProps) {
  const [code, setCode] = useState(['', '', '', '']);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const roomStore = useRoomStore();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (code.every(c => c !== '')) {
      handleSubmit();
    }
  }, [code]);

  const handleSubmit = async () => {
    const fullCode = `EDU-${code.join('')}`;
    try {
      const room = roomStore.getRoom(fullCode);
      if (!room) {
        throw new Error('Oda bulunamadı.');
      }
      setIsSuccess(true);
      setTimeout(() => onSuccess(room), 300);
    } catch (err: any) {
      setIsError(true);
      onError(err.message);
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <motion.div 
      animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
      className="flex items-center justify-center gap-4"
    >
      <div className="text-4xl font-black text-primary/40 mr-2">EDU -</div>
      {code.map((char, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          autoFocus={autoFocus && i === 0}
          value={char}
          onChange={(e) => handleInputChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            "w-16 h-20 md:w-20 md:h-24 bg-background border-4 rounded-3xl text-center text-4xl font-black outline-none transition-all",
            isError ? "border-team-2 text-team-2" : 
            isSuccess ? "border-success text-success scale-105" :
            char ? "border-primary text-primary shadow-lg shadow-primary/20" : "border-transparent focus:border-primary/30"
          )}
          placeholder="•"
        />
      ))}
    </motion.div>
  );
}
