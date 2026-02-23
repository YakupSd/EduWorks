import { motion, AnimatePresence } from 'motion/react';
import { Question, TeamConfig } from '../../types';
import { cn } from '../../utils/cn';
import Numpad from './Numpad';
import { useState } from 'react';
import AnimatedNumber from './AnimatedNumber';
import MultipleChoiceOptions from './MultipleChoiceOptions';

interface TeamScorePanelProps {
  team: TeamConfig;
  score: number;
  currentQuestion: Question | null;
  side: 'left' | 'right';
  onAnswer: (answer: string) => void;
}

export default function TeamScorePanel({ team, score, currentQuestion, side, onAnswer }: TeamScorePanelProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onAnswer(inputValue);
    setInputValue('');
  };

  const handleMCSelect = (index: number) => {
    onAnswer(index.toString());
  };

  return (
    <div className={cn(
      "h-full flex flex-col w-full max-w-[400px] bg-white shadow-2xl z-10",
      side === 'left' ? "rounded-r-[40px]" : "rounded-l-[40px]"
    )}>
      {/* Team Header */}
      <div 
        className="p-8 flex flex-col items-center gap-2 text-white"
        style={{ backgroundColor: team.color }}
      >
        <div className="text-5xl">{team.icon}</div>
        <h2 className="text-2xl font-black uppercase tracking-wider">{team.name}</h2>
        <div className="text-6xl font-black mt-2">
          <AnimatedNumber value={score} />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center gap-8">
        <AnimatePresence mode="wait">
          {currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <div className="bg-background p-6 rounded-3xl w-full text-center shadow-inner">
                <p className="text-2xl font-black text-text-dark leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {currentQuestion.type === 'numeric' && (
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="w-full h-20 bg-white border-4 border-dashed border-primary/30 rounded-2xl flex items-center justify-center text-4xl font-black text-primary">
                    {inputValue || '?'}
                  </div>
                  <Numpad 
                    value={inputValue} 
                    onChange={setInputValue} 
                    onSubmit={handleSubmit}
                    onClear={() => setInputValue('')}
                  />
                </div>
              )}

              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <MultipleChoiceOptions 
                  options={currentQuestion.options}
                  selected={null}
                  onSelect={handleMCSelect}
                />
              )}
            </motion.div>
          ) : (
            <div className="text-text-dark/20 font-black text-3xl text-center">
              SORU BEKLENİYOR...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
