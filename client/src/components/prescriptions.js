import {
    Button,
    TextField,
    Modal,
    Box,
    Typography,
    Table,
    TableBody,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
  } from '@mui/material';
  import * as React from 'react';
  import { useState } from 'react';
  import axios from 'axios';
  
  export default function Prescription(props) {
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      bgcolor: 'background.paper',
      border: '2px solid #ddd',
      borderRadius: '8px',
      boxShadow: 24,
      p: 4,
    };
  
    const [open, setOpen] = useState(false);
    const [listOfPrescriptions, setListOfPrescriptions] = useState([]);
    const [prescriptions, setPrescription] = useState({
      medicineName: '',
      prescriptionLength: '',
      date: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
  
    const handleOpen = () => {
      setOpen(true);
      fetchPrescriptions();
    };
    const handleClose = () => setOpen(false);
  
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(`/patients/prescriptions/${props.id}`);
        setListOfPrescriptions(res.data.patient.prescriptions);
      } catch (err) {
        setError('Failed to fetch prescriptions. Please try again.');
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setPrescription((prev) => ({ ...prev, [name]: value }));
      // Clear validation error for the field being edited
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    };
  
    const validateForm = () => {
      const errors = {};
  
      if (!prescriptions.medicineName.trim()) {
        errors.medicineName = 'Medicine Name is required.';
      }
      if (!prescriptions.prescriptionLength.trim()) {
        errors.prescriptionLength = 'Prescription Length is required.';
      }
      if (!prescriptions.date) {
        errors.date = 'Start Date is required.';
      }
  
      setValidationErrors(errors);
      return Object.keys(errors).length === 0; // Return true if no errors
    };
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const createPrescription = async () => {
    // Validate the form before proceeding
    if (!validateForm()) {
        setError("Please fill out all required fields correctly.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Format the date to match the server's expected format
        const formattedDate = formatDate(prescriptions.date);
        const payload = {
            medicineName: prescriptions.medicineName,
            prescriptionLength: prescriptions.prescriptionLength,
            date: formattedDate,
        };

        // Send the PUT request to add the prescription
        const response = await axios.put(
            `/patients/prescriptions/${props.id}`,
            payload
        );

        // Check if the response contains the new prescription
        if (!response.data || !response.data.prescription) {
            throw new Error("Invalid response from the server");
        }

        // Update local state with the new prescription
        setListOfPrescriptions((prev) => [...prev, response.data.prescription]);

        // Reset form fields
        setPrescription({
            medicineName: '',
            prescriptionLength: '',
            date: '',
        });

        // Show success message
        setSuccess(true);
    } catch (err) {
        console.error("Error creating prescription:", err);

        // Set a more specific error message
        if (err.response) {
            // Server responded with an error status (e.g., 400, 500)
            setError(err.response.data.message || "Failed to create prescription. Please try again.");
        } else if (err.request) {
            // Request was made but no response was received
            setError("No response from the server. Please check your connection.");
        } else {
            // Something else went wrong
            setError("An unexpected error occurred. Please try again.");
        }
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
          size="small"
          color="primary"
          onClick={handleOpen}
          sx={{
            borderColor: '#3f51b5', // Primary border color
            color: '#3f51b5', // Text color
            '&:hover': {
              borderColor: '#303f9f', // Darker blue on hover
              color: '#fff', // White text on hover
              backgroundColor: '#3f51b5', // Blue background on hover
            },
          }}
        >
          Prescribe
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h5" component="h2" gutterBottom>
              Prescriptions
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine Name</TableCell>
                    <TableCell align="right">Prescription Length</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listOfPrescriptions &&
                    listOfPrescriptions.map((prescription, key) => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          {prescription.medicineName}
                        </TableCell>
                        <TableCell align="right">{prescription.prescriptionLength}</TableCell>
                        <TableCell align="right">
                          {formatDate(prescription.date)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" component="h2" gutterBottom>
              Add New Prescription
            </Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '100%' },
                display: 'flex',
                flexDirection: 'column',
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                name="medicineName"
                label="Medicine Name"
                variant="outlined"
                value={prescriptions.medicineName}
                onChange={handleChange}
                error={!!validationErrors.medicineName}
                helperText={validationErrors.medicineName}
                sx={{ mb: 2 }}
              />
              <FormControl variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Prescription Length</InputLabel>
                <Select
                  name="prescriptionLength"
                  value={prescriptions.prescriptionLength}
                  onChange={handleChange}
                  label="Prescription Length"
                  error={!!validationErrors.prescriptionLength}
                >
                  <MenuItem value="7 days">7 days</MenuItem>
                  <MenuItem value="14 days">14 days</MenuItem>
                  <MenuItem value="30 days">30 days</MenuItem>
                </Select>
                {validationErrors.prescriptionLength && (
                  <Typography variant="caption" color="error">
                    {validationErrors.prescriptionLength}
                  </Typography>
                )}
              </FormControl>
              <TextField
                name="date"
                label="Start Date"
                variant="outlined"
                type="date"
                value={prescriptions.date}
                onChange={handleChange}
                error={!!validationErrors.date}
                helperText={validationErrors.date}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={createPrescription}
                disabled={loading}
                sx={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#3f51b5', // Primary background color
                  '&:hover': {
                    backgroundColor: '#303f9f', // Darker blue on hover
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Add'}
              </Button>
            </Box>
          </Box>
        </Modal>
  
        {/* Success and Error Feedback */}
        <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Prescription added successfully!
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