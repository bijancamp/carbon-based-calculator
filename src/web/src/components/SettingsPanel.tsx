import { useContext, useEffect } from 'react';
import { Box, Typography, IconButton, Drawer, FormControlLabel, Switch, RadioGroup, Radio, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsContext from '../settings/SettingsContext';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const {
    theme,
    setTheme,
    voiceMode,
    setVoiceMode,
    voice,
    setVoice,
    availableVoices,
    loadVoices,
  } = useContext(SettingsContext);

  useEffect(() => {
    if (voiceMode && open) loadVoices();
  }, [voiceMode, loadVoices, open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 360 },
          boxSizing: 'border-box',
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>Settings</Typography>
        <IconButton onClick={onClose} edge="end" aria-label="close settings">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={500}>Theme</Typography>
        <RadioGroup row value={theme} onChange={e => setTheme(e.target.value as 'light' | 'dark')}>
          <FormControlLabel value="dark" control={<Radio />} label="Night" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
        </RadioGroup>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={500}>Voice Mode</Typography>
        <FormControlLabel
          control={<Switch checked={voiceMode} onChange={e => setVoiceMode(e.target.checked)} />}
          label={voiceMode ? 'On' : 'Off'}
        />
      </Box>

      {voiceMode && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={500}>Voice</Typography>
          <Select
            value={availableVoices.includes(voice) ? voice : ''}
            onChange={e => setVoice(e.target.value)}
            fullWidth
          >
            {availableVoices.length === 0 ? (
              <MenuItem value="" disabled>No voices found</MenuItem>
            ) : (
              availableVoices.map(v => (
                <MenuItem key={v} value={v}>{v}</MenuItem>
              ))
            )}
          </Select>
        </Box>
      )}
    </Drawer>
  );
}
