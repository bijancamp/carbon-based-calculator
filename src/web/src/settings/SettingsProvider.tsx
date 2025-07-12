import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import SettingsContext from './SettingsContext';

export default function SettingsProvider({ children }: { children: ReactNode }) {
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('themeMode');
    return stored === 'light' ? 'light' : 'dark';
  });
  useEffect(() => {
    localStorage.setItem('themeMode', theme);
  }, [theme]);

  // Voice Mode
  const [voiceMode, setVoiceMode] = useState(() => {
    return localStorage.getItem('voiceMode') === 'true';
  });
  useEffect(() => {
    localStorage.setItem('voiceMode', String(voiceMode));
  }, [voiceMode]);

  // Available voices
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const loadVoices = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      setAvailableVoices([]);
      return;
    }
    const populate = () => {
      const voices = window.speechSynthesis.getVoices();
      // Sort voices alphabetically and add "System Default" as the first option
      const sortedVoices = voices
        .map(v => v.name)
        .sort((a, b) => a.localeCompare(b));
      setAvailableVoices(["System Default", ...sortedVoices]);
    };
    populate();
    window.speechSynthesis.onvoiceschanged = populate;
  }, []);

  // Voice selection - now initialized after availableVoices to prevent MUI warnings
  const [voice, setVoice] = useState(() => {
    const savedVoice = localStorage.getItem('voice') || 'System Default';
    // We'll set it properly once voices are loaded
    return savedVoice;
  });

  // Load voices on startup
  useEffect(() => {
    loadVoices();
  }, [loadVoices]);
  
  // Reload voices when voice mode is enabled
  useEffect(() => {
    if (voiceMode) loadVoices();
  }, [voiceMode, loadVoices]);

  // Set initial voice when availableVoices changes
  useEffect(() => {
    if (availableVoices.length > 0) {
      const savedVoice = localStorage.getItem('voice') || 'System Default';
      if (!availableVoices.includes(savedVoice)) {
        // If saved voice is not in available voices, use the first available
        setVoice(availableVoices[0]);
      } else {
        setVoice(savedVoice);
      }
    }
  }, [availableVoices]);

  // Voice preview when voice changes
  useEffect(() => {
    if (!voice || !voiceMode) return;
    
    localStorage.setItem('voice', voice);
    
    // Voice preview
    if ('speechSynthesis' in window) {
      const utter = new window.SpeechSynthesisUtterance('Ready for a challenge?');
      const voices = window.speechSynthesis.getVoices();
      
      // Only set a specific voice if not using system default
      if (voice !== 'System Default') {
        const selected = voices.find(v => v.name === voice);
        if (selected) utter.voice = selected;
      }
      
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      window.speechSynthesis.speak(utter);
    }
  }, [voice, voiceMode]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    voiceMode,
    setVoiceMode,
    voice,
    setVoice,
    availableVoices,
    loadVoices,
  }), [theme, voiceMode, voice, availableVoices, loadVoices]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
