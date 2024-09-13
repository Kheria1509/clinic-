import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableRow, TableHead, TableContainer, Typography, TableCell, Paper } from '@mui/material';
import { Button, TextField } from '@mui/material';
import UpdateDoctor from './updateDoctor';
import DeleteDoctor from './deleteDoctor';
import Appointment from './appointments';

export default function ShowDoctors() {

  useEffect(() => {
    fetchDoctors();
  }, []);

  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    const res = await axios.get("/doctors");
    console.log(res);
    setDoctors(res.data.doctors);
  };

  const [query, setQuery] = useState('');
  const applySearch = async (query) => {
    const res = await axios.get(`/doctors/${query}`);
    setDoctors(res.data.doctors);
    console.log(doctors);
  };

  return (
    <>
      {/* Search Form */}
      <form
        onSubmit={(e) => { 
          e.preventDefault(); 
          applySearch(query); 
        }} 
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
      >
        <TextField
          label="Search by Last Name"
          variant="outlined"
          size="small"
          onChange={event => setQuery(event.target.value)}
          style={{ width: '300px' }}
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
            borderRadius: '5px'
          }}
          
        >
          Search
        </Button>
      </form>

      {/* Doctor Table */}
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        All Doctors
      </Typography>
      <TableContainer 
        component={Paper} 
        style={{ boxShadow: '0 5px 15px rgba(0,0,0,0.1)', borderRadius: '10px' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f6f8' }}>
              <TableCell style={{ fontWeight: 'bold' }}>Doctor ID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Last Name</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Specialty</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Appointments</TableCell>
              <TableCell align="right" style={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors && doctors.map((doctor, key) => (
              <TableRow 
                key={key} 
                hover 
                style={{ backgroundColor: key % 2 === 0 ? '#f9f9f9' : '#fff' }}
              >
                <TableCell component="th" scope="row">
                  {doctor.doctorid}
                </TableCell>
                <TableCell component="th" scope="row">
                  {doctor.firstName}
                </TableCell>
                <TableCell align="right">{doctor.lastName}</TableCell>
                <TableCell align="right">{doctor.specialty}</TableCell>
                <TableCell align="right">
                  <Appointment id={doctor._id} />
                </TableCell>
                <TableCell align="right">
                  <DeleteDoctor id={doctor._id} />
                  <UpdateDoctor doctor={doctor} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
