import { createContext } from 'react';

export type SettingsContextType = {
  theme: 'light' | 'dark';
  setTheme: (mode: 'light' | 'dark') => void;
  spokenProblemsMode: boolean;
  setSpokenProblemsMode: (on: boolean) => void;
  voice: string;
  setVoice: (voice: string) => void;
  availableVoices: string[];
  loadVoices: () => void;
};

const SettingsContext = createContext<SettingsContextType>({
  theme: 'dark',
  setTheme: () => {},
  spokenProblemsMode: false,
  setSpokenProblemsMode: () => {},
  voice: '',
  setVoice: () => {},
  availableVoices: [],
  loadVoices: () => {},
});

export default SettingsContext;
