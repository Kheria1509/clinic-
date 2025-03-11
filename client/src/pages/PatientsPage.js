import React from 'react';
import { Container, Grid, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ShowPatients from "../components/patients/showPatients";
import CreatePatient from "../components/patients/createPatient";
import NavBar from '../NavBar';

function PatientsPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <NavBar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1, 
          py: 2,
          px: { xs: 1, sm: 2, md: 3 } // Responsive padding
        }}
      > 
        <Grid 
          container 
          spacing={2} 
          direction={isSmallScreen ? 'column-reverse' : 'row'}
        >
          {/* Main content - Patient table */}
          <Grid
            item
            xs={12}
            lg={9}
            sx={{ width: '100%' }}
          >
            <ShowPatients />
          </Grid>
          
          {/* Sidebar - Create patient form */}
          <Grid 
            item 
            xs={12} 
            lg={3}
            sx={{ 
              mb: isSmallScreen ? 3 : 0,
              width: '100%'
            }}
          >
            <CreatePatient />
          </Grid>
        </Grid>
      </Container>

      {/* Sticky Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto', // Push footer to bottom
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          © {new Date().getFullYear()}  All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Made with ❤️ by <strong>Aman Kheria</strong>
        </Typography>
      </Box>
    </Box>
  );
}

export default PatientsPage;