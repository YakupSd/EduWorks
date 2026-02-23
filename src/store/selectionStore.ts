import { create } from 'zustand';
import { SubjectKey, Grade } from '../types';

interface SelectionState {
  selectedSubject: SubjectKey | null;
  selectedGrade: Grade | null;
  selectedTopicId: string | null;
  selectedGame: 'tug_of_war' | null;

  setSubject: (subject: SubjectKey) => void;
  setGrade: (grade: Grade) => void;
  setTopic: (topicId: string) => void;
  setGame: (game: 'tug_of_war') => void;
  reset: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedSubject: null,
  selectedGrade: null,
  selectedTopicId: null,
  selectedGame: null,

  setSubject: (selectedSubject) => set({ selectedSubject }),
  setGrade: (selectedGrade) => set({ selectedGrade }),
  setTopic: (selectedTopicId) => set({ selectedTopicId }),
  setGame: (selectedGame) => set({ selectedGame }),
  reset: () => set({
    selectedSubject: null,
    selectedGrade: null,
    selectedTopicId: null,
    selectedGame: null,
  }),
}));
