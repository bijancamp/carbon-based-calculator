import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsContext from '../settings/SettingsContext';

const DRILL_DEFS = {
  'multiply-by-11': {
    name: 'Multiply Two-Digit Number by 11',
    lastN: 10,
    generate: () => {
      const n = Math.floor(Math.random() * 90) + 10;
      return { 
        problem: `${n} × 11`, 
        speech: `${n} times 11`, 
        answer: n * 11
      };
    },
  },
  'square-ending-5': {
    name: 'Square Two-Digit Number Ending in 5',
    lastN: 5,
    generate: () => {
      const tens = Math.floor(Math.random() * 9) + 1;
      const n = tens * 10 + 5;
      return { 
        problem: `${n}²`, 
        speech: `${n} squared`, 
        answer: n * n
      };
    },
  },
};

export default function DrillPage() {
  const { drillType } = useParams();
  const navigate = useNavigate();
  const { spokenProblemsMode, voice } = useContext(SettingsContext);
  const drill = DRILL_DEFS[drillType as keyof typeof DRILL_DEFS];
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null);
  // History of problems for navigation
  const [history, setHistory] = useState<{ problem: string; speech: string; answer: number }[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1); // -1 means no problem yet
  const [showAnswer, setShowAnswer] = useState(false);
  const lastProblemsRef = useRef<{ [key: string]: string[] }>({});
  const lastSpokenProblemRef = useRef<string | null>(null); // Track the last spoken problem
  const spokenProblemsModeRef = useRef(spokenProblemsMode);
  const voiceRef = useRef(voice);

  // Update ref when spokenProblemsMode changes
  useEffect(() => {
    spokenProblemsModeRef.current = spokenProblemsMode;
    
    // If spoken problems mode is enabled and answer is not showing,
    // immediately show the answer for the current problem
    if (spokenProblemsMode && !showAnswer) {
      setShowAnswer(true);
    }
  }, [spokenProblemsMode, showAnswer]);
  
  // Update ref when voice changes
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);
  
  // Function to speak text
  const speakText = useCallback((text: string) => {
    if (!spokenProblemsModeRef.current || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    if (speakRef.current) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    speakRef.current = utterance;

    const voice = voiceRef.current;
    
    // Set the voice if specified
    if (voice && voice.name !== 'System Default') {
      const voices = window.speechSynthesis.getVoices();
      // Find the voice that matches both name and language
      const selectedVoice = voices.find(v => v.name === voice.name && v.lang === voice.lang);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  }, [spokenProblemsModeRef, voiceRef]);

  // Generate a new unique problem and add to history
  const generateUniqueProblem = useCallback(() => {
    if (!drill || !drillType) return;
    let p;
    let tries = 0;
    const lastProblems = lastProblemsRef.current[drillType] || [];
    do {
      p = drill.generate();
      tries++;
    } while (lastProblems.includes(p.problem) && tries < 20);
    // Update lastProblems for this drill type
    const updatedProblems = [...lastProblems, p.problem];
    if (updatedProblems.length > drill.lastN) updatedProblems.shift();
    lastProblemsRef.current[drillType] = updatedProblems;
    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIdx + 1);
      newHistory.push(p);
      return newHistory;
    });
    setCurrentIdx(idx => idx + 1);
    // Show answer immediately if spoken problems mode is enabled
    setShowAnswer(spokenProblemsModeRef.current);
  }, [drill, drillType, currentIdx]);

  // On drillType change, reset history
  useEffect(() => {
    if (!drill) return;
    setHistory([]);
    setCurrentIdx(-1);
    generateUniqueProblem();
    // eslint-disable-next-line
  }, [drillType]);

  const goPrevious = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx(idx => idx - 1);
      // Show answer immediately if spoken problems mode is enabled
      setShowAnswer(spokenProblemsModeRef.current);
    }
  }, [currentIdx]);

  const goNext = useCallback(() => {
    if (currentIdx < history.length - 1) {
      setCurrentIdx(idx => idx + 1);
      // Show answer immediately if spoken problems mode is enabled
      setShowAnswer(spokenProblemsModeRef.current);
    } else {
      generateUniqueProblem();
    }
  }, [currentIdx, history.length, generateUniqueProblem]);

  const currentProblem = history[currentIdx] || null;

  // Speak the current problem when rendered
  useEffect(() => {
    if (currentProblem && spokenProblemsModeRef.current) {
      // Only speak if this is a different problem than the last one we spoke
      if (lastSpokenProblemRef.current !== currentProblem.problem) {
        speakText(currentProblem.speech);
        lastSpokenProblemRef.current = currentProblem.problem;
      }
    }
  }, [currentProblem, speakText]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis && speakRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!drill) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Drill not found.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Title + back button wrapper */}
      <Box
        sx={{
          position: 'relative',
          px: 5,  // match Paper's horizontal padding
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowBackIcon
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            left: 0,
            cursor: 'pointer',
            color: 'text.secondary',
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {drill.name}
        </Typography>
      </Box>
      <Paper elevation={4} sx={{ p: 4, mb: 3, textAlign: 'center', cursor: 'pointer', minHeight: 100 }}
        onClick={() => {
          if (showAnswer) {
            goNext();
          } else {
            setShowAnswer(true);
          }
        }}>
        <Typography variant="h4" sx={{ mb: 1, userSelect: 'none' }}>
          {currentProblem?.problem}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography
            color="text.secondary"
            sx={{ fontSize: '1.6rem', mt: 2, userSelect: 'none', visibility: showAnswer ? 'visible' : 'hidden', position: 'absolute' }}
          >
            {currentProblem?.answer}
          </Typography>
          {!showAnswer && !spokenProblemsModeRef.current && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, position: 'relative' }}>
              Tap or click to reveal answer
            </Typography>
          )}
        </Box>
      </Paper>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button variant="outlined" color="primary" sx={{ minWidth: 100 }} onClick={goPrevious} disabled={currentIdx <= 0}>
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={goNext} sx={{ minWidth: 100 }}>
          Next
        </Button>
      </Stack>
    </Box>
  );
}
