import * as React from 'react';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from "axios";

export default function CreatePatient() {

  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    age: '',
    conditions: '',
    email: '',
    phoneNumber: '',
    address: '',
    patientid: '',
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const createPatient = async () => {
    try {
      await axios.post('/patients', patient);
      setAlert({
        open: true,
        message: 'Patient added successfully!',
        severity: 'success',
      });
      setTimeout(() => window.location.reload(false), 1500);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to add patient. Please try again.',
        severity: 'error',
      });
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5', // Background color for the container     background-color: #f0f0f0
        padding: 3, // Padding for spacing
        borderRadius: 2, // Rounded corners
        width: '100%',
        maxWidth: '600px', // Maximum width of the form
        mx: 'auto', // Center horizontally
        boxShadow: 3, // Shadow for depth effect
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Add New Patient
      </Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // Spacing between form elements
        }}
        noValidate
        autoComplete="off"
      >
        {alert.open && (
          <Alert
            severity={alert.severity}
            sx={{ mb: 2 }}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        )}
        <TextField
          label={
            <span>
              First Name<span style={{ color: 'red' }}> *</span>
            </span>
          }
          variant="outlined"
          required
          value={patient.firstName}
          onChange={(event) => setPatient({ ...patient, firstName: event.target.value })}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          required
          value={patient.lastName}
          onChange={(event) => setPatient({ ...patient, lastName: event.target.value })}
        />
        <TextField
          label="Age"
          variant="outlined"
          type="number"
          value={patient.age}
          onChange={(event) => setPatient({ ...patient, age: event.target.value })}
        />
        <TextField
          label="Medical Conditions"
          variant="outlined"
          value={patient.conditions}
          onChange={(event) => setPatient({ ...patient, conditions: event.target.value })}
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={patient.email}
          onChange={(event) => setPatient({ ...patient, email: event.target.value })}
        />
        <TextField
          label={
            <span>
              Phone Number<span style={{ color: 'red' }}> *</span>
            </span>
          }
          variant="outlined"
          required
          value={patient.phoneNumber}
          onChange={(event) => setPatient({ ...patient, phoneNumber: event.target.value })}
        />
        <TextField
          label="Address"
          variant="outlined"
          value={patient.address}
          onChange={(event) => setPatient({ ...patient, address: event.target.value })}
        />
        <TextField
          label={
            <span>
              Patient ID<span style={{ color: 'red' }}> *</span>
            </span>
          }
          variant="outlined"
          required
          value={patient.patientid}
          onChange={(event) => setPatient({ ...patient, patientid: event.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={createPatient}
          sx={{ mt: 2 }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
