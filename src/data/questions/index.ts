import { Question, SubjectKey, Grade, Topic } from '../../types';
import matematik from './matematik';
import turkce from './turkce';
import fen from './fen';
import sosyal from './sosyal';
import ingilizce from './ingilizce';
import din from './din';

const allQuestions: Question[] = [
  ...matematik,
  ...turkce,
  ...fen,
  ...sosyal,
  ...ingilizce,
  ...din,
];

export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function getTopics(subject: SubjectKey, grade: Grade): Topic[] {
  const subjectQuestions = allQuestions.filter(q => q.subjectKey === subject && q.grade === grade);
  const topicMap = new Map<string, Topic>();

  subjectQuestions.forEach(q => {
    if (!topicMap.has(q.topicId)) {
      topicMap.set(q.topicId, {
        id: q.topicId,
        subjectKey: subject,
        grade: grade,
        title: q.topicId.split('_').pop()?.toUpperCase() || 'Konu',
        questionCount: 0
      });
    }
    const topic = topicMap.get(q.topicId)!;
    topic.questionCount++;
  });

  return Array.from(topicMap.values());
}

export function getQuestions(topicId: string, count?: number): Question[] {
  const filtered = allQuestions.filter(q => q.topicId === topicId);
  const shuffled = shuffleArray(filtered);
  return count ? shuffled.slice(0, count) : shuffled;
}

export function getRandomQuestions(subject: SubjectKey, grade: Grade, count: number): Question[] {
  const filtered = allQuestions.filter(q => q.subjectKey === subject && q.grade === grade);
  const shuffled = shuffleArray(filtered);
  return shuffled.slice(0, count);
}

export function checkAnswer(question: Question, userAnswer: string): boolean {
  if (question.type === 'numeric') {
    return question.correctAnswer.trim() === userAnswer.trim();
  }
  // Multiple choice or true/false
  return question.correctAnswer === userAnswer;
}

export default allQuestions;
