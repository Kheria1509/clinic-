import React, { useState } from "react";
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from "axios";

export default function UpdatePatient(props) {

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

  const toggleUpdate = (patient) => {
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
  };

  const update = async () => {
    const updatedPatient = updatePatient;
    await axios.put(`/patients/${updatePatient._id}`, updatedPatient).then(() => {
      window.location.reload(false);
    });
  };

  return (
    <>
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => toggleUpdate(props.patient)} 
        sx={{ mb: 2 }}
      >
        Update
      </Button>
      {updatePatient._id && (
        <Box
          component="form"
          sx={{
            backgroundColor: '#f9f9f9',
            padding: 3,
            borderRadius: 1,
            boxShadow: 2,
            width: 'fit-content',
            mx: 'auto',
          }}
          noValidate
          autoComplete="off"
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Update Patient Information
          </Typography>
          <TextField
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            sx={{ mb: 2, width: '100%' }}
            value={updatePatient.firstName}
            onChange={(event) => setUpdatePatient({ ...updatePatient, firstName: event.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            sx={{ mb: 2, width: '100%' }}
            value={updatePatient.lastName}
            onChange={(event) => setUpdatePatient({ ...updatePatient, lastName: event.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="Age"
            variant="outlined"
            sx={{ mb: 2, width: '100%' }}
            value={updatePatient.age}
            onChange={(event) => setUpdatePatient({ ...updatePatient, age: event.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="Medical Conditions"
            variant="outlined"
            sx={{ mb: 2, width: '100%' }}
            value={updatePatient.conditions}
            onChange={(event) => setUpdatePatient({ ...updatePatient, conditions: event.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            sx={{ mb: 2, width: '100%' }}
            value={updatePatient.email}
            onChange={(event) => setUpdatePatient({ ...updatePatient, email: event.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="Phone Number"
            variant="outlined"
            sx={{ mb: 2, width: '100%' }}
            value={updatePatient.phoneNumber}
            onChange={(event) => setUpdatePatient({ ...updatePatient, phoneNumber: event.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            sx={{ mb: 2, width: '100%' }}
            value={updatePatient.address}
            onChange={(event) => setUpdatePatient({ ...updatePatient, address: event.target.value })}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => update()}
              sx={{ flex: 1 }}
            >
              Save
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => setUpdatePatient({_id: null})}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
