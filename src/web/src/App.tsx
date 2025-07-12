import { createContext } from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import AppLayout from './components/AppLayout';
import AboutPage from './pages/AboutPage';
import DrillPage from './pages/DrillPage';
import HomePage from './pages/HomePage';
import SettingsContext from './settings/SettingsContext';
import SettingsProvider from './settings/SettingsProvider';

type ColorModeContextType = {
  toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export default function App() {
  return (
    <SettingsProvider>
      <SettingsContext.Consumer>
        {({ theme }) => (
          <ThemeProvider theme={createTheme({ palette: { mode: theme } })}>
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
        )}
      </SettingsContext.Consumer>
    </SettingsProvider>
  );
}

export { ColorModeContext };
