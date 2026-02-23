import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import { useRoomStore } from '../../store/roomStore';
import { 
  BarChart3, 
  Gamepad2, 
  Trophy, 
  BookOpen, 
  Copy, 
  Play, 
  Settings, 
  Trash2,
  Plus,
  ChevronRight,
  Users,
  QrCode
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { subjectColors } from '../../styles/theme';
import RoomQRDisplay from '../../components/room/RoomQRDisplay';
import { Room } from '../../types/auth';

export default function DashboardHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const roomStore = useRoomStore();
  const [selectedRoomForQR, setSelectedRoomForQR] = React.useState<Room | null>(null);

  useEffect(() => {
    if (user?.id) {
      roomStore.loadMyRooms(user.id);
      roomStore.loadHistory();
    }
  }, [user?.id]);

  const stats = useMemo(() => {
    const totalRooms = roomStore.myRooms.length;
    const playedGames = roomStore.roomHistory.length;
    
    const team1Wins = roomStore.roomHistory.filter(h => h.winner === 1).length;
    const winRate = playedGames > 0 ? Math.round((team1Wins / playedGames) * 100) : 0;
    
    const subjects = roomStore.roomHistory.map(h => h.subject);
    const favoriteSubject = subjects.length > 0 
      ? subjects.sort((a, b) => subjects.filter(v => v === a).length - subjects.filter(v => v === b).length).pop()
      : 'Henüz yok';

    return [
      { label: 'Toplam Oda', value: totalRooms, icon: <BarChart3 />, color: 'bg-primary' },
      { label: 'Oynanan Oyun', value: playedGames, icon: <Gamepad2 />, color: 'bg-team-1' },
      { label: 'Kazanma Oranı', value: `%${winRate}`, icon: <Trophy />, color: 'bg-success' },
      { label: 'Favori Ders', value: favoriteSubject, icon: <BookOpen />, color: 'bg-warning' },
    ];
  }, [roomStore.myRooms, roomStore.roomHistory]);

  const activeRooms = roomStore.myRooms.filter(r => r.status !== 'finished');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Toast would be nice here
  };

  return (
    <DashboardLayout title="Ana Panel">
      <div className="space-y-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-team-1 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-2">Merhaba, {user?.displayName}! 👋</h2>
            <p className="text-xl font-bold opacity-80">Bugün hangi sınıfı yarıştırıyoruz?</p>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-9xl opacity-20 select-none">
            👨‍🏫
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 flex items-center gap-4"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl", stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-text-dark/40 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-text-dark">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Active Rooms */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-text-dark">Aktif Odalar</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/odalar')}>
                Tümünü Gör <ChevronRight size={16} />
              </Button>
            </div>

            {activeRooms.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 flex flex-col items-center text-center border-2 border-dashed border-black/5">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-4xl mb-6">
                  📭
                </div>
                <h4 className="text-xl font-black mb-2">Henüz aktif oda yok</h4>
                <p className="text-text-dark/60 font-bold mb-8 max-w-xs">
                  Hemen yeni bir oda oluşturarak öğrencilerini yarıştırmaya başla!
                </p>
                <Button onClick={() => navigate('/dashboard/yeni-oda')}>
                  <Plus size={20} /> İlk Odanı Oluştur
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeRooms.map((room) => (
                  <motion.div
                    key={room.id}
                    layoutId={room.id}
                    className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-2xl">
                          {room.subject === 'matematik' ? '🔢' : '📖'}
                        </div>
                        <div>
                          <h4 className="font-black text-text-dark">{room.name}</h4>
                          <p className="text-xs font-bold text-text-dark/40 uppercase">{room.grade}. Sınıf • {room.subject}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        room.status === 'waiting' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                      )}>
                        {room.status === 'waiting' ? 'Bekliyor' : 'Oynanıyor'}
                      </div>
                    </div>

                    <div className="bg-background rounded-2xl p-4 mb-6 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-text-dark/40 uppercase mb-1">ODA KODU</p>
                        <p className="text-2xl font-black text-primary tracking-wider">{room.code}</p>
                      </div>
                      <button 
                        onClick={() => handleCopyCode(room.code)}
                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-text-dark/40 hover:text-primary transition-colors shadow-sm"
                      >
                        <Copy size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-text-dark/60 font-bold text-sm">
                        <Users size={16} />
                        {room.players.length} / {room.settings.maxPlayers} Oyuncu
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-12"
                        onClick={() => setSelectedRoomForQR(room)}
                      >
                        <QrCode size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/dashboard/oda/${room.id}`)}
                      >
                        <Settings size={16} /> Ayarlar
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/dashboard/oda/${room.id}`)}
                      >
                        <Play size={16} /> Başlat
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-text-dark">Son Aktiviteler</h3>
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5 space-y-6">
              {roomStore.roomHistory.length === 0 ? (
                <p className="text-center py-10 text-text-dark/40 font-bold">Henüz geçmiş oyun yok.</p>
              ) : (
                roomStore.roomHistory.slice(0, 5).map((history, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="relative flex flex-col items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 z-10",
                        history.winner === 'draw' ? "bg-text-dark/40" : "bg-warning"
                      )}>
                        <Trophy size={18} />
                      </div>
                      {i < 4 && <div className="w-0.5 h-full bg-background absolute top-10" />}
                    </div>
                    <div className="pb-6">
                      <p className="font-black text-text-dark group-hover:text-primary transition-colors">
                        {history.team1Name} vs {history.team2Name}
                      </p>
                      <p className="text-sm font-bold text-text-dark/60">
                        {history.subject.toUpperCase()} - {history.topicTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded-full uppercase",
                          history.winner === 1 ? "bg-team-1/10 text-team-1" : history.winner === 2 ? "bg-team-2/10 text-team-2" : "bg-text-dark/10 text-text-dark"
                        )}>
                          {history.winner === 'draw' ? 'Beraberlik' : history.winner === 1 ? `${history.team1Name} Kazandı` : `${history.team2Name} Kazandı`}
                        </span>
                        <span className="text-[10px] font-bold text-text-dark/20">• 10dk önce</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedRoomForQR && (
          <RoomQRDisplay 
            roomCode={selectedRoomForQR.code}
            roomName={selectedRoomForQR.name}
            subject={selectedRoomForQR.subject}
            grade={selectedRoomForQR.grade}
            size="fullscreen"
            onClose={() => setSelectedRoomForQR(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
