const patientData = require("../models/patient");
const prescriptionData = require("../models/prescriptions");
const appointmentData = require("../models/appointments");
const doctorData = require("../models/doctor");

// Get list of all patients
const fetchPatients = async (req, res) => {
    try {
        const patients = await patientData.find().sort({ "paitentid": 1 });
        res.json({ patients });
        
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients" });
    }
};

// Search for patients by last name
// const applyPatientSearch = async (req, res) => {
//     const filter = req.params.filter;
//     console.log("hi");
//     try {
//         const patients = await patientData.find({
//             lastName: { $regex: filter } // Case insensitive search
//         });
//         res.json({ patients });
//     } catch (error) {
//         res.status(500).json({ message: "Error searching patients" });
//     }
// };
const applyPatientSearch = async(req,res) => {
    const filter = req.params.filter;
    //console.log(filter);
    const filterRegex = filter.split('').join('.*'); // Create a regex pattern with missing letters in mind

const patients = await patientData.find({
  $or: [
    { firstName: { $regex: filterRegex, $options: 'i' } },
    { lastName: { $regex: filterRegex, $options: 'i' } }
  ]
});


    res.json({patients})
    
}

// Get a patient's information based on a specified ID
const fetchPatient = async (req, res) => {
    const patientId = req.params.id;
    try {
        const patient = await patientData.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json({ patient });
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient" });
    }
};

// Add new patient
const createPatient = async (req, res) => {
    const patient = req.body;
    const newPatient = new patientData(patient);
    
    try {
        await newPatient.save();
        res.status(201).json({ newPatient });
    } catch (error) {
        
        res.status(409).json({ message: error.message });
    }
};

// Update patient's information
const updatePatient = async (req, res) => {
    const patientId = req.params.id;
    const patientUpdates = req.body;
    try {
        const updatedPatient = await patientData.findByIdAndUpdate(patientId, patientUpdates, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json({ updatedPatient });
    } catch (error) {
        res.status(500).json({ message: "Error updating patient" });
    }
};

// Add a new prescription for a specified patient
const addPrescription = async (req, res) => {
    const patientId = req.params.id;
    const prescription = req.body;
    const newPrescription = new prescriptionData(prescription);
    try {
        await newPrescription.save();
        const addedPrescription = await patientData.findByIdAndUpdate(patientId, {
            $push: { prescriptions: newPrescription._id }
        }, { new: true }).populate("prescriptions");
        res.json({ addedPrescription });
    } catch (error) {
        res.status(500).json({ message: "Error adding prescription" });
    }
};

// Get list of prescriptions for a specified patient
const getPrescriptions = async (req, res) => {
    const patientId = req.params.id;
    try {
        const patient = await patientData.findById(patientId).populate("prescriptions");
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json({ patient });
    } catch (error) {
        res.status(500).json({ message: "Error fetching prescriptions" });
    }
};

// Delete patient
const deletePatient = async (req, res) => {
    const patientId = req.params.id;
    //console.log(patientId);
    try {
        await patientData.findByIdAndDelete(patientId);
        res.json({ success: "Patient deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting patient" });
    }
};

// Get list of all upcoming appointments for specified patient
const fetchPatientAppointments = async (req, res) => {
    const patientId = req.params.id;
    const patient = await patientData.findOne({ _id: patientId });
   // console.log(patient.patientid);    
    try {
        const appointments = await appointmentData.find({
            patientId: patient.patientid,
            date: { $gte: new Date() }
        }).sort({ "date": 1, "time": 1 });
        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

// Get all appointments (past and upcoming) for a specified patient
const showAllPatientAppointments = async (req, res) => {
    const patientId = req.params.id;
    const patient = await patientData.findOne({ _id: patientId });
    const filter = req.params.filter;
   
    //console.log(patient.patientid);
    try {
        let appointments;
        if (filter === "all") {
            appointments = await appointmentData.find({ patientId: patient.patientid}).sort({ "date": 1, "time": 1 });
        } else {
            return res.status(400).json({ message: "Invalid filter" });
        }
        //console.log(appointments);
        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching all appointments" });
    }
};

// Create an appointment for the specified patient
const createPatientAppointment = async (req, res) => {
    const patientId = req.params.id;
    const appointment = req.body.appointments;
    //console.log(patientId);
    
    try {
        const patient = await patientData.findOne({ _id: patientId });
        //console.log(patient.patientid );
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const doctor = await doctorData.findOne({ doctorid: appointment.doctorId });

       // console.log(doctor.doctorid);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        const today = new Date();
        if (new Date(appointment.date) < today) {
            return res.status(400).json({ message: "Please choose a future date" });
        }

        const existingAppointment = await appointmentData.findOne({
            doctorId: appointment.doctorid,
            date: appointment.date,
            time: appointment.time,
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Time slot is already booked" });
        }

        const newAppointment = new appointmentData({
            patientName: patient.firstName + " " + patient.lastName,
            patientId: patient.patientid,
            doctorName: appointment.doctorName,
            doctorId: appointment.doctorId,
            reasonForAppointment: appointment.reasonForAppointment,
            date: appointment.date,
            time: appointment.time,
            notes: appointment.notes,
            Amount: appointment.Amount,  // Ensure Amount is included
            status: appointment.status,  // Ensure status is included
        });
        //console.log(newAppointment);
        await newAppointment.save();
        
        res.status(201).json({ newAppointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    fetchPatients,
    fetchPatient,
    createPatient,
    updatePatient,
    deletePatient,
    applyPatientSearch,
    addPrescription,
    getPrescriptions,
    fetchPatientAppointments,
    createPatientAppointment,
    showAllPatientAppointments,
};
