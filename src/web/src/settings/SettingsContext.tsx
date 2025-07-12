import { createContext } from 'react';

export type SettingsContextType = {
  theme: 'light' | 'dark';
  setTheme: (mode: 'light' | 'dark') => void;
  voiceMode: boolean;
  setVoiceMode: (on: boolean) => void;
  voice: string;
  setVoice: (voice: string) => void;
  availableVoices: string[];
  loadVoices: () => void;
};

const SettingsContext = createContext<SettingsContextType>({
  theme: 'dark',
  setTheme: () => {},
  voiceMode: false,
  setVoiceMode: () => {},
  voice: '',
  setVoice: () => {},
  availableVoices: [],
  loadVoices: () => {},
});

export default SettingsContext;
