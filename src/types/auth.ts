import { SubjectKey, Grade, RoundResult } from './index';

export type UserRole = 'teacher' | 'student' | 'guest';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  schoolName?: string;
  createdAt: number;
  avatar?: string;           // emoji avatar for fun
}

export interface Room {
  id: string;
  code: string;             // "EDU-4X9K" format
  hostId: string;           // teacher user id
  hostName: string;
  name: string;             // "5-A Sınıfı Matematik"
  subject: SubjectKey;
  grade: Grade;
  topicId: string;
  gameType: 'tug_of_war';
  status: 'waiting' | 'starting' | 'playing' | 'finished';
  settings: RoomSettings;
  players: RoomPlayer[];
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
}

export interface RoomSettings {
  maxPlayers: number;         // 2 for tug of war (2 teams)
  timePerQuestion: number;
  totalRounds: number;
  showLeaderboard: boolean;
  allowRejoin: boolean;
  team1Name: string;
  team2Name: string;
  isPublic: boolean;          // show in discover? (future)
}

export interface RoomPlayer {
  userId: string;
  displayName: string;
  avatar?: string;
  teamId: 1 | 2;
  isReady: boolean;
  joinedAt: number;
  isHost: boolean;
}

export interface RoomResult {
  roomId: string;
  roomCode: string;
  subject: SubjectKey;
  topicTitle: string;
  grade: Grade;
  playedAt: number;
  duration: number;          // seconds
  winner: 1 | 2 | 'draw';
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  roundDetails: RoundResult[];
}
