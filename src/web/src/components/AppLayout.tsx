import { type ReactNode, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import MaterialLink from '@mui/material/Link';
import CalculateIcon from '@mui/icons-material/Calculate';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import { ColorModeContext } from '../App';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
];

function AppLayout({ children }: { children: ReactNode }) {
  const colorModeContext = useContext(ColorModeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen((open) => !open);

  const handleNavClick = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
          {/* Logo and App Name */}
          <CalculateIcon
            sx={{
              display: { xs: 'none', sm: 'block' }, // Hide on xs screens
            }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              ml: isMobile ? 1 : 2,
              cursor: 'pointer',
            }}
          >
            Carbon-Based Calculator
          </Typography>
          {!isMobile && (
            <>
              {navItems.map((item) => (
                <Box key={item.path} sx={{ ml: 2 }}>
                  <Typography
                    component={Link}
                    to={item.path}
                    sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </>
          )}
          <IconButton sx={{ ml: 2 }} onClick={colorModeContext?.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 220 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.path} onClick={() => handleNavClick(item.path)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Toolbar />
      <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 2, md: 3 }, width: '100%', maxWidth: 700, mx: 'auto' }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 1, px: 2, bgcolor: 'background.paper', textAlign: 'center', borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()}{' '}
          <MaterialLink href="https://bijancamp.com" target="_blank" rel="noopener noreferrer" underline="hover">
            Bijan Camp
          </MaterialLink>
          . All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default AppLayout;
