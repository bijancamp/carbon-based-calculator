import { Typography, Box } from '@mui/material';

export default function AboutPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        About Carbon-Based Calculator
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Carbon-Based Calculator is a mental math practice app for magicians and math enthusiasts. Select a drill type and practice rapid calculation effects, like multiplying by 11 or squaring numbers ending in 5. The app is designed for speed, simplicity, and mobile-friendliness—no logins, no distractions, just pure practice.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
        Created by Bijan Camp.
      </Typography>
    </Box>
  );
}
