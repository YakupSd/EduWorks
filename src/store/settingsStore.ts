import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  team1Name: string;
  team2Name: string;
  roundCount: number;
  timePerQuestion: number;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  
  setTeam1Name: (name: string) => void;
  setTeam2Name: (name: string) => void;
  setRoundCount: (count: number) => void;
  setTimePerQuestion: (time: number) => void;
  toggleSound: () => void;
  toggleAnimations: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      team1Name: 'Takım 1',
      team2Name: 'Takım 2',
      roundCount: 10,
      timePerQuestion: 30,
      soundEnabled: true,
      animationsEnabled: true,

      setTeam1Name: (team1Name) => set({ team1Name }),
      setTeam2Name: (team2Name) => set({ team2Name }),
      setRoundCount: (roundCount) => set({ roundCount }),
      setTimePerQuestion: (timePerQuestion) => set({ timePerQuestion }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
    }),
    {
      name: 'edusavas-settings',
    }
  )
);
