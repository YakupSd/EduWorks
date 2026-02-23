import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import { subjectColors } from '../styles/theme';
import { ChevronRight, Play, Users, Trophy, BarChart3, BookOpen, Palette, Zap } from 'lucide-react';

const subjects = [
  { name: 'Matematik', icon: '🔢' },
  { name: 'Türkçe', icon: '📖' },
  { name: 'Fen Bilgisi', icon: '🧪' },
  { name: 'Sosyal Bilimler', icon: '🌍' },
  { name: 'İngilizce', icon: '🇬🇧' },
  { name: 'Din Kültürü', icon: '🕌' },
];

const features = [
  { title: 'İp Çekme Oyunu', desc: 'Matematik ve diğer dersler için eğlenceli rekabet.', icon: <Zap className="text-primary" /> },
  { title: 'Özel Oda Sistemi', desc: 'Sınıfınıza özel kod ile güvenli oyun.', icon: <Users className="text-team-1" /> },
  { title: 'Anlık Sıralama', desc: 'Canlı Top 10 listesi ile motivasyon.', icon: <Trophy className="text-warning" /> },
  { title: 'Öğretmen Paneli', desc: 'Öğrenci gelişimini ve istatistikleri takip edin.', icon: <BarChart3 className="text-success" /> },
  { title: 'Zengin Soru Havuzu', desc: 'Her ders için özenle hazırlanmış 100+ soru.', icon: <BookOpen className="text-primary" /> },
  { title: 'Eğlenceli Tasarım', desc: 'Çocukların ilgisini çeken renkli arayüz.', icon: <Palette className="text-team-2" /> },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="z-10 max-w-4xl"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-8xl font-black text-primary tracking-tighter drop-shadow-2xl">
                EduSavaş
              </h1>
              <span className="text-7xl animate-pulse">⚡</span>
            </div>
            <h2 className="text-4xl font-black text-text-dark mb-4">
              Sınıfı oyun alanına çevir!
            </h2>
            <p className="text-2xl font-bold text-text-dark/60 mb-12">
              Öğrencilerin birbirleriyle yarışarak öğrendiği interaktif eğitim platformu.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button size="xl" onClick={() => navigate('/giris')}>
                🎓 Öğretmen Girişi
              </Button>
              <Button variant="secondary" size="xl" onClick={() => navigate('/kat')}>
                🎮 Hızlı Oyna
              </Button>
            </div>
            
            <motion.button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-16 text-primary font-black flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              Nasıl Çalışır?
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity }}>
                ↓
              </motion.div>
            </motion.button>
          </motion.div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-5xl font-black text-center text-text-dark mb-20">Nasıl Çalışır?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Lines (Desktop) */}
              <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-1 border-t-4 border-dashed border-primary/20 -z-10" />
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl shadow-xl shadow-primary/30">
                  📝
                </div>
                <h3 className="text-2xl font-black">Ders & Konu Seç</h3>
                <p className="text-text-dark/60 font-bold">Müfredata uygun zengin içeriklerden dilediğini seç.</p>
              </div>
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-24 h-24 bg-team-1 text-white rounded-full flex items-center justify-center text-4xl shadow-xl shadow-team-1/30">
                  🔑
                </div>
                <h3 className="text-2xl font-black">Oda Oluştur & Kod Paylaş</h3>
                <p className="text-text-dark/60 font-bold">Odanı kur, 6 haneli kodu öğrencilerinle paylaş.</p>
              </div>
              
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-24 h-24 bg-success text-white rounded-full flex items-center justify-center text-4xl shadow-xl shadow-success/30">
                  🏆
                </div>
                <h3 className="text-2xl font-black">Yarışın & Eğlenin</h3>
                <p className="text-text-dark/60 font-bold">Öğrenciler yarışırken sen gelişimi takip et.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subjects Marquee */}
        <section className="py-20 overflow-hidden bg-primary/5">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {[...subjects, ...subjects].map((s, i) => (
              <div key={i} className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-sm border border-primary/10">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xl font-black text-text-dark">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-black text-center text-text-dark mb-20">Özellikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-[32px] shadow-xl border border-black/5"
              >
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mb-6 text-2xl">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black mb-3">{f.title}</h3>
                <p className="text-text-dark/60 font-bold leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-text-dark text-white text-center">
          <div className="max-w-6xl mx-auto px-8 flex flex-col items-center gap-8">
            <h2 className="text-3xl font-black tracking-tighter">EduSavaş⚡</h2>
            <div className="flex gap-8 font-bold opacity-60">
              <a href="#" className="hover:text-primary transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-primary transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-primary transition-colors">İletişim</a>
            </div>
            <p className="opacity-40 font-bold">© 2026 EduSavaş. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </AppShell>
  );
}
