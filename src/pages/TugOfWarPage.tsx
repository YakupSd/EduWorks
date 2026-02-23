import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import TeamScorePanel from '../components/ui/TeamScorePanel';
import TugRope from '../components/game/TugRope';
import Timer from '../components/ui/Timer';
import { SubjectKey, Grade } from '../types';
import Button from '../components/ui/Button';
import { Home, RefreshCw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';

export default function TugOfWarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, grade, topic } = location.state || {};
  
  const game = useGameStore();
  const settings = useSettingsStore();

  useEffect(() => {
    if (!topic) {
      navigate('/');
      return;
    }

    game.initSession({
      subject: subject.toLowerCase().replace(' ', '') as SubjectKey,
      topicId: topic.id,
      grade: grade as Grade,
      team1Name: settings.team1Name,
      team2Name: settings.team2Name,
      totalRounds: settings.roundCount,
      timePerQuestion: settings.timePerQuestion,
    });
    
    game.startCountdown();
    
    // Start first round after countdown (simulated for now)
    const timer = setTimeout(() => {
      game.startRound();
    }, 3000);

    return () => {
      clearTimeout(timer);
      game.resetGame();
    };
  }, []);

  const handleAnswer = (teamId: 1 | 2, answer: string) => {
    // In a real implementation, we'd track timeMs
    game.submitAnswer(teamId, answer, Date.now());
  };

  if (!game.session) return null;

  const { session } = game;
  const currentQuestion = game.getCurrentQuestion();

  return (
    <AppShell>
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Side */}
        <TeamScorePanel
          team={session.team1}
          score={session.team1.score}
          currentQuestion={currentQuestion}
          side="left"
          onAnswer={(ans) => handleAnswer(1, ans)}
        />

        {/* Game Center Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="h-32 flex items-center justify-center gap-12 bg-white/50 backdrop-blur-md border-b border-black/5">
            <div className="text-center">
              <p className="text-xs font-black text-text-dark/40 uppercase tracking-widest">KONU</p>
              <p className="text-xl font-black text-primary">{topic?.title || 'Genel Tekrar'}</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs font-black text-text-dark/40 uppercase tracking-widest">TUR</p>
              <p className="text-xl font-black text-primary">{session.currentRound} / {session.totalRounds}</p>
            </div>
            
            <Timer 
              seconds={session.timePerQuestion} 
              isRunning={session.status === 'playing'} 
              onEnd={() => game.endRound()} 
            />

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home size={20} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw size={20} />
              </Button>
            </div>
          </div>

          {/* Rope Area */}
          <div className="flex-1 relative">
            <TugRope 
              ropePosition={session.ropePosition * 20} // Map -5..5 to -100..100
              isGameOver={session.status === 'finished'} 
              winner={session.winner === 1 ? 'left' : session.winner === 2 ? 'right' : undefined} 
            />
          </div>
        </div>

        {/* Right Side */}
        <TeamScorePanel
          team={session.team2}
          score={session.team2.score}
          currentQuestion={currentQuestion}
          side="right"
          onAnswer={(ans) => handleAnswer(2, ans)}
        />
      </div>
    </AppShell>
  );
}
