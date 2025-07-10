import { Card, CardActionArea, CardContent, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router';

const DRILLS = [
  {
    type: 'multiply-by-11',
    name: 'Multiply Two-Digit Number by 11',
    description: 'Practice multiplying any two-digit number by 11 quickly in your head.',
  },
  {
    type: 'square-ending-5',
    name: 'Square Two-Digit Number Ending in 5',
    description: 'Practice squaring numbers like 25, 35, 95, etc. (ending in 5) instantly.',
  },
];

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        {isMobile ? 'Tap a Drill Type' : 'Select a Drill Type'}
      </Typography>
      <Grid container spacing={2} direction={isMobile ? 'column' : 'row'} justifyContent="center">
        {DRILLS.map((drill) => (
          <Grid size={{ xs: 12, sm: 6 }} key={drill.type}>
            <Card
              sx={{
                transition: 'background 0.2s',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[200],
                },
              }}
              onClick={() => navigate(`/drills/${drill.type}`)}
            >
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {drill.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {drill.description}
                  </Typography>
                  {!isMobile && (
                    <Typography variant="caption" color="primary.main" sx={{ mt: 1, display: 'block' }}>
                      Start Drill
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
