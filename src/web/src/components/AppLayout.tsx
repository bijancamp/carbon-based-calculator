import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Box, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link, useLocation, useNavigate } from 'react-router';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
];

function AppLayout({ children, colorModeContext }: { children: React.ReactNode; colorModeContext: { toggleColorMode: () => void } }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setDrawerOpen((open) => !open);

  const handleNavClick = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', ml: isMobile ? 1 : 2, cursor: 'pointer' }}
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
                    sx={{ color: location.pathname === item.path ? 'secondary.main' : 'inherit', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </>
          )}
          <IconButton sx={{ ml: 2 }} onClick={colorModeContext.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
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
      <Box component="main" sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: 700, mx: 'auto' }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 1, px: 2, bgcolor: 'background.paper', textAlign: 'center', borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
        <Typography variant="caption" color="text.secondary">
          © 2025 Bijan Camp. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default AppLayout;
