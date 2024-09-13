import { Alert, Button, TextField, Modal, Box, Table, TableBody, TableRow, TableHead, TableContainer, TableCell, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import * as moment from 'moment';

export default function PatientAppointment(props) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #ddd',
        borderRadius: '8px',
        maxHeight: '80vh', // Added maxHeight for scrollable content
        overflowY: 'auto', // Ensures the content scrolls if it exceeds maxHeight
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        fetchAppointments();
    };
    const handleClose = () => setOpen(false);

    const [listOfAppointments, setListOfAppointments] = useState([]);
    const [uploadedReports, setUploadedReports] = useState({});

    const fetchAppointments = async () => {
        const res = await axios.get(`/patient/appointments/${props.id}`);
        setListOfAppointments(res.data.appointments);
    };

    const fetchAll = async () => {
        const button = document.getElementById("showHidePatientAppointments");
        if (button.textContent === "Show all appointments") {
            const res = await axios.get(`/patient/appointments/${props.id}/all`);
            button.textContent = "Hide past appointments";
            setListOfAppointments(res.data.appointments);
        } else {
            button.textContent = "Show all appointments";
            fetchAppointments();
        }
    };

    const [appointments, setAppointments] = useState({
        patientName: "",
        patientId: "",
        doctorName: "",
        doctorId: "",
        reasonForAppointment: "",
        date: "",
        time: "",
        notes: "",
        Amount: "",
        status: "",
        reportFile: null,
    });

    const [alert, setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    const createAppointment = async () => {
        try {
            await axios.post(`/patient/appointments/${props.id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                appointments: appointments,
            });

            setAlertContent("Appointment Booked");
            setAlert(true);
            setAlertSeverity('success');
        } catch (err) {
            setAlertContent(err.response.data.message);
            setAlert(true);
            setAlertSeverity('error');
        }
    };

    const handleFileDownload = (reportUrl) => {
        const link = document.createElement('a');
        link.href = reportUrl;
        link.download = reportUrl.split('/').pop();
        link.click();
    };

    return (
        <>
            <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={handleOpen}
                sx={{
                    borderColor: '#4CAF50', // Primary border color
                    color: '#4CAF50', // Text color
                    '&:hover': {
                        borderColor: '#45a049', // Darker green on hover
                        color: '#fff', // White text on hover
                        backgroundColor: '#4CAF50' // Green background on hover
                    }
                }}
            >
                Appointments
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Appointments
                    </Typography>
                    {alert && <Alert severity={alertSeverity} sx={{ mb: 2 }}>{alertContent}</Alert>}
                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Doctor</TableCell>
                                    <TableCell align="right">Reason for Appointment</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                    <TableCell align="right">Time</TableCell>
                                    <TableCell align="right">Notes</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                    <TableCell align="right">Reports</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listOfAppointments.map((appointment, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {appointment.doctorName}
                                        </TableCell>
                                        <TableCell align="right">{appointment.reasonForAppointment}</TableCell>
                                        <TableCell align="right">{moment(appointment.date).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell align="right">{appointment.time}</TableCell>
                                        <TableCell align="right">{appointment.notes}</TableCell>
                                        <TableCell align="right">{appointment.Amount}</TableCell>
                                        <TableCell align="right">{appointment.status}</TableCell>
                                        <TableCell align="right">
                                            {appointment.reportUrl ? (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleFileDownload(appointment.reportUrl)}
                                                    sx={{
                                                        color: '#4CAF50', // Text color
                                                        borderColor: '#4CAF50', // Border color
                                                        '&:hover': {
                                                            borderColor: '#45a049', // Darker green on hover
                                                            backgroundColor: '#4CAF50', // Green background on hover
                                                            color: '#fff' // White text on hover
                                                        }
                                                    }}
                                                >
                                                    Download Report
                                                </Button>
                                            ) : (
                                                "N/A"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        id="showHidePatientAppointments"
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={fetchAll}
                        sx={{
                            mb: 2,
                            borderColor: '#4CAF50', // Primary border color
                            color: '#4CAF50', // Text color
                            '&:hover': {
                                borderColor: '#45a049', // Darker green on hover
                                color: '#fff', // White text on hover
                                backgroundColor: '#4CAF50' // Green background on hover
                            }
                        }}
                    >
                        Show all appointments
                    </Button>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Add New Appointment
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
                        <TextField id="outlined-basic" label="Doctor Name" variant="outlined" value={appointments.doctorName} onChange={(event => {
                            setAppointments({ ...appointments, doctorName: event.target.value })
                        })} />
                        <TextField id="outlined-basic" label="Doctor ID" variant="outlined" value={appointments.doctorId} onChange={(event => {
                            setAppointments({ ...appointments, doctorId: event.target.value })
                        })} />
                        <TextField id="outlined-basic" label="Reason for Appointment" variant="outlined" value={appointments.reasonForAppointment} onChange={(event => {
                            setAppointments({ ...appointments, reasonForAppointment: event.target.value })
                        })} />
                        <TextField id="outlined-basic" variant="outlined" type="date" value={appointments.date} onChange={(event => {
                            setAppointments({ ...appointments, date: event.target.value })
                        })} />
                        <TextField id="outlined-basic" variant="outlined" type="time" min="09:00" max="17:00" value={appointments.time} onChange={(event => {
                            setAppointments({ ...appointments, time: event.target.value })
                        })} />
                        <TextField id="outlined-basic" label="Notes" variant="outlined" value={appointments.notes} onChange={(event => {
                            setAppointments({ ...appointments, notes: event.target.value })
                        })} />
                        <TextField id="outlined-basic" label="Amount" variant="outlined" value={appointments.Amount} onChange={(event => {
                            setAppointments({ ...appointments, Amount: event.target.value })
                        })} />
                        <TextField id="outlined-basic" label="Status" variant="outlined" value={appointments.status} onChange={(event => {
                            setAppointments({ ...appointments, status: event.target.value })
                        })} />
                        <Typography variant="subtitle1" component="h2" sx={{ mt: 2 }}>
                            Report
                        </Typography>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={(e) => setAppointments({ ...appointments, reportFile: e.target.files[0] })}
                            style={{ marginBottom: '16px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={createAppointment}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
