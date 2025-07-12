import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SettingsContext, { type Voice } from './SettingsContext';

export default function SettingsProvider({ children }: { children: ReactNode }) {
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('themeMode');
    return stored === 'light' ? 'light' : 'dark';
  });
  useEffect(() => {
    localStorage.setItem('themeMode', theme);
  }, [theme]);

  // Spoken Problems Mode
  const [spokenProblemsMode, setSpokenProblemsMode] = useState(() => {
    return localStorage.getItem('spokenProblemsMode') === 'true';
  });
  useEffect(() => {
    localStorage.setItem('spokenProblemsMode', String(spokenProblemsMode));
  }, [spokenProblemsMode]);

  // Available voices
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const loadVoices = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      setAvailableVoices([]);
      return;
    }
    const populate = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Create voice objects with name, lang, and displayName
      const voiceObjects = voices.map(v => ({
        name: v.name,
        lang: v.lang,
        displayName: `${v.name} (${v.lang})`
      }));
      
      // Sort voices by lang and then by name
      const sortedVoices = voiceObjects.sort((a, b) => {
        // First sort by language
        const langCompare = a.lang.localeCompare(b.lang);
        if (langCompare !== 0) return langCompare;
        
        // Then sort by name
        return a.name.localeCompare(b.name);
      });
      
      // Add System Default as the first option
      const systemDefault: Voice = {
        name: 'System Default',
        lang: '',
        displayName: 'System Default'
      };
      
      setAvailableVoices([systemDefault, ...sortedVoices]);
    };
    
    populate();
    window.speechSynthesis.onvoiceschanged = populate;
  }, []);

  // Voice selection - now initialized after availableVoices to prevent MUI warnings
  const [voice, setVoice] = useState<Voice | null>(() => {
    try {
      const savedVoiceJSON = localStorage.getItem('voice');
      if (savedVoiceJSON) {
        return JSON.parse(savedVoiceJSON);
      }
    } catch (e) {
      console.error('Failed to parse saved voice from localStorage', e);
    }
    
    // Default to null, we'll set it properly once voices are loaded
    return null;
  });

  // Load voices on startup
  useEffect(() => {
    loadVoices();
  }, [loadVoices]);
  
  // Reload voices when voice mode is enabled
  useEffect(() => {
    if (spokenProblemsMode) loadVoices();
  }, [spokenProblemsMode, loadVoices]);

  // Set initial voice when availableVoices changes
  useEffect(() => {
    if (availableVoices.length > 0) {
      try {
        const savedVoiceJSON = localStorage.getItem('voice');
        
        if (savedVoiceJSON) {
          const savedVoice = JSON.parse(savedVoiceJSON);
          
          // Check if saved voice exists in available voices
          const voiceExists = availableVoices.some(
            v => v.name === savedVoice.name && v.lang === savedVoice.lang
          );
          
          if (voiceExists) {
            const foundVoice = availableVoices.find(
              v => v.name === savedVoice.name && v.lang === savedVoice.lang
            );
            setVoice(foundVoice || availableVoices[0]);
          } else {
            // If saved voice is not available, use the first one (System Default)
            setVoice(availableVoices[0]);
          }
        } else {
          // No saved voice, use the first one (System Default)
          setVoice(availableVoices[0]);
        }
      } catch (e) {
        console.error('Failed to process saved voice', e);
        setVoice(availableVoices[0]);
      }
    }
  }, [availableVoices]);

  // Track the previous voice to determine if it actually changed
  const previousVoiceRef = useRef<string | null>(null);
  
  // Initialize previousVoiceRef with the current voice from localStorage
  useEffect(() => {
    try {
      const savedVoiceJSON = localStorage.getItem('voice');
      if (savedVoiceJSON) {
        const savedVoice = JSON.parse(savedVoiceJSON);
        previousVoiceRef.current = `${savedVoice.name}-${savedVoice.lang}`;
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);
  
  // Voice preview when voice changes
  useEffect(() => {
    if (!voice || !spokenProblemsMode) return;
    
    // Save voice settings to localStorage as JSON
    localStorage.setItem('voice', JSON.stringify(voice));
    
    // Create a key to compare current voice with previous
    const currentVoiceKey = `${voice.name}-${voice.lang}`;
    
    // Only preview if the voice actually changed (not just on settings panel open)
    if (previousVoiceRef.current !== currentVoiceKey) {
      // Voice preview
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance('Ready for a challenge?');
        const synthesisVoices = window.speechSynthesis.getVoices();
        
        // Only set a specific voice if not using system default
        if (voice.name !== 'System Default') {
          const selected = synthesisVoices.find(v => v.name === voice.name && v.lang === voice.lang);
          if (selected) utter.voice = selected;
        }
        
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        window.speechSynthesis.speak(utter);
      }
      
      // Update previous voice reference
      previousVoiceRef.current = currentVoiceKey;
    }
  }, [voice, spokenProblemsMode]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    spokenProblemsMode,
    setSpokenProblemsMode,
    voice,
    setVoice,
    availableVoices,
    loadVoices,
  }), [theme, spokenProblemsMode, voice, availableVoices, loadVoices]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
