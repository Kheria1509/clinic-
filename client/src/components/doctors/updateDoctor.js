import React from "react";
import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Modal } from '@mui/material';
import axios from "axios";

export default function UpdateDoctor(props) {
    const [updateDoctor, setUpdateDoctor] = useState({
        _id: null,
        firstName: '',
        lastName: '',
        specialty: '',
    });

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const [openModal, setOpenModal] = useState(false);

    const toggleUpdate = (doctor) => {
        setUpdateDoctor({
            _id: doctor._id,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            specialty: doctor.specialty,
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setUpdateDoctor({ _id: null });
    };

    const update = async () => {
        try {
            await axios.put(`/doctors/${updateDoctor._id}`, updateDoctor);
            setAlert({
                open: true,
                message: 'Doctor updated successfully!',
                severity: 'success',
            });
            setTimeout(() => window.location.reload(false), 1500);
        } catch (error) {
            setAlert({
                open: true,
                message: 'Failed to update doctor. Please try again.',
                severity: 'error',
            });
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => toggleUpdate(props.doctor)}
                sx={{ mb: 2 }}
            >
                Update
            </Button>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="update-doctor-modal"
                aria-describedby="update-doctor-form"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Update Doctor
                    </Typography>
                    {alert.open && (
                        <Alert
                            severity={alert.severity}
                            sx={{ width: '100%', mb: 2 }}
                            onClose={() => setAlert({ ...alert, open: false })}
                        >
                            {alert.message}
                        </Alert>
                    )}
                    <TextField
                        id="first-name"
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={updateDoctor.firstName}
                        onChange={(event) => setUpdateDoctor({ ...updateDoctor, firstName: event.target.value })}
                    />
                    <TextField
                        id="last-name"
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={updateDoctor.lastName}
                        onChange={(event) => setUpdateDoctor({ ...updateDoctor, lastName: event.target.value })}
                    />
                    <TextField
                        id="specialty"
                        label="Specialty"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={updateDoctor.specialty}
                        onChange={(event) => setUpdateDoctor({ ...updateDoctor, specialty: event.target.value })}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={update}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}