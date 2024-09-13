import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function CreateDoctor() {
  const [doctor, setDoctor] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    doctorid: '',
  });

  const createDoctor = async () => {
    await axios.post('/doctors', doctor).then(() => {
      window.location.reload(false);
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5', // Light background color for contrast
        padding: 4, // Increased padding for more space
        borderRadius: 2, // More rounded corners
        width: '100%', // Full width for better layout
        maxWidth: '600px', // Maximum width for better readability
        mx: 'auto', // Center horizontally
        boxShadow: 3, // Shadow for depth
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center contents
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Add New Doctor
      </Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%', // Full width of the container
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="first-name"
          label={
            <span>
              First Name<span style={{ color: 'red' }}> *</span>
            </span>
          }
          variant="outlined"
          margin="normal"
          fullWidth
          InputLabelProps={{ style: { color: '#333' } }} // Darker label color for readability
          InputProps={{ style: { color: '#333' } }} // Darker input text color
          value={doctor.firstName}
          onChange={(event) => setDoctor({ ...doctor, firstName: event.target.value })}
        />
        <TextField
          id="last-name"
          label={
            <span>
              Last Name<span style={{ color: 'red' }}> *</span>
            </span>
          }
          variant="outlined"
          margin="normal"
          fullWidth
          InputLabelProps={{ style: { color: '#333' } }}
          InputProps={{ style: { color: '#333' } }}
          value={doctor.lastName}
          onChange={(event) => setDoctor({ ...doctor, lastName: event.target.value })}
        />
        <TextField
          id="specialty"
          label="Specialty"
          variant="outlined"
          margin="normal"
          fullWidth
          InputLabelProps={{ style: { color: '#333' } }}
          InputProps={{ style: { color: '#333' } }}
          value={doctor.specialty}
          onChange={(event) => setDoctor({ ...doctor, specialty: event.target.value })}
        />
        <TextField
          id="doctor-id"
          label={
            <span>
              Doctor ID<span style={{ color: 'red' }}> *</span>
            </span>
          }
          variant="outlined"
          margin="normal"
          fullWidth
          InputLabelProps={{ style: { color: '#333' } }}
          InputProps={{ style: { color: '#333' } }}
          value={doctor.doctorid}
          onChange={(event) => setDoctor({ ...doctor, doctorid: event.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, py: 1.5, borderRadius: 2, textTransform: 'none' }}
          onClick={createDoctor}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
