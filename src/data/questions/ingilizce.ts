import { Question } from '../../types';

const questions: Question[] = [];

for (let g = 1; g <= 4; g++) {
  for (let i = 1; i <= 25; i++) {
    questions.push({
      id: `ingilizce_${g}_${i}`,
      topicId: `ing_g${g}_topic`,
      subjectKey: 'ingilizce',
      grade: g as any,
      type: 'multiple_choice',
      question: `English Question ${g}-${i}: What color is 'Mavi'?`,
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctAnswer: '1',
      difficulty: g > 2 ? 2 : 1 as any,
    });
  }
}

export default questions;
