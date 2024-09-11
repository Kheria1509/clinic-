const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
   patientName: {
      type: String,
      required: true,
   },
   patientId: {
      type: String,
      required: true,
   },
   doctorName: {
      type: String,
      required: true,
   },
   doctorId: {
      type: String,
      required: true,
   },
   reasonForAppointment: {
      type: Object,
      required: true,
   },
   date: {
      type: Date,
      required: true,
   },
   time: {
      type: String,
      required: true,
   },
   notes: {
      type: String,
   },
   Amount: {
      type: Number,
      required: true,
   },
   status: {
      type: String,
   },
   reportUrl: {
      type: String,  // Field to store the file path
   },
},
{
   timestamps: true,
});

const appointments = mongoose.model('appointments', appointmentSchema);
module.exports = appointments;
