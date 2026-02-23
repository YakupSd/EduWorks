import { ReactNode } from 'react';

export type Grade = 1 | 2 | 3 | 4;

export type SubjectKey =
  | 'matematik'
  | 'turkce'
  | 'fen'
  | 'sosyal'
  | 'ingilizce'
  | 'din';

export type QuestionType = 'numeric' | 'multiple_choice' | 'true_false';

export interface Topic {
  id: string;
  subjectKey: SubjectKey;
  grade: Grade;
  title: string;          // Turkish topic name
  questionCount: number;  // auto-calculated
}

export interface Question {
  id: string;
  topicId: string;
  subjectKey: SubjectKey;
  grade: Grade;
  type: QuestionType;
  question: string;       // Turkish question text
  options?: string[];     // for multiple_choice (4 options)
  correctAnswer: string;  // number as string for numeric, option index as string for MC
  hint?: string;
  difficulty: 1 | 2 | 3;
}

export interface TeamConfig {
  id: 1 | 2;
  name: string;           // "Takım 1" or custom
  color: string;
  score: number;
  icon?: ReactNode;       // Kept from previous turn for UI
}

export interface GameSession {
  id: string;
  subjectKey: SubjectKey;
  topicId: string;
  grade: Grade;
  gameType: 'tug_of_war';
  team1: TeamConfig;
  team2: TeamConfig;
  currentRound: number;
  totalRounds: number;    // e.g. 10
  ropePosition: number;   // -5 to +5 (steps), 0 = center
  timePerQuestion: number; // seconds, default 30
  status: 'idle' | 'countdown' | 'playing' | 'paused' | 'finished';
  winner: null | 1 | 2 | 'draw';
  questionHistory: RoundResult[];
}

export interface RoundResult {
  round: number;
  questionId: string;
  team1Answer: string | null;
  team2Answer: string | null;
  team1Correct: boolean;
  team2Correct: boolean;
  team1Time: number;      // ms to answer
  team2Time: number;
  ropeMovement: number;   // how much rope moved this round
}

// Kept for UI compatibility from previous turn
export interface Game {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  players: string;
  path: string;
}

export * from './auth';
