import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from "axios";

export default function UpdatePatient({ patient, onUpdate }) {
  const [updatePatient, setUpdatePatient] = useState({
    _id: null,
    firstName: '',
    lastName: '',
    age: 0,
    conditions: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Open the dialog and populate the form with the selected patient's data
  const handleOpen = (patient) => {
    setUpdatePatient({
      _id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: patient.age,
      conditions: patient.conditions,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      address: patient.address,
    });
    setOpen(true); // Open the dialog
    setValidationErrors({}); // Reset validation errors
  };

  // Close the dialog and reset the form
  const handleClose = () => {
    setOpen(false);
    setUpdatePatient({
      _id: null,
      firstName: '',
      lastName: '',
      age: 0,
      conditions: '',
      email: '',
      phoneNumber: '',
      address: '',
    });
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatePatient((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for the field being edited
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!updatePatient.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
    if (!updatePatient.lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
    if (updatePatient.age <= 0) {
      errors.age = 'Age must be a positive number';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatePatient.email)) {
      errors.email = 'Invalid email format';
    }
    if (!/^\d{10}$/.test(updatePatient.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const update = async () => {
    if (!validateForm()) return; // Stop if validation fails

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/patients/${updatePatient._id}`, updatePatient);
      setSuccess(true);
      handleClose(); // Close the dialog after successful update
      if (onUpdate) onUpdate(response.data); // Notify parent component of the updated patient
    } catch (err) {
      setError("Failed to update patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleOpen(patient)}
        sx={{ mb: 2 }}
      >
        Update
      </Button>

      {/* Dialog for Update Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Patient Information</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              paddingTop: 2,
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              name="firstName"
              label="First Name"
              variant="outlined"
              sx={{ mb: 2, width: '100%' }}
              value={updatePatient.firstName}
              onChange={handleChange}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
            />
            <TextField
              name="lastName"
              label="Last Name"
              variant="outlined"
              sx={{ mb: 2, width: '100%' }}
              value={updatePatient.lastName}
              onChange={handleChange}
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
            />
            <TextField
              name="age"
              label="Age"
              variant="outlined"
              type="number"
              sx={{ mb: 2, width: '100%' }}
              value={updatePatient.age}
              onChange={handleChange}
              error={!!validationErrors.age}
              helperText={validationErrors.age}
            />
            <TextField
              name="conditions"
              label="Medical Conditions"
              variant="outlined"
              sx={{ mb: 2, width: '100%' }}
              value={updatePatient.conditions}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              type="email"
              sx={{ mb: 2, width: '100%' }}
              value={updatePatient.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              sx={{ mb: 2, width: '100%' }}
              value={updatePatient.phoneNumber}
              onChange={handleChange}
              error={!!validationErrors.phoneNumber}
              helperText={validationErrors.phoneNumber}
            />
            <TextField
              name="address"
              label="Address"
              variant="outlined"
              sx={{ mb: 2, width: '100%' }}
              value={updatePatient.address}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={update} color="success" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success and Error Feedback */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Patient updated successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}