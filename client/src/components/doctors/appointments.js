import { Alert, Button, TextField, Modal, Box, Table, TableBody, TableRow, TableHead, TableContainer, TableCell, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import * as moment from 'moment';

export default function Appointment(props) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        maxHeight: '80vh', // Added maxHeight for scrollable content
        overflowY: 'auto', // Ensures the content scrolls if it exceeds maxHeight
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
      fetchAppointments();
    }
    const handleClose = () => setOpen(false);

    const [listOfAppointments, setListOfAppointments] = useState([]);
    const fetchAppointments = async () => {
        const res = await axios.get(`/doctor/appointments/${props.id}`);
        setListOfAppointments(res.data.appointments);
    };

    const fetchAll = async () => {
        const button = document.getElementById("showHide");
        if (button.textContent === "Show all appointments") {
            const res = await axios.get(`/doctor/appointments/${props.id}/all`);
            button.textContent = "Hide past appointments";
            setListOfAppointments(res.data.appointments).then(() => {
                window.location.reload(false);
            });
        } else {
            button.textContent = "Show all appointments";
            fetchAppointments();
        }
    };

    const [appointments, setAppointments] = useState({
        appointments: {
            patientName: "",
            patientId: "",
            doctorName: "",
            doctorId: "",
            reasonForAppointment: "",
            date: "",
            time: "",
            Amount: "",
            status: "",
            reportFile: null,
        }
    });

    const [alert, setAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    const createAppointment = async () => {
        try {
            await axios.post(`/doctor/appointments/${props.id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                appointments: appointments,
            });
            setAlertContent("Appointment Booked");
            setAlert(true);
            setAlertSeverity('success');
        } catch (err) {
            console.log(err.response.data.message);
            setAlertContent(err.response.data.message);
            setAlert(true);
            setAlertSeverity('error');
        }
    };

    // Function to handle file download for a specific appointment
    const handleFileDownload = (reportUrl) => {
        const link = document.createElement('a');
        link.href = reportUrl;
        link.download = reportUrl.split('/').pop();
        link.click();
    };

    return (
        <>
            <Button variant="contained" color="primary" size="small" onClick={handleOpen}>
                View Appointments
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Appointments
                    </Typography>
                    {alert ? <Alert severity={alertSeverity} style={{ marginBottom: '16px' }}>{alertContent}</Alert> : null}
                    <TableContainer component={Paper} sx={{ marginBottom: '16px', boxShadow: 3 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Patient</TableCell>
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
                                {listOfAppointments && listOfAppointments.map((appointment, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">
                                            {appointment.patientName}
                                        </TableCell>
                                        <TableCell align="right">{appointment.reasonForAppointment}</TableCell>
                                        <TableCell align="right">{moment(appointment.date).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell align="right">{appointment.time}</TableCell>
                                        <TableCell align="right">{appointment.notes}</TableCell>
                                        <TableCell align="right">{appointment.Amount}</TableCell>
                                        <TableCell align="right">{appointment.status}</TableCell>
                                        <TableCell align="right">
                                            {appointment.reportUrl ? (
                                                <Button variant="contained" color="secondary" onClick={() => handleFileDownload(appointment.reportUrl)}>
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
                    <Button id="showHide" variant="outlined" onClick={fetchAll} color="primary">
                        Show all appointments
                    </Button>
                    <Typography variant="h6" component="h2" marginTop="16px" gutterBottom>
                        Add New Appointment
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
                        <TextField label="Patient Name" variant="outlined" value={appointments.patientName} onChange={(event) => {
                            setAppointments({ ...appointments, patientName: event.target.value })
                        }} />
                        <TextField label="Patient ID" variant="outlined" value={appointments.patientId} onChange={(event) => {
                            setAppointments({ ...appointments, patientId: event.target.value })
                        }} />
                        <TextField label="Reason for Appointment" variant="outlined" value={appointments.reasonForAppointment} onChange={(event) => {
                            setAppointments({ ...appointments, reasonForAppointment: event.target.value })
                        }} />
                        <TextField variant="outlined" type="date" value={appointments.date} onChange={(event) => {
                            setAppointments({ ...appointments, date: event.target.value })
                        }} />
                        <TextField variant="outlined" type="time" value={appointments.time} onChange={(event) => {
                            setAppointments({ ...appointments, time: event.target.value })
                        }} />
                        <TextField label="Notes" variant="outlined" value={appointments.notes} onChange={(event) => {
                            setAppointments({ ...appointments, notes: event.target.value })
                        }} />
                        <TextField label="Amount" variant="outlined" value={appointments.Amount} onChange={(event) => {
                            setAppointments({ ...appointments, Amount: event.target.value })
                        }} />
                        <TextField label="Status" variant="outlined" value={appointments.status} onChange={(event) => {
                            setAppointments({ ...appointments, status: event.target.value })
                        }} />
                        <Typography>Report</Typography>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={(e) => setAppointments({ ...appointments, reportFile: e.target.files[0] })}
                            style={{ marginBottom: '16px' }}
                        />
                        <Button variant="contained" color="primary" onClick={createAppointment}>
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
