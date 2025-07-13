import { Card, CardActionArea, CardContent, Divider, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router';

const DRILLS = [
  {
    type: 'multiply-by-11',
    name: 'Multiply Two-Digit Numbers by 11',
    description: 'Unleash your inner Eleven. Close the Mothergate.',
  },
  {
    type: 'square-ending-5',
    name: 'Square Two-Digit Number Endings in 5',
    description: "This isn't exactly squaring light, but every mathemagician needs an Act I.",
  },
  {
    type: 'multiply-same-first-sum-10',
    name: 'Multiply Numbers with Same First Digit & Second Digits Summing to 10',
    description: 'When digits align, patterns shine.',
  },
];

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 2, fontStyle: 'italic', textAlign: 'center' }}>
        Mental Math Drills for the Magic-Minded 🧙
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>
        Choose Your Drill
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
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
