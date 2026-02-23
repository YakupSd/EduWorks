import { create } from 'zustand';
import { Room, RoomSettings, RoomPlayer, RoomResult } from '../types/auth';
import { SubjectKey, Grade } from '../types/index';

interface CreateRoomConfig {
  hostId: string;
  hostName: string;
  name: string;
  subject: SubjectKey;
  grade: Grade;
  topicId: string;
  settings: Partial<RoomSettings>;
}

interface RoomState {
  currentRoom: Room | null;
  myRooms: Room[];
  roomHistory: RoomResult[];
  isLoading: boolean;
  error: string | null;

  createRoom: (config: CreateRoomConfig) => Promise<Room>;
  updateRoomSettings: (roomId: string, settings: Partial<RoomSettings>) => void;
  deleteRoom: (roomId: string) => void;
  startGame: (roomId: string) => void;
  endGame: (roomId: string, result: RoomResult) => void;
  kickPlayer: (roomId: string, userId: string) => void;
  joinRoom: (code: string, player: Partial<RoomPlayer>) => Promise<Room>;
  leaveRoom: () => void;
  getRoom: (code: string) => Room | null;
  loadMyRooms: (hostId: string) => void;
  loadHistory: () => void;
  generateRoomCode: () => string;
}

const DEFAULT_SETTINGS: RoomSettings = {
  maxPlayers: 2,
  timePerQuestion: 30,
  totalRounds: 10,
  showLeaderboard: true,
  allowRejoin: true,
  team1Name: 'Takım 1',
  team2Name: 'Takım 2',
  isPublic: false,
};

export const useRoomStore = create<RoomState>((set, get) => ({
  currentRoom: null,
  myRooms: [],
  roomHistory: [],
  isLoading: false,
  error: null,

  createRoom: async (config) => {
    set({ isLoading: true });
    const code = get().generateRoomCode();
    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      code,
      hostId: config.hostId,
      hostName: config.hostName,
      name: config.name,
      subject: config.subject,
      grade: config.grade,
      topicId: config.topicId,
      gameType: 'tug_of_war',
      status: 'waiting',
      settings: { ...DEFAULT_SETTINGS, ...config.settings },
      players: [],
      createdAt: Date.now(),
    };

    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    allRooms.push(newRoom);
    localStorage.setItem('edusavas_rooms', JSON.stringify(allRooms));

    set({ currentRoom: newRoom, isLoading: false });
    return newRoom;
  },

  updateRoomSettings: (roomId, settings) => {
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    const roomIndex = allRooms.findIndex((r: Room) => r.id === roomId);
    if (roomIndex !== -1) {
      allRooms[roomIndex].settings = { ...allRooms[roomIndex].settings, ...settings };
      localStorage.setItem('edusavas_rooms', JSON.stringify(allRooms));
      if (get().currentRoom?.id === roomId) {
        set({ currentRoom: allRooms[roomIndex] });
      }
    }
  },

  deleteRoom: (roomId) => {
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    const filtered = allRooms.filter((r: Room) => r.id !== roomId);
    localStorage.setItem('edusavas_rooms', JSON.stringify(filtered));
    if (get().currentRoom?.id === roomId) set({ currentRoom: null });
  },

  startGame: (roomId) => {
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    const roomIndex = allRooms.findIndex((r: Room) => r.id === roomId);
    if (roomIndex !== -1) {
      allRooms[roomIndex].status = 'playing';
      allRooms[roomIndex].startedAt = Date.now();
      localStorage.setItem('edusavas_rooms', JSON.stringify(allRooms));
      if (get().currentRoom?.id === roomId) set({ currentRoom: allRooms[roomIndex] });
    }
  },

  endGame: (roomId, result) => {
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    const roomIndex = allRooms.findIndex((r: Room) => r.id === roomId);
    if (roomIndex !== -1) {
      allRooms[roomIndex].status = 'finished';
      allRooms[roomIndex].finishedAt = Date.now();
      localStorage.setItem('edusavas_rooms', JSON.stringify(allRooms));
      
      const historyRaw = localStorage.getItem('edusavas_history');
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      history.push(result);
      localStorage.setItem('edusavas_history', JSON.stringify(history));
      
      if (get().currentRoom?.id === roomId) set({ currentRoom: allRooms[roomIndex], roomHistory: history });
    }
  },

  kickPlayer: (roomId, userId) => {
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    const roomIndex = allRooms.findIndex((r: Room) => r.id === roomId);
    if (roomIndex !== -1) {
      allRooms[roomIndex].players = allRooms[roomIndex].players.filter((p: RoomPlayer) => p.userId !== userId);
      localStorage.setItem('edusavas_rooms', JSON.stringify(allRooms));
      if (get().currentRoom?.id === roomId) set({ currentRoom: allRooms[roomIndex] });
    }
  },

  joinRoom: async (code, player) => {
    set({ isLoading: true, error: null });
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    const roomIndex = allRooms.findIndex((r: Room) => r.code === code.toUpperCase());

    if (roomIndex === -1) {
      set({ isLoading: false, error: 'Oda bulunamadı.' });
      throw new Error('Oda bulunamadı.');
    }

    const room = allRooms[roomIndex];
    if (room.status !== 'waiting') {
      set({ isLoading: false, error: 'Oyun zaten başladı.' });
      throw new Error('Oyun zaten başladı.');
    }

    if (room.players.length >= room.settings.maxPlayers) {
      set({ isLoading: false, error: 'Oda dolu.' });
      throw new Error('Oda dolu.');
    }

    const newPlayer: RoomPlayer = {
      userId: player.userId || 'temp_' + Math.random().toString(36).substr(2, 9),
      displayName: player.displayName || 'İsimsiz',
      teamId: (room.players.length % 2 + 1) as 1 | 2,
      isReady: false,
      joinedAt: Date.now(),
      isHost: false,
    };

    room.players.push(newPlayer);
    localStorage.setItem('edusavas_rooms', JSON.stringify(allRooms));
    set({ currentRoom: room, isLoading: false });
    return room;
  },

  leaveRoom: () => set({ currentRoom: null }),

  getRoom: (code) => {
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    return allRooms.find((r: Room) => r.code === code.toUpperCase()) || null;
  },

  loadMyRooms: (hostId) => {
    const allRoomsRaw = localStorage.getItem('edusavas_rooms');
    const allRooms = allRoomsRaw ? JSON.parse(allRoomsRaw) : [];
    const myRooms = allRooms.filter((r: Room) => r.hostId === hostId);
    set({ myRooms });
  },

  loadHistory: () => {
    const historyRaw = localStorage.getItem('edusavas_history');
    const roomHistory = historyRaw ? JSON.parse(historyRaw) : [];
    set({ roomHistory });
  },

  generateRoomCode: () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `EDU-${code}`;
  },
}));
