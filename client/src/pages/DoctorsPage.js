import React from 'react';
import { Container, Grid, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import CreateDoctor from '../components/doctors/createDoctor';
import ShowDoctors from '../components/doctors/showDoctors';
import NavBar from '../NavBar';

function DoctorsPage() {
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
          px: { xs: 1, sm: 2, md: 3 }, // Responsive padding
        }}
      >
        <Grid
          container
          spacing={2}
          direction={isSmallScreen ? 'column-reverse' : 'row'}
        >
          {/* Main content - Doctors table */}
          <Grid
            item
            xs={12}
            lg={9}
            sx={{ width: '100%' }}
          >
            <ShowDoctors />
          </Grid>

          {/* Sidebar - Create doctor form */}
          <Grid
            item
            xs={12}
            lg={3}
            sx={{
              mb: isSmallScreen ? 3 : 0,
              width: '100%',
            }}
          >
            <CreateDoctor />
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
          © {new Date().getFullYear()} All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Made with ❤️ by <strong>Aman Kheria</strong>
        </Typography>
      </Box>
    </Box>
  );
}

export default DoctorsPage;