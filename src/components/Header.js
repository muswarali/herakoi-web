// components/Header.js
// This component renders the application's top header using Material UI AppBar.

/**
 * Header Component
 * 
 * What it does:
 * - Displays a static AppBar at the top of the page.
 * - Shows the title "Herakoi Sonification App" inside the AppBar.
 */

import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material'; // Material UI components

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      {/* Application Title */}
      <Typography variant="h6" component="div">
        Herakoi Sonification App
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
