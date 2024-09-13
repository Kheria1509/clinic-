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
      style={{ minHeight: '100vh', padding: '0 20px' }} // Padding added for responsiveness
    >
      <Typography variant="h3" style={{ fontWeight: '600', marginBottom: '40px', color: '#333' }}>
        Clinic Management System
      </Typography>
      <Grid item xs={12} md={6} lg={4}>
        <LoginForm />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
