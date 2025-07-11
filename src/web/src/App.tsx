import React, { useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import DrillPage from './pages/DrillPage';
import AboutPage from './pages/AboutPage';

type ColorModeContextType = {
  toggleColorMode: () => void;
};

const ColorModeContext = React.createContext<ColorModeContextType | undefined>(undefined);

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const colorMode = useMemo(
    () => ({ toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')) }),
    []
  );
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/drills/:drillType" element={<DrillPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export { ColorModeContext };
