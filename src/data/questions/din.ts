import { Question } from '../../types';

const questions: Question[] = [];

for (let g = 1; g <= 4; g++) {
  for (let i = 1; i <= 25; i++) {
    questions.push({
      id: `din_${g}_${i}`,
      topicId: `din_g${g}_topic`,
      subjectKey: 'din',
      grade: g as any,
      type: 'multiple_choice',
      question: `Din Kültürü Soru ${g}-${i}: Hangisi bir ibadettir?`,
      options: ['Oyun oynamak', 'Namaz kılmak', 'Uyumak', 'Yemek yemek'],
      correctAnswer: '1',
      difficulty: g > 2 ? 2 : 1 as any,
    });
  }
}

export default questions;
