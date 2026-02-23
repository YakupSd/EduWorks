import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import GradeSelector from '../components/ui/GradeSelector';
import TopicSelector from '../components/ui/TopicSelector';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { Topic, SubjectKey, Grade } from '../types';
import { getTopics } from '../data/questions';
import { useSelectionStore } from '../store/selectionStore';

export default function SubjectsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = useSelectionStore();
  
  const subjectTitle = location.state?.subject || 'Matematik';
  const subjectKey = subjectTitle.toLowerCase().replace(' ', '') as SubjectKey;

  const [step, setStep] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const topics = useMemo(() => {
    return getTopics(subjectKey, selectedGrade);
  }, [subjectKey, selectedGrade]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      selection.setGrade(selectedGrade);
    } else if (step === 2 && selectedTopic) {
      selection.setTopic(selectedTopic.id);
      navigate('/oyun-sec', { 
        state: { 
          subject: subjectTitle, 
          grade: selectedGrade, 
          topic: selectedTopic 
        } 
      });
    }
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col p-8 max-w-6xl mx-auto w-full">
        {/* Header / Breadcrumbs */}
        <div className="flex items-center justify-between mb-12">
          <Button variant="ghost" onClick={() => step === 1 ? navigate('/') : setStep(1)}>
            <ArrowLeft /> Geri
          </Button>
          
          <div className="flex items-center gap-4 text-xl font-black">
            <span className="text-primary">{subjectTitle}</span>
            <ChevronRight className="opacity-30" />
            <span className={step >= 1 ? "text-primary" : "opacity-30"}>{selectedGrade}. Sınıf</span>
            <ChevronRight className="opacity-30" />
            <span className={step >= 2 ? "text-primary" : "opacity-30"}>
              {selectedTopic ? selectedTopic.title : 'Konu Seç'}
            </span>
          </div>
          
          <div className="w-24" /> {/* Spacer */}
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="w-full flex flex-col items-center gap-12"
              >
                <h2 className="text-5xl font-black text-text-dark">Kaçıncı Sınıfsın?</h2>
                <GradeSelector 
                  grades={[1, 2, 3, 4]} 
                  selected={selectedGrade} 
                  onChange={(g) => {
                    setSelectedGrade(g as Grade);
                    handleNext();
                  }} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="w-full flex flex-col items-center gap-12"
              >
                <h2 className="text-5xl font-black text-text-dark">Hangi Konuda Yarışacaksın?</h2>
                <TopicSelector 
                  topics={topics} 
                  selected={selectedTopic?.id || null} 
                  onChange={(t) => {
                    setSelectedTopic(t);
                  }} 
                />
                <Button 
                  variant="primary" 
                  size="xl" 
                  disabled={!selectedTopic}
                  onClick={handleNext}
                >
                  DEVAM ET <ChevronRight />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
