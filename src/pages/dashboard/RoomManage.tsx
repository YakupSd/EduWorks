import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useRoomStore } from '../../store/roomStore';
import { useAuthStore } from '../../store/authStore';
import RoomQRDisplay from '../../components/room/RoomQRDisplay';
import PlayerSlot from '../../components/room/PlayerSlot';
import { 
  Copy, 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  UserX, 
  CheckCircle2, 
  Users,
  Clock,
  RotateCcw,
  Trophy,
  ChevronRight,
  Settings
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { RoomPlayer } from '../../types/auth';

export default function RoomManage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const roomStore = useRoomStore();
  
  const [room, setRoom] = useState(roomStore.currentRoom);

  useEffect(() => {
    if (roomId) {
      const found = roomStore.myRooms.find(r => r.id === roomId);
      if (found) {
        setRoom(found);
      } else {
        // Try loading all rooms if not found in myRooms
        const allRoomsRaw = localStorage.getItem('edusavas_rooms');
        const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
        const r = allRooms.find((r: any) => r.id === roomId);
        if (r) setRoom(r);
      }
    }
  }, [roomId, roomStore.myRooms]);

  if (!room) return null;

  const team1Players = room.players.filter(p => p.teamId === 1);
  const team2Players = room.players.filter(p => p.teamId === 2);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
  };

  const handleStartGame = () => {
    roomStore.startGame(room.id);
    // In a real app, this would notify players via WebSocket
  };

  const handleDelete = () => {
    if (window.confirm('Bu odayı silmek istediğinize emin misiniz?')) {
      roomStore.deleteRoom(room.id);
      navigate('/dashboard');
    }
  };

  const joinUrl = `${window.location.origin}/kat?code=${room.code}`;

  return (
    <DashboardLayout title="Oda Yönetimi">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Panel - Room Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <RoomQRDisplay 
              roomCode={room.code}
              roomName={room.name}
              subject={room.subject}
              grade={room.grade}
              size="compact"
            />
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-black text-text-dark/60 uppercase tracking-wider">
                  {room.players.length} / {room.settings.maxPlayers} Oyuncu
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5">
            <h4 className="font-black text-text-dark mb-6 flex items-center gap-2">
              <Settings size={18} /> Hızlı Ayarlar
            </h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-dark/40 uppercase">Soru Süresi: {room.settings.timePerQuestion}sn</label>
                <input 
                  type="range" 
                  min="15" max="60" step="15"
                  value={room.settings.timePerQuestion}
                  onChange={(e) => roomStore.updateRoomSettings(room.id, { timePerQuestion: parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-dark/40 uppercase">Tur Sayısı: {room.settings.totalRounds}</label>
                <div className="flex gap-2">
                  {[5, 10, 15].map(n => (
                    <button
                      key={n}
                      onClick={() => roomStore.updateRoomSettings(room.id, { totalRounds: n })}
                      className={cn(
                        "flex-1 py-2 rounded-lg border-2 font-black text-xs transition-all",
                        room.settings.totalRounds === n ? "border-primary bg-primary text-white" : "border-background text-text-dark/40"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Player Lobby */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-black/5 min-h-[600px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-text-dark flex items-center gap-4">
                Oyuncu Lobisi
                <span className="text-sm font-bold bg-background px-4 py-1 rounded-full text-text-dark/40">
                  {room.players.length} / {room.settings.maxPlayers}
                </span>
              </h3>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest",
                room.status === 'waiting' ? "bg-warning/10 text-warning animate-pulse" : "bg-success/10 text-success"
              )}>
                <div className={cn("w-2 h-2 rounded-full", room.status === 'waiting' ? "bg-warning" : "bg-success")} />
                {room.status === 'waiting' ? 'Oyuncular Bekleniyor' : 'Oyun Başladı'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 h-full">
              {/* Team 1 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <h4 className="font-black text-team-1 uppercase tracking-wider">{room.settings.team1Name}</h4>
                  <span className="text-xs font-bold text-text-dark/20">Mavi Takım</span>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: room.settings.maxPlayers / 2 }).map((_, i) => (
                    <PlayerSlot 
                      key={i}
                      player={team1Players[i]}
                      teamId={1}
                      isTeacher
                      onKick={(uid) => roomStore.kickPlayer(room.id, uid)}
                    />
                  ))}
                </div>
              </div>

              {/* Team 2 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <h4 className="font-black text-team-2 uppercase tracking-wider">{room.settings.team2Name}</h4>
                  <span className="text-xs font-bold text-text-dark/20">Kırmızı Takım</span>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: room.settings.maxPlayers / 2 }).map((_, i) => (
                    <PlayerSlot 
                      key={i}
                      player={team2Players[i]}
                      teamId={2}
                      isTeacher
                      onKick={(uid) => roomStore.kickPlayer(room.id, uid)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5 space-y-4">
            <h4 className="font-black text-text-dark mb-4">Oyun Kontrolleri</h4>
            
            <Button 
              size="xl" 
              className="w-full py-8"
              disabled={room.players.length < 2 || room.status !== 'waiting'}
              onClick={handleStartGame}
            >
              <Play size={24} fill="currentColor" /> Oyunu Başlat
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="ghost" className="bg-background border-2 border-transparent hover:border-primary/20">
                <Pause size={20} /> Duraklat
              </Button>
              <Button variant="ghost" className="bg-background border-2 border-transparent hover:border-team-2/20 text-team-2">
                <Square size={20} /> Bitir
              </Button>
            </div>

            <Button variant="ghost" className="w-full text-team-2/60 hover:text-team-2 hover:bg-team-2/5" onClick={handleDelete}>
              <Trash2 size={18} /> Odayı Sil
            </Button>
          </div>

          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5">
            <h4 className="font-black text-text-dark mb-6">Oda Geçmişi</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold text-text-dark/60">
                <span className="flex items-center gap-2"><Clock size={16} /> Süre</span>
                <span>--:--</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-text-dark/60">
                <span className="flex items-center gap-2"><Trophy size={16} /> Tur</span>
                <span>0 / {room.settings.totalRounds}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
