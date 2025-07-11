import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';

const DRILL_DEFS = {
  'multiply-by-11': {
    name: 'Multiply Two-Digit Number by 11',
    generate: () => {
      const n = Math.floor(Math.random() * 90) + 10;
      return { problem: `${n} × 11`, answer: n * 11 };
    },
  },
  'square-ending-5': {
    name: 'Square Two-Digit Number Ending in 5',
    generate: () => {
      const tens = Math.floor(Math.random() * 9) + 1;
      const n = tens * 10 + 5;
      return { problem: `${n}²`, answer: n * n };
    },
  },
};

const LAST_N = 10;

export default function DrillPage() {
  const { drillType } = useParams();
  const navigate = useNavigate();
  const drill = DRILL_DEFS[drillType as keyof typeof DRILL_DEFS];
  const [problem, setProblem] = useState<{ problem: string; answer: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const lastProblems = useRef<string[]>([]);

  const generateUniqueProblem = useCallback(() => {
    if (!drill) return;
    let p;
    let tries = 0;
    do {
      p = drill.generate();
      tries++;
    } while (lastProblems.current.includes(p.problem) && tries < 20);
    lastProblems.current.push(p.problem);
    if (lastProblems.current.length > LAST_N) lastProblems.current.shift();
    setProblem(p);
    setShowAnswer(false);
  }, [drill]);

  useEffect(() => {
    if (!drill) return;
    generateUniqueProblem();
    // eslint-disable-next-line
  }, [drillType]);

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
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>{drill.name}</Typography>
      <Paper elevation={4} sx={{ p: 4, mb: 3, textAlign: 'center', cursor: 'pointer', minHeight: 100 }}
        onClick={() => setShowAnswer(true)}>
        <Typography variant="h4" sx={{ mb: 1, userSelect: 'none' }}>
          {problem?.problem}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography
            color="text.secondary"
            sx={{ fontSize: '1.9rem', mt: 2, userSelect: 'none', visibility: showAnswer ? 'visible' : 'hidden', position: 'absolute' }}
          >
            {problem?.answer}
          </Typography>
          {!showAnswer && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, position: 'relative' }}>
              Tap or click to reveal answer
            </Typography>
          )}
        </Box>
      </Paper>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button variant="contained" color="primary" onClick={generateUniqueProblem}>
          Next Problem
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>Change Drill</Button>
      </Stack>
    </Box>
  );
}
