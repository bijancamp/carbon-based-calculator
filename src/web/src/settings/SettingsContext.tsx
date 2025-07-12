import { createContext } from 'react';

export type Voice = {
  name: string;
  lang: string;
  default: boolean,
  localService: boolean,
  voiceURI: string,
  displayName: string; // Format: "Name (Lang)"
};

export type SettingsContextType = {
  theme: 'light' | 'dark';
  setTheme: (mode: 'light' | 'dark') => void;
  spokenProblemsMode: boolean;
  setSpokenProblemsMode: (on: boolean) => void;
  voice: Voice | null;
  setVoice: (voice: Voice | null) => void;
  availableVoices: Voice[];
  loadVoices: () => void;
};

const SettingsContext = createContext<SettingsContextType>({
  theme: 'dark',
  setTheme: () => {},
  spokenProblemsMode: false,
  setSpokenProblemsMode: () => {},
  voice: null,
  setVoice: () => {},
  availableVoices: [],
  loadVoices: () => {},
});

export default SettingsContext;
