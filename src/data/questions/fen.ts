import { Question } from '../../types';

const questions: Question[] = [];

for (let g = 1; g <= 4; g++) {
  for (let i = 1; i <= 25; i++) {
    questions.push({
      id: `fen_${g}_${i}`,
      topicId: `fen_g${g}_topic`,
      subjectKey: 'fen',
      grade: g as any,
      type: 'multiple_choice',
      question: `Fen Bilgisi Soru ${g}-${i}: Hangisi canlıdır?`,
      options: ['Taş', 'Kedi', 'Masa', 'Kalem'],
      correctAnswer: '1',
      difficulty: g > 2 ? 2 : 1 as any,
    });
  }
}

export default questions;
