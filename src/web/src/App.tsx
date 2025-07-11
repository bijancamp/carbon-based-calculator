import { createContext, useEffect, useMemo, useState } from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import AppLayout from './components/AppLayout';
import AboutPage from './pages/AboutPage';
import DrillPage from './pages/DrillPage';
import HomePage from './pages/HomePage';

type ColorModeContextType = {
  toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export default function App() {
  // Read initial mode from localStorage, defaulting to 'dark'
  const getInitialMode = () => {
    const stored = localStorage.getItem('themeMode');
    return stored === 'light' ? 'light' : 'dark';
  };

  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode);

  // Persist mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

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
