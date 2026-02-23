import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SubjectCard from '../components/ui/SubjectCard';
import { subjectColors } from '../styles/theme';
import { Settings } from 'lucide-react';
import Button from '../components/ui/Button';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const subjects = [
  { title: 'Matematik', icon: '🔢' },
  { title: 'Türkçe', icon: '📖' },
  { title: 'Fen Bilgisi', icon: '🧪' },
  { title: 'Sosyal Bilimler', icon: '🌍' },
  { title: 'İngilizce', icon: '🇬🇧' },
  { title: 'Din Kültürü', icon: '🕌' },
];

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C63FF', '#3B82F6', '#EF4444', '#22C55E', '#F59E0B']
    });
  }, []);

  return (
    <AppShell>
      <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
        {/* Logo Section */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="relative">
            <h1 className="text-8xl font-black text-primary tracking-tighter drop-shadow-2xl">
              EduSavaş
            </h1>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-6 -right-12 text-6xl"
            >
              ⚡
            </motion.div>
          </div>
          <p className="text-2xl font-bold text-text-dark/60 mt-4">
            Öğrenerek Kazan, Oynayarak Büyü!
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <SubjectCard
                title={subject.title}
                icon={subject.icon}
                color={subjectColors[subject.title]}
                onClick={() => navigate('/dersler', { state: { subject: subject.title } })}
              />
            </motion.div>
          ))}
        </div>

        {/* Floating Settings Button */}
        <div className="fixed bottom-10 right-10">
          <Button 
            variant="secondary" 
            size="xl" 
            className="rounded-full w-20 h-20 p-0 shadow-2xl"
            onClick={() => navigate('/ayarlar')}
          >
            <Settings size={40} />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
