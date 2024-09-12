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
        border: '2px solid #000',
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
    const [uploadedReports, setUploadedReports] = useState({}); // Store uploaded reports for each appointment

    const fetchAppointments = async () => {
        const res = await axios.get(`/patient/appointments/${props.id}`);
        console.log(res.data.appointments);
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
            // const formData = new FormData();
            // formData.append('doctorName', appointments.doctorName);
            // formData.append('doctorId', appointments.doctorId);
            // formData.append('reasonForAppointment', appointments.reasonForAppointment);
            // formData.append('date', appointments.date);
            // formData.append('time', appointments.time);
            // formData.append('notes', appointments.notes);
            // formData.append('Amount', appointments.Amount);
            // formData.append('status', appointments.status);
            // formData.append('reportFile', appointments.reportFile); // File upload
            
            
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
            <Button variant="outlined" size="small" color="inherit" onClick={handleOpen}>Appointments</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Box
                        component="form"
                        minHeight="20vh"
                        width="100%"
                        noValidate
                        autoComplete="off">
                        <h2>Appointments</h2>
                        {alert ? <Alert severity={alertSeverity}>{alertContent}</Alert> : <></>}
                        <TableContainer component={Paper}>
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
                                    {listOfAppointments && listOfAppointments.map((appointments, key) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {appointments.doctorName}
                                            </TableCell>
                                            <TableCell align="right">{appointments.reasonForAppointment}</TableCell>
                                            <TableCell align="right">{moment(appointments.date).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell align="right">{appointments.time}</TableCell>
                                            <TableCell align="right">{appointments.notes}</TableCell>
                                            <TableCell align="right">{appointments.Amount}</TableCell>
                                            <TableCell align="right">{appointments.Status}</TableCell>
                                            
                                            <TableCell align="right">
                                                {appointments.reportUrl ? (
                                                    <Button variant="outlined" onClick={() => handleFileDownload(appointments.reportUrl)}>
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
                        <Button id="showHidePatientAppointments" onClick={fetchAll}>Show all appointments</Button>
                        <h2>Add New Appointment</h2>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '25ch' },
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
                            <TextField id="outlined-basic" label="Notes" variant="outlined" value={appointments.note} onChange={(event => {
                                setAppointments({ ...appointments, notes: event.target.value })
                            })} />
                            <TextField id="outlined-basic" label="Amount" variant="outlined" value={appointments.Amount} onChange={(event => {
                                setAppointments({ ...appointments, Amount: event.target.value })
                            })} />
                            <TextField id="outlined-basic" label="Status" variant="outlined" value={appointments.status} onChange={(event => {
                                setAppointments({ ...appointments, status: event.target.value })
                            })} />
                            <Typography>Report</Typography>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={(e) => setAppointments({ ...appointments, reportFile: e.target.files[0] })}
                            />
                            <Button variant="contained" onClick={createAppointment}>Add</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
