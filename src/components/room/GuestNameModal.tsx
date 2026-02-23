import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const AVATARS = ['🦊','🐺','🦁','🐯','🐸','🐧','🦋','🐙','🦄','🐲'];

interface GuestNameModalProps {
  onJoin: (name: string, avatar: string) => void;
}

export default function GuestNameModal({ onJoin }: GuestNameModalProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-text-dark/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white rounded-[48px] p-10 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-text-dark mb-2">👋 Merhaba!</h2>
          <p className="text-xl font-bold text-text-dark/60">Oyun için adını belirle.</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-text-dark/60 ml-1 uppercase">Adın Ne?</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                placeholder="Örn: Süper Öğrenci"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-text-dark/60 ml-1 uppercase">Avatar Seç</label>
            <div className="grid grid-cols-5 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedAvatar(a)}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all",
                    selectedAvatar === a ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" : "bg-background hover:bg-background/80"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <Button 
            size="xl" 
            className="w-full py-6" 
            disabled={!name.trim()}
            onClick={() => onJoin(name, selectedAvatar)}
          >
            Odaya Gir <ArrowRight className="ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
