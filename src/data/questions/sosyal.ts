import { Question } from '../../types';

const questions: Question[] = [];

for (let g = 1; g <= 4; g++) {
  for (let i = 1; i <= 25; i++) {
    questions.push({
      id: `sosyal_${g}_${i}`,
      topicId: `sos_g${g}_topic`,
      subjectKey: 'sosyal',
      grade: g as any,
      type: 'multiple_choice',
      question: `Sosyal Bilimler Soru ${g}-${i}: Başkentimiz neresidir?`,
      options: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'],
      correctAnswer: '1',
      difficulty: g > 2 ? 2 : 1 as any,
    });
  }
}

export default questions;
