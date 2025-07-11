import { Box, Link, Typography } from '@mui/material';

export default function AboutPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        About Carbon-Based Calculator
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Carbon-Based Calculator provides mental math drills for the magic-minded. Choose from curated drill types—like multiplying by 11 or squaring numbers ending in 5—and train yourself to calculate more quickly, easily, and <em>mathemagically</em>.
      </Typography>
      <Typography variant="body1" sx={{ mt: 3 }}>
        Created by{' '}
        <Link href="https://bijancamp.com" target="_blank" rel="noopener noreferrer">
          Bijan Camp
        </Link>
        .
      </Typography>
    </Box>
  );
}
