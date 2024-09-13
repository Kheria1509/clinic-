const doctorData = require("../models/doctor")
const appointmentData = require("../models/appointments")
const patientData = require("../models/patient")

// Get list of all doctors
const fetchDoctors = async(req,res) => {
    const doctors = await doctorData.find().sort({"doctorid":1});
    res.json({doctors})
}

// Search for doctors by last name
const applyDoctorSearch = async(req,res) => {
    const filter = req.params.filter;
    const filterRegex = filter.split('').join('.*'); // Create regex pattern allowing for missing letters

    const doctors = await doctorData.find({
      $or: [
        { firstName: { $regex: filterRegex, $options: 'i' } }, // Case-insensitive and partial match for firstName
        { lastName: { $regex: filterRegex, $options: 'i' } }   // Case-insensitive and partial match for lastName
      ]
    });
    
    res.json({doctors})
}

// Get a doctor's information based on specified ID
const fetchDoctor = async(req,res) => {
    const doctorId = req.params.id
    const doctor = await doctorData.findById(doctorId);
    res.json({doctor})
}

// Add new doctor
const createDoctor = async(req,res) => {
    const doctor = req.body;
    const newDoctor = new doctorData(doctor);
    try {
        await newDoctor.save();
        res.json({newDoctor});
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// Update doctor's information
const updateDoctor =async(req,res) => {
    const doctorId = req.params.id;
    const doctor = req.body;
    const updatedDoctor = await doctorData.findByIdAndUpdate(doctorId, {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialty: doctor.age,
    }); 
    res.json({doctor});
}

// Delete doctor
const deleteDoctor = async(req,res) => {
    doctorId = req.params.id;
    await doctorData.findByIdAndDelete(doctorId);
    res.json({success: "Doctor deleted"});
}
// Get all appointments ( upcoming) for a specified doctor
const fetchDoctorAppointments = async (req, res) => {
    const doctorId = req.params.id;
    //console.log("Doctor ID:", doctorId); // Debugging

    try {
        // Ensure the correct method name is used
        const doctor = await doctorData.findOne({ _id: doctorId });
//console.log(doctor.doctorid);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const appointments = await appointmentData.find({
            doctorId: doctor.doctorid,
            date: { $gte: new Date() }
        }).sort({ date: 1, time: 1 });
       // console.log(appointments);
        res.json({ appointments });
    } catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).json({ message: "Error fetching appointments" });
    }
};


// Get all appointments (past and upcoming) for a specified doctor
const showAllDoctorAppointments = async(req,res) => {
    const doctorId = req.params.id;
    const doctor = await doctorData.findOne({ _id: doctorId });
    //console.log(doctor.doctorid);
    
    const filter = req.params.filter;
    if (filter === "all")
    {
        const appointments = await appointmentData.find({
            doctorId: doctor.doctorid
        }).sort({"date":1, "time":1})
        res.json({appointments})
    }

}

// Create an appointment for the specified doctor
const createDoctorAppointment = async (req, res) => {
    const doctorId = req.params.id;
    const appointment = req.body.appointments;

    
    try {
        const selectedDoctor = await doctorData.findOne({_id: doctorId});
       // console.log(selectedDoctor.doctorid);
        if (!selectedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const today = new Date();
        if (new Date(appointment.date) < today) {
            return res.status(400).json({ message: "Please choose a future date" });
        }

        const existingAppointment = await appointmentData.findOne({
            doctorId: selectedDoctor.doctorid,
            date: appointment.date,
            time: appointment.time,
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Time slot is already booked" });
        }

        const newAppointment = new appointmentData({
            patientName: appointment.patientName,
            patientId: appointment.patientId,
            doctorName: selectedDoctor.firstName + " " + selectedDoctor.lastName,
            doctorId: selectedDoctor.doctorid,
            reasonForAppointment: appointment.reasonForAppointment,
            date: appointment.date,
            time: appointment.time,
            notes: appointment.notes,
            Amount: appointment.Amount,  // Ensure Amount is included
            status: appointment.status,  // Ensure status is included
        });
       // console.log(newAppointment);

        await newAppointment.save();
        
        res.status(201).json({ newAppointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    fetchDoctors,
    fetchDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    applyDoctorSearch,
    fetchDoctorAppointments,
    createDoctorAppointment,
    showAllDoctorAppointments,
};