import { Howl } from 'howler';
import { useSettingsStore } from '../store/settingsStore';

export type SoundKey = 
  | 'correct' 
  | 'wrong' 
  | 'woosh' 
  | 'tick' 
  | 'fanfare' 
  | 'start';

const sounds: Record<SoundKey, Howl> = {
  correct: new Howl({ src: ['/sounds/correct.mp3'] }),
  wrong: new Howl({ src: ['/sounds/wrong.mp3'] }),
  woosh: new Howl({ src: ['/sounds/woosh.mp3'] }),
  tick: new Howl({ src: ['/sounds/tick.mp3'] }),
  fanfare: new Howl({ src: ['/sounds/fanfare.mp3'] }),
  start: new Howl({ src: ['/sounds/start.mp3'] }),
};

export function playSound(key: SoundKey) {
  const { soundEnabled } = useSettingsStore.getState();
  if (!soundEnabled) return;

  const sound = sounds[key];
  if (sound) {
    sound.play();
  }
}
