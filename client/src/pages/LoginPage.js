import React from 'react';
import { Grid, Typography } from '@mui/material';
import LoginForm from '../components/loginForm';
import authStores from '../stores/authStores';

function LoginPage() {
  const store = authStores();

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ 
        minHeight: '50vh', 
        padding: '0 20px', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Subtle gradient background
      }}
    >
      <Typography 
        variant="h3" 
        style={{ 
          fontWeight: '700', 
          paddingTop: '20px', 
          color: '#333', 
          letterSpacing: '1px', 
          marginBottom: '30px', 
        }}
      >
        Clinic Management System
      </Typography>
      <Grid 
        item 
        style={{ 
           // Fixed width for the login card
        
          backgroundColor: '#fff', // White background for the card
          borderRadius: '15px', // Rounded corners
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
        }}
      >
        <LoginForm />
      </Grid>
    </Grid>
  );
}

export default LoginPage;