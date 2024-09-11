const mongoose = require("mongoose")

const doctorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    specialty: String,
    doctorid: {
        type: Number,  // Replace Int32Array with Number
        required: true,
        unique: true,
    }
});

const doctor = mongoose.model('doctor', doctorSchema);
module.exports = doctor;