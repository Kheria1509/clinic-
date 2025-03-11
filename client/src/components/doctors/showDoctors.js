import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
  Tooltip,
} from '@mui/material';
import UpdateDoctor from './updateDoctor';
import DeleteDoctor from './deleteDoctor';
import Appointment from './appointments';

export default function ShowDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/doctors');
      setDoctors(res.data.doctors);
    } catch (error) {
      setError('Failed to fetch doctors. Please try again.');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/doctors/${query}`);
      setDoctors(res.data.doctors);
      setPage(1);
    } catch (error) {
      setError('Failed to fetch doctors. Please try again.');
      console.error('Error fetching doctors:', error);
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

  const paginatedDoctors = doctors.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search Form */}
      <form
        onSubmit={applySearch}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          flexDirection: isSmallScreen ? 'column' : 'row',
          width: '100%',
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
            width: isSmallScreen ? '100%' : 'auto',
          }}
          aria-label="Search"
        >
          Search
        </Button>
      </form>

      {/* Table Title */}
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        All Doctors
      </Typography>

      {/* Loading and Error Messages */}
      {loading && <Typography sx={{ textAlign: 'center', mt: 2 }}>Loading...</Typography>}
      {error && (
        <Typography sx={{ textAlign: 'center', mt: 2, color: 'error.main' }}>
          {error}
        </Typography>
      )}
      {doctors.length === 0 && !loading && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>No doctors found.</Typography>
      )}

      {/* Doctor Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          width: '100%',
          maxHeight: 'calc(100vh - 250px)',
        }}
      >
        <Table stickyHeader aria-label="doctor table" size="small">
          <TableHead>
            <TableRow>
              <TableCell width="10%">Doctor ID</TableCell>
              <TableCell width="20%">First Name</TableCell>
              <TableCell width="20%">Last Name</TableCell>
              <TableCell width="20%">Specialty</TableCell>
              <TableCell width="15%">Appointments</TableCell>
              <TableCell width="15%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDoctors.map((doctor) => (
              <TableRow
                key={doctor._id}
                sx={{
                  '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' },
                  '&:hover': { backgroundColor: '#e8f5e9' },
                }}
              >
                <TableCell>{doctor.doctorid}</TableCell>
                <TableCell>{doctor.firstName}</TableCell>
                <TableCell>{doctor.lastName}</TableCell>
                <TableCell>
                  <Tooltip title={doctor.specialty} arrow>
                    <span>{doctor.specialty}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Appointment id={doctor._id} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <DeleteDoctor id={doctor._id} />
                    <UpdateDoctor doctor={doctor} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            {/* Add empty rows when fewer items than itemsPerPage */}
            {paginatedDoctors.length < itemsPerPage &&
              Array.from({ length: itemsPerPage - paginatedDoctors.length }).map((_, index) => (
                <TableRow key={`empty-${index}`} style={{ height: 53 }}>
                  <TableCell colSpan={6} />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination and Rows Per Page */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 3,
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: 2,
        }}
      >
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
          count={Math.ceil(doctors.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          size={isSmallScreen ? 'small' : 'medium'}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}