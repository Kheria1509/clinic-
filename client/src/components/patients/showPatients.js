import * as React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell, Paper, TextField, Button, Typography, Box } from '@mui/material';
import UpdatePatient from './updatePatient';
import Prescription from '../prescriptions';
import DeletePatient from './deletePatient';
import ContactInfo from '../contactInfo';
import PatientAppointment from './appointment';

export default function ShowPatients() {

  useEffect(() => {
    fetchPatients();
  }, []);

  const [patients, setPatients] = useState([]);
  const fetchPatients = async () => {
    const res = await axios.get("/patients");
    setPatients(res.data.patients);
  };

  const [query, setQuery] = useState('');
  const applySearch = async (event) => {
    event.preventDefault();
    console.log(query);
    const res = await axios.get(`/patients/${query}`);
    setPatients(res.data.patients);
  };

  return (
    <Box sx={{ padding: 3 }}>
      

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
          value={query}
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
          onClick={applySearch}
        >
          Search
        </Button>
      </form>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        All Patients
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="patient table">
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Medical Conditions</TableCell>
              <TableCell align="right">Contact Information</TableCell>
              <TableCell align="right">Appointments</TableCell>
              <TableCell align="right">Add Prescription</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients && patients.map((patient) => (
              <TableRow key={patient._id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' }, '&:hover': { backgroundColor: '#e8f5e9' } }}>
                <TableCell align="right">{patient.patientid}</TableCell>
                <TableCell component="th" scope="row">
                  {patient.firstName}
                </TableCell>
                <TableCell align="right">{patient.lastName}</TableCell>
                <TableCell align="right">{patient.age}</TableCell>
                <TableCell align="right">{patient.conditions}</TableCell>
                <TableCell align="right">
                  <ContactInfo id={patient._id} />
                </TableCell>
                <TableCell align="right">
                  <PatientAppointment id={patient._id} />
                </TableCell>
                <TableCell align="right">
                  <Prescription id={patient._id} />
                </TableCell>
                <TableCell align="right">
                  <DeletePatient id={patient._id} />
                  <UpdatePatient patient={patient} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
