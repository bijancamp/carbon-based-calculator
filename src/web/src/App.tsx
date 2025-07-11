import { createContext, useMemo, useState } from 'react';
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
