import React from 'react';
import { UserX } from 'lucide-react';
import { cn } from '../../utils/cn';
import { RoomPlayer } from '../../types/auth';

interface PlayerSlotProps {
  key?: React.Key;
  player?: RoomPlayer;
  teamId: 1 | 2;
  onKick?: (userId: string) => void;
  isTeacher?: boolean;
}

export default function PlayerSlot({ player, teamId, onKick, isTeacher }: PlayerSlotProps) {
  const teamColor = teamId === 1 ? 'team-1' : 'team-2';

  return (
    <div 
      className={cn(
        "p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group",
        player 
          ? `bg-white border-${teamColor}/20 shadow-lg shadow-${teamColor}/5` 
          : "bg-background border-dashed border-black/5"
      )}
    >
      {player ? (
        <>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl",
              `bg-${teamColor}/10`
            )}>
              {player.avatar || (teamId === 1 ? '🦊' : '🐯')}
            </div>
            <div>
              <p className="font-black text-text-dark">{player.displayName}</p>
              <p className={cn(
                "text-[10px] font-black uppercase",
                player.isReady ? "text-success" : "text-warning"
              )}>
                {player.isReady ? 'Hazır' : 'Hazırlanıyor'}
              </p>
            </div>
          </div>
          {isTeacher && (
            <button 
              onClick={() => onKick?.(player.userId)}
              className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-team-2/10 text-team-2 rounded-xl flex items-center justify-center transition-all"
            >
              <UserX size={18} />
            </button>
          )}
        </>
      ) : (
        <p className="w-full text-center text-text-dark/20 font-black uppercase text-xs tracking-widest py-3">
          Bekleniyor...
        </p>
      )}
    </div>
  );
}
