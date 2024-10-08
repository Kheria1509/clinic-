// Import dependencies
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { fetchPatients, fetchPatient, createPatient, updatePatient, deletePatient, applyPatientSearch, addPrescription, getPrescriptions, fetchPatientAppointments, createPatientAppointment, deletePatientAppointment, showAllPatientAppointments } = require("./controllers/patientControllers");
const { fetchDoctors, fetchDoctor, createDoctor, updateDoctor, deleteDoctor, applyDoctorSearch, fetchDoctorAppointments, createDoctorAppointment, showAllDoctorAppointments } = require("./controllers/doctorControllers");
const { signup, login, logout, checkAuth } = require("./controllers/userControllers");
const requireAuth = require("./middleware/requireAuth");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Create and configure express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

// Connect to database
connectToDb();

// Routing
app.use('/',(req,res,next)=>{
    //print req url
   
    next();
})
app.post('/login', login);
app.get('/logout', logout);
app.get('/check-auth', requireAuth, checkAuth);

app.get('/patients', fetchPatients);
app.get('/patients/:filter', applyPatientSearch);
app.get('/patient/:id', fetchPatient);
app.post('/patients', createPatient);
app.put('/patients/:id', updatePatient);
app.delete('/patients/:id', deletePatient);

app.put('/patients/prescriptions/:id', addPrescription);
app.get('/patients/prescriptions/:id', getPrescriptions);

app.get('/patient/appointments/:id', fetchPatientAppointments);
app.post('/patient/appointments/:id', createPatientAppointment);
app.get('/patient/appointments/:id/:filter', showAllPatientAppointments);

app.get('/doctor/appointments/:id', fetchDoctorAppointments);
app.post('/doctor/appointments/:id', createDoctorAppointment);
app.get('/doctor/appointments/:id/:filter', showAllDoctorAppointments);

app.get('/doctors', fetchDoctors);
app.get('/doctors/:filter', applyDoctorSearch);
app.get('/doctors/:id', fetchDoctor);
app.post('/doctors', createDoctor);
app.put('/doctors/:id', updateDoctor);
app.delete('/doctors/:id', deleteDoctor);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
