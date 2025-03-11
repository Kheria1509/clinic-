import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Table, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableContainer, 
  TableCell, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Pagination,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip
} from '@mui/material';
import UpdatePatient from './updatePatient';
import Prescription from '../prescriptions';
import DeletePatient from './deletePatient';
import ContactInfo from '../contactInfo';
import PatientAppointment from './appointment';

export default function ShowPatients() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/patients");
      setPatients(res.data.patients);
    } catch (error) {
      setError("Failed to fetch patients. Please try again.");
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const applySearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/patients/${query}`);
      setPatients(res.data.patients);
      setPage(1);
    } catch (error) {
      setError("Failed to fetch patients. Please try again.");
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const paginatedPatients = patients.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      <form
        onSubmit={applySearch}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
          width: '100%'
        }}
      >
        <TextField
          id="search"
          label="Search by Last Name"
          variant="outlined"
          size="small"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ width: isSmallScreen ? '100%' : '300px' }}
          aria-label="Search by Last Name"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            textTransform: 'none',
            borderRadius: '5px',
            width: isSmallScreen ? '100%' : 'auto'
          }}
          aria-label="Search"
        >
          Search
        </Button>
      </form>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        All Patients
      </Typography>

      {loading && <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading...</Typography>}
      {error && (
        <Typography sx={{ textAlign: 'center', mt: 2, color: 'error.main' }}>
          {error}
        </Typography>
      )}
      {patients.length === 0 && !loading && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>No patients found.</Typography>
      )}

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 3,
          width: '100%',
          maxHeight: 'calc(100vh - 250px)'
        }}
      >
        <Table 
          stickyHeader 
          aria-label="patient table"
          size="small" // Use small size to make the table more compact
        >
          <TableHead>
            <TableRow>
              <TableCell width="8%">ID</TableCell>
              <TableCell width="12%">First Name</TableCell>
              <TableCell width="12%">Last Name</TableCell>
              <TableCell width="5%">Age</TableCell>
              <TableCell width="20%">Medical Conditions</TableCell>
              <TableCell width="10%">Contact</TableCell>
              <TableCell width="10%">Appointments</TableCell>
              <TableCell width="10%">Prescription</TableCell>
              <TableCell width="13%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow
                key={patient._id}
                sx={{
                  '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' },
                  '&:hover': { backgroundColor: '#e8f5e9' },
                }}
              >
                <TableCell>{patient.patientid}</TableCell>
                <TableCell>
                  {patient.firstName}
                </TableCell>
                <TableCell>{patient.lastName}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell sx={{ 
                  maxWidth: 0, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  <Tooltip title={patient.conditions} arrow>
                    <span>{patient.conditions}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <ContactInfo id={patient._id} />
                </TableCell>
                <TableCell>
                  <PatientAppointment id={patient._id} />
                </TableCell>
                <TableCell>
                  <Prescription id={patient._id} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <DeletePatient id={patient._id} />
                    <UpdatePatient patient={patient} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Add empty rows when fewer items than itemsPerPage */}
            {paginatedPatients.length < itemsPerPage && 
              Array.from({ length: itemsPerPage - paginatedPatients.length }).map((_, index) => (
                <TableRow key={`empty-${index}`} style={{ height: 53 }}>
                  <TableCell colSpan={9} />
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mt: 3,
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Rows per page:
          </Typography>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ padding: '5px', borderRadius: '4px' }}
          >
            <option value={7}>7</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
          </select>
        </Box>
        
        <Pagination
          count={Math.ceil(patients.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          size={isSmallScreen ? "small" : "medium"}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}