import { Button, TextField, Modal, Box, Typography, Table, TableBody, TableRow, TableHead, TableContainer, TableCell, Paper } from '@mui/material';
import * as React from 'react';
import { useState, useEffect } from 'react';
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
    const handleOpen = () => {
        setOpen(true);
        fetchPrescriptions();
    };
    const handleClose = () => setOpen(false);

    const [listOfPrescriptions, setListOfPrescriptions] = useState([]);
    const fetchPrescriptions = async () => {
        const res = await axios.get(`/patients/prescriptions/${props.id}`);
        setListOfPrescriptions(res.data.patient.prescriptions);
    };

    const [prescriptions, setPrescription] = useState({
        medicineName: "",
        prescriptionLength: "",
        date: "",
    });

    const createPrescription = async () => {
        await axios.put(`http://localhost:3000/patients/prescriptions/${props.id}`, prescriptions).then(() => {
            window.location.reload(false);
        });
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
                        backgroundColor: '#3f51b5' // Blue background on hover
                    }
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
                                {listOfPrescriptions && listOfPrescriptions.map((prescription, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {prescription.medicineName}
                                        </TableCell>
                                        <TableCell align="right">{prescription.prescriptionLength}</TableCell>
                                        <TableCell align="right">{prescription.date}</TableCell>
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
                            flexDirection: 'column'
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="outlined-basic"
                            label="Medicine Name"
                            variant="outlined"
                            value={prescriptions.medicineName}
                            onChange={(event) => setPrescription({ ...prescriptions, medicineName: event.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Prescription Length"
                            variant="outlined"
                            value={prescriptions.prescriptionLength}
                            onChange={(event) => setPrescription({ ...prescriptions, prescriptionLength: event.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Start Date"
                            variant="outlined"
                            type="date"
                            value={prescriptions.date}
                            onChange={(event) => setPrescription({ ...prescriptions, date: event.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={createPrescription}
                            sx={{
                                alignSelf: 'flex-start',
                                backgroundColor: '#3f51b5', // Primary background color
                                '&:hover': {
                                    backgroundColor: '#303f9f' // Darker blue on hover
                                }
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
