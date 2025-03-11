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

  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{10}$/; // Assumes a 10-digit phone number
    return regex.test(phoneNumber);
  };

  const validateAge = (age) => {
    return age > 0 && age < 120; // Assumes age is between 1 and 120
  };

  const createPatient = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    // Check if required fields are empty
    if (!patient.firstName || !patient.lastName || !patient.phoneNumber || !patient.patientid) {
      setAlert({
        open: true,
        message: 'Please fill all required fields.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    // Validate email
    if (patient.email && !validateEmail(patient.email)) {
      setAlert({
        open: true,
        message: 'Please enter a valid email address.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(patient.phoneNumber)) {
      setAlert({
        open: true,
        message: 'Please enter a valid 10-digit phone number.',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    // Validate age
    if (patient.age && !validateAge(patient.age)) {
      setAlert({
        open: true,
        message: 'Please enter a valid age (1-120).',
        severity: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      await axios.post('/patients', patient, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      setAlert({
        open: true,
        message: 'Patient added successfully!',
        severity: 'success',
      });

      // Reset the form instead of reloading the page
      setPatient({
        firstName: '',
        lastName: '',
        age: '',
        conditions: '',
        email: '',
        phoneNumber: '',
        address: '',
        patientid: '',
      });
    } catch (error) {
      console.error('Error adding patient:', error.response?.data || error.message);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to add patient. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        padding: 3,
        borderRadius: 2,
        width: '100%',
        maxWidth: '600px',
        mx: 'auto',
        boxShadow: 3,
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
          gap: 2,
        }}
        noValidate
        autoComplete="off"
        onSubmit={createPatient} // Use the createPatient function directly
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
          id="firstName"
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
          id="lastName"
          label="Last Name"
          variant="outlined"
          required
          value={patient.lastName}
          onChange={(event) => setPatient({ ...patient, lastName: event.target.value })}
        />
        <TextField
          id="age"
          label="Age"
          variant="outlined"
          type="number"
          value={patient.age}
          onChange={(event) => setPatient({ ...patient, age: event.target.value })}
        />
        <TextField
          id="conditions"
          label="Medical Conditions"
          variant="outlined"
          value={patient.conditions}
          onChange={(event) => setPatient({ ...patient, conditions: event.target.value })}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="email"
          value={patient.email}
          onChange={(event) => setPatient({ ...patient, email: event.target.value })}
        />
        <TextField
          id="phoneNumber"
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
          id="address"
          label="Address"
          variant="outlined"
          value={patient.address}
          onChange={(event) => setPatient({ ...patient, address: event.target.value })}
        />
        <TextField
          id="patientid"
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
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
}