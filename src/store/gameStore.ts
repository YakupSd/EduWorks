import { create } from 'zustand';
import { GameSession, Question, SubjectKey, Grade, RoundResult } from '../types';
import { getQuestions, checkAnswer } from '../data/questions';
import { playSound } from '../utils/sounds';

interface GameState {
  session: GameSession | null;
  _questionQueue: Question[];
  _currentQuestionIndex: number;
  _team1AnsweredThisRound: boolean;
  _team2AnsweredThisRound: boolean;
  _currentRoundResults: Partial<RoundResult>;

  initSession: (config: {
    subject: SubjectKey;
    topicId: string;
    grade: Grade;
    team1Name: string;
    team2Name: string;
    totalRounds: number;
    timePerQuestion: number;
  }) => void;

  startCountdown: () => void;
  startRound: () => void;
  submitAnswer: (teamId: 1 | 2, answer: string, timeMs: number) => void;
  endRound: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  getCurrentQuestion: () => Question | null;
}

export const useGameStore = create<GameState>((set, get) => ({
  session: null,
  _questionQueue: [],
  _currentQuestionIndex: 0,
  _team1AnsweredThisRound: false,
  _team2AnsweredThisRound: false,
  _currentRoundResults: {},

  initSession: (config) => {
    const questions = getQuestions(config.topicId, config.totalRounds);
    
    const session: GameSession = {
      id: Math.random().toString(36).substr(2, 9),
      subjectKey: config.subject,
      topicId: config.topicId,
      grade: config.grade,
      gameType: 'tug_of_war',
      team1: { id: 1, name: config.team1Name, color: '#3B82F6', score: 0 },
      team2: { id: 2, name: config.team2Name, color: '#EF4444', score: 0 },
      currentRound: 1,
      totalRounds: config.totalRounds,
      ropePosition: 0,
      timePerQuestion: config.timePerQuestion,
      status: 'idle',
      winner: null,
      questionHistory: [],
    };

    set({
      session,
      _questionQueue: questions,
      _currentQuestionIndex: 0,
      _team1AnsweredThisRound: false,
      _team2AnsweredThisRound: false,
      _currentRoundResults: {},
    });
  },

  startCountdown: () => {
    const { session } = get();
    if (!session) return;
    set({ session: { ...session, status: 'countdown' } });
    playSound('tick');
  },

  startRound: () => {
    const { session } = get();
    if (!session) return;
    set({ 
      session: { ...session, status: 'playing' },
      _team1AnsweredThisRound: false,
      _team2AnsweredThisRound: false,
      _currentRoundResults: {
        round: session.currentRound,
        questionId: get()._questionQueue[get()._currentQuestionIndex]?.id,
      }
    });
  },

  submitAnswer: (teamId, answer, timeMs) => {
    const { session, _questionQueue, _currentQuestionIndex, _team1AnsweredThisRound, _team2AnsweredThisRound } = get();
    if (!session || session.status !== 'playing') return;

    const question = _questionQueue[_currentQuestionIndex];
    const isCorrect = checkAnswer(question, answer);

    if (isCorrect) playSound('correct');
    else playSound('wrong');

    const update: any = {};
    if (teamId === 1) {
      update._team1AnsweredThisRound = true;
      update._currentRoundResults = {
        ...get()._currentRoundResults,
        team1Answer: answer,
        team1Correct: isCorrect,
        team1Time: timeMs,
      };
    } else {
      update._team2AnsweredThisRound = true;
      update._currentRoundResults = {
        ...get()._currentRoundResults,
        team2Answer: answer,
        team2Correct: isCorrect,
        team2Time: timeMs,
      };
    }

    set(update);

    // If both answered, end round
    if ((teamId === 1 && _team2AnsweredThisRound) || (teamId === 2 && _team1AnsweredThisRound)) {
      get().endRound();
    }
  },

  endRound: () => {
    const { session, _currentRoundResults, _currentQuestionIndex } = get();
    if (!session) return;

    const res = _currentRoundResults as RoundResult;
    let ropeMovement = 0;

    if (res.team1Correct && !res.team2Correct) {
      ropeMovement = 1;
    } else if (!res.team1Correct && res.team2Correct) {
      ropeMovement = -1;
    } else if (res.team1Correct && res.team2Correct) {
      if (res.team1Time < res.team2Time) ropeMovement = 1;
      else if (res.team2Time < res.team1Time) ropeMovement = -1;
    }

    if (ropeMovement !== 0) playSound('woosh');

    const newRopePosition = Math.max(-5, Math.min(5, session.ropePosition + ropeMovement));
    const newTeam1Score = session.team1.score + (res.team1Correct ? 10 : 0);
    const newTeam2Score = session.team2.score + (res.team2Correct ? 10 : 0);

    const isLastRound = session.currentRound === session.totalRounds;
    const isKnockout = Math.abs(newRopePosition) === 5;

    let status = session.status;
    let winner = session.winner;

    if (isLastRound || isKnockout) {
      status = 'finished';
      if (newRopePosition > 0) winner = 1;
      else if (newRopePosition < 0) winner = 2;
      else {
        if (newTeam1Score > newTeam2Score) winner = 1;
        else if (newTeam2Score > newTeam1Score) winner = 2;
        else winner = 'draw';
      }
      playSound('fanfare');
    }

    set({
      session: {
        ...session,
        currentRound: session.currentRound + 1,
        ropePosition: newRopePosition,
        team1: { ...session.team1, score: newTeam1Score },
        team2: { ...session.team2, score: newTeam2Score },
        status: status === 'finished' ? 'finished' : 'idle',
        winner,
        questionHistory: [...session.questionHistory, { ...res, ropeMovement }],
      },
      _currentQuestionIndex: _currentQuestionIndex + 1,
    });
  },

  pauseGame: () => {
    const { session } = get();
    if (session) set({ session: { ...session, status: 'paused' } });
  },

  resumeGame: () => {
    const { session } = get();
    if (session) set({ session: { ...session, status: 'playing' } });
  },

  endGame: () => {
    const { session } = get();
    if (session) set({ session: { ...session, status: 'finished' } });
  },

  resetGame: () => set({ session: null, _questionQueue: [], _currentQuestionIndex: 0 }),

  getCurrentQuestion: () => {
    const { _questionQueue, _currentQuestionIndex } = get();
    return _questionQueue[_currentQuestionIndex] || null;
  },
}));
