import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import GameCard from '../components/ui/GameCard';
import { ArrowLeft, Swords, Trophy } from 'lucide-react';
import Button from '../components/ui/Button';
import { Game } from '../types';

const GAMES: Game[] = [
  {
    id: 'tug-of-war',
    title: 'İp Çekmece',
    description: 'Soruları hızlı cevapla, rakibini kendi tarafına çek!',
    icon: <Swords size={64} />,
    players: '2 Oyuncu',
    path: '/ip-cekme'
  },
  {
    id: 'quiz-battle',
    title: 'Bilgi Yarışı',
    description: 'En çok doğruyu sen yap, kupayı sen kazan!',
    icon: <Trophy size={64} />,
    players: '1-4 Oyuncu',
    path: '/quiz'
  }
];

export default function GameSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, grade, topic } = location.state || {};

  return (
    <AppShell>
      <div className="flex-1 flex flex-col p-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <Button variant="ghost" onClick={() => navigate('/dersler', { state: { subject } })}>
            <ArrowLeft /> Geri
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-text-dark">Oyununu Seç</h1>
            <p className="text-primary font-bold">{subject} • {grade}. Sınıf • {topic?.title}</p>
          </div>
          
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.icon}
                players={game.players}
                onClick={() => navigate(game.path, { state: { ...location.state, gameId: game.id } })}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
