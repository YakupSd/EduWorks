import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import { useRoomStore } from '../../store/roomStore';
import { getTopics } from '../../data/questions';
import { SubjectKey, Grade, Topic } from '../../types';
import Button from '../../components/ui/Button';
import RoomQRDisplay from '../../components/room/RoomQRDisplay';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Settings2, 
  BookOpen, 
  Info,
  Copy,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

const SUBJECTS: { key: SubjectKey; name: string; icon: string }[] = [
  { key: 'matematik', name: 'Matematik', icon: '🔢' },
  { key: 'turkce', name: 'Türkçe', icon: '📖' },
  { key: 'fen', name: 'Fen Bilgisi', icon: '🧪' },
  { key: 'sosyal', name: 'Sosyal Bilimler', icon: '🌍' },
  { key: 'ingilizce', name: 'İngilizce', icon: '🇬🇧' },
  { key: 'din', name: 'Din Kültürü', icon: '🕌' },
];

export default function CreateRoom() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const roomStore = useRoomStore();

  const [step, setStep] = useState(1);
  const [roomName, setRoomName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>('matematik');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [team1Name, setTeam1Name] = useState('Takım 1');
  const [team2Name, setTeam2Name] = useState('Takım 2');
  const [roundCount, setRoundCount] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [allowRejoin, setAllowRejoin] = useState(true);
  
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  const topics = useMemo(() => {
    return getTopics(selectedSubject, selectedGrade);
  }, [selectedSubject, selectedGrade]);

  const handleCreate = async () => {
    if (!user) return;
    const room = await roomStore.createRoom({
      hostId: user.id,
      hostName: user.displayName,
      name: roomName || `${selectedGrade}. Sınıf ${selectedSubject.toUpperCase()} Yarışı`,
      subject: selectedSubject,
      grade: selectedGrade,
      topicId: selectedTopicId || topics[0]?.id,
      settings: {
        team1Name,
        team2Name,
        totalRounds: roundCount,
        timePerQuestion,
        showLeaderboard,
        allowRejoin,
      }
    });
    setCreatedRoom(room);
    setStep(5);
  };

  const steps = [
    { title: 'Oda Bilgileri', icon: <Info size={18} /> },
    { title: 'Ders & Konu', icon: <BookOpen size={18} /> },
    { title: 'Oyun Ayarları', icon: <Settings2 size={18} /> },
    { title: 'Özet', icon: <Check size={18} /> },
  ];

  return (
    <DashboardLayout title="Yeni Oda Oluştur">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-12 px-4">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2 relative">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    step > i + 1 ? "bg-success text-white" : step === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" : "bg-background text-text-dark/40"
                  )}>
                    {step > i + 1 ? <Check size={20} /> : s.icon}
                  </div>
                  <span className={cn(
                    "text-xs font-black uppercase tracking-wider",
                    step === i + 1 ? "text-primary" : "text-text-dark/40"
                  )}>{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-1 mx-4 rounded-full transition-all",
                    step > i + 1 ? "bg-success" : "bg-background"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="bg-white rounded-[48px] p-10 shadow-xl border border-black/5 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-text-dark">Oda Bilgileri</h3>
                  <p className="text-text-dark/60 font-bold">Odanıza bir isim verin ve sınıf seviyesini seçin.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-text-dark/60 ml-1">ODA ADI</label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                      placeholder="Örn: 5-A Sınıfı Matematik Yarışı"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-text-dark/60 ml-1">SINIF SEVİYESİ</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((g) => (
                        <button
                          key={g}
                          onClick={() => setSelectedGrade(g as Grade)}
                          className={cn(
                            "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 font-black text-xl",
                            selectedGrade === g ? "border-primary bg-primary/5 text-primary" : "border-background text-text-dark/40"
                          )}
                        >
                          {g}. Sınıf
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-text-dark">Ders & Konu</h3>
                  <p className="text-text-dark/60 font-bold">Hangi dersten ve hangi konudan sorular sorulsun?</p>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => {
                          setSelectedSubject(s.key);
                          setSelectedTopicId('');
                        }}
                        className={cn(
                          "p-4 rounded-3xl border-2 transition-all flex items-center gap-4 font-black",
                          selectedSubject === s.key ? "border-primary bg-primary/5 text-primary" : "border-background text-text-dark/40"
                        )}
                      >
                        <span className="text-3xl">{s.icon}</span>
                        {s.name}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black text-text-dark/60 ml-1">KONU SEÇİMİ</label>
                    <select
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 px-6 font-bold outline-none transition-all appearance-none"
                    >
                      <option value="">Konu Seçin...</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-text-dark">Oyun Ayarları</h3>
                  <p className="text-text-dark/60 font-bold">Takım isimlerini ve oyun kurallarını belirleyin.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-text-dark/60 ml-1">TAKIM 1 ADI</label>
                      <input
                        type="text"
                        value={team1Name}
                        onChange={(e) => setTeam1Name(e.target.value)}
                        className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-text-dark/60 ml-1">TAKIM 2 ADI</label>
                      <input
                        type="text"
                        value={team2Name}
                        onChange={(e) => setTeam2Name(e.target.value)}
                        className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 px-6 font-bold outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-text-dark/60 ml-1">SORU SAYISI</label>
                      <div className="flex gap-2">
                        {[5, 10, 15, 20].map(n => (
                          <button
                            key={n}
                            onClick={() => setRoundCount(n)}
                            className={cn(
                              "flex-1 py-3 rounded-xl border-2 font-black transition-all",
                              roundCount === n ? "border-primary bg-primary text-white" : "border-background text-text-dark/40"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-text-dark/60 ml-1">SORU SÜRESİ (SN)</label>
                      <div className="flex gap-2">
                        {[15, 30, 45, 60].map(n => (
                          <button
                            key={n}
                            onClick={() => setTimePerQuestion(n)}
                            className={cn(
                              "flex-1 py-3 rounded-xl border-2 font-black transition-all",
                              timePerQuestion === n ? "border-primary bg-primary text-white" : "border-background text-text-dark/40"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="flex items-center justify-between p-4 bg-background rounded-2xl cursor-pointer">
                    <span className="font-bold text-text-dark">Sıralama Tablosunu Göster</span>
                    <input 
                      type="checkbox" 
                      checked={showLeaderboard} 
                      onChange={(e) => setShowLeaderboard(e.target.checked)}
                      className="w-6 h-6 rounded-lg text-primary focus:ring-primary" 
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-background rounded-2xl cursor-pointer">
                    <span className="font-bold text-text-dark">Katılıma Tekrar İzin Ver</span>
                    <input 
                      type="checkbox" 
                      checked={allowRejoin} 
                      onChange={(e) => setAllowRejoin(e.target.checked)}
                      className="w-6 h-6 rounded-lg text-primary focus:ring-primary" 
                    />
                  </label>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-2 text-center">
                  <h3 className="text-3xl font-black text-text-dark">Oda Özeti</h3>
                  <p className="text-text-dark/60 font-bold">Her şey hazır mı? Kontrol edin.</p>
                </div>

                <div className="bg-background rounded-[32px] p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-text-dark/40 uppercase">ODA ADI</p>
                      <p className="text-xl font-black">{roomName || 'İsimsiz Oda'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-dark/40 uppercase">DERS & SINIF</p>
                      <p className="text-xl font-black">{selectedSubject.toUpperCase()} • {selectedGrade}. Sınıf</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-dark/40 uppercase">KONU</p>
                      <p className="text-xl font-black">{topics.find(t => t.id === selectedTopicId)?.title || 'Genel'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-text-dark/40 uppercase">TAKIMLAR</p>
                      <p className="text-xl font-black">{team1Name} vs {team2Name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-dark/40 uppercase">AYARLAR</p>
                      <p className="text-xl font-black">{roundCount} Soru • {timePerQuestion}sn Süre</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && createdRoom && (
              <motion.div
                key="step5"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
              >
                <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center text-5xl">
                  🎉
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-text-dark">Oda Hazır!</h3>
                  <p className="text-xl font-bold text-text-dark/60">Öğrencilerin bu kodu girerek katılabilir.</p>
                </div>

                <div className="w-full max-w-sm">
                  <RoomQRDisplay 
                    roomCode={createdRoom.code}
                    roomName={createdRoom.name}
                    subject={createdRoom.subject}
                    grade={createdRoom.grade}
                    size="large"
                  />
                </div>

                <Button size="xl" className="w-full max-w-sm" onClick={() => navigate(`/dashboard/oda/${createdRoom.id}`)}>
                  Odaya Git <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 5 && (
            <div className="flex gap-4 mt-10 pt-10 border-t border-black/5">
              {step > 1 && (
                <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="mr-2" /> Geri
                </Button>
              )}
              <Button 
                size="lg" 
                className="flex-1" 
                onClick={() => step === 4 ? handleCreate() : setStep(step + 1)}
                disabled={step === 2 && !selectedTopicId && topics.length > 0}
              >
                {step === 4 ? 'Oda Oluştur' : 'Devam Et'} <ChevronRight className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
