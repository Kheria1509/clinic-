import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// Exporting Default Navbar to the App.js File
export default function Navbar() {
  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar variant="dense">
          <Link to='/' style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle1' color="white" padding="20px">
              Patients
            </Typography>
          </Link>
          <Link to='/doctors' style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle1' color="white" padding="20px">
              Doctors
            </Typography>
          </Link>
          <Link to='/logout' style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle1' color="white" padding="20px">
              Logout
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
