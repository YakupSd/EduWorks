import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import { Gamepad2, User as UserIcon, Camera, Info } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import RoomCodeInput from '../components/room/RoomCodeInput';
import GuestNameModal from '../components/room/GuestNameModal';
import { Room } from '../types/auth';

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const auth = useAuthStore();
  const roomStore = useRoomStore();
  
  const [error, setError] = useState<string | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingRoom, setPendingRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (roomCode) {
      handleDirectJoin(roomCode);
    }
  }, [roomCode]);

  const handleDirectJoin = async (code: string) => {
    try {
      const room = roomStore.getRoom(code);
      if (!room) {
        setError('Oda bulunamadı.');
        return;
      }
      handleRoomSuccess(room);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRoomSuccess = async (room: Room) => {
    if (room.status === 'finished') {
      setError('Bu oda kapandı.');
      return;
    }

    if (room.status === 'playing' && !room.settings.allowRejoin) {
      setError('Oyun başladı, katılamazsınız.');
      return;
    }

    if (!auth.user) {
      setPendingRoom(room);
      setShowGuestModal(true);
      return;
    }

    try {
      await roomStore.joinRoom(room.code, {
        userId: auth.user.id,
        displayName: auth.user.displayName,
      });
      navigate(`/kat/${room.code}/oyun`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestJoin = async (name: string, avatar: string) => {
    if (!pendingRoom) return;
    
    auth.loginAsGuest(name);
    
    try {
      await roomStore.joinRoom(pendingRoom.code, {
        displayName: name,
      });
      setShowGuestModal(false);
      navigate(`/kat/${pendingRoom.code}/oyun`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] p-12 w-full max-w-2xl shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8">
            <Gamepad2 size={48} />
          </div>
          
          <h1 className="text-5xl font-black text-text-dark mb-4">Odaya Katıl</h1>
          <p className="text-xl font-bold text-text-dark/60 mb-12">Öğretmeninden aldığın kodu gir:</p>

          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-team-2/10 text-team-2 p-4 rounded-2xl font-bold mb-8 w-full border border-team-2/20"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-12 w-full">
            <RoomCodeInput 
              onSuccess={handleRoomSuccess}
              onError={setError}
            />

            <div className="flex flex-col gap-6 max-w-sm mx-auto w-full">
              <div className="flex items-center gap-3 p-4 bg-background rounded-2xl text-left">
                <Info className="text-primary shrink-0" size={20} />
                <p className="text-xs font-bold text-text-dark/60">
                  📱 iPhone veya Android kameranı aç, QR koda tut — otomatik açılır.
                </p>
              </div>
              
              <button className="flex items-center justify-center gap-2 text-text-dark/40 font-bold hover:text-primary transition-colors py-2 opacity-50 cursor-not-allowed">
                <Camera size={20} /> Kamera ile Tara (Yakında)
              </button>
            </div>
          </div>
        </motion.div>

        <button 
          onClick={() => navigate('/')}
          className="mt-12 text-text-dark/40 font-black hover:text-text-dark transition-colors"
        >
          ← Ana Sayfaya Dön
        </button>
      </div>

      <AnimatePresence>
        {showGuestModal && (
          <GuestNameModal onJoin={handleGuestJoin} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
