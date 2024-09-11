const prescriptionSchema = require("./prescriptions")
const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
    firstName: {
        type: String,
        
        required: true,
    },
    lastName: String,
    age: Number,
    conditions: [String],
    email: String,
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
        validate: {
          validator: function(v) {
            return /^\d{10}$/.test(v); // Regular expression to check for exactly 10 digits
          },
          message: props => `${props.value} is not a valid 10-digit phone number!`
        },
    },
    address: String,
    patientid: {
        type: Number,  
        required: true,
        unique: true,
    },
    prescriptions: [{type:mongoose.Schema.Types.ObjectId, ref:"prescription"}]
});
const patient = mongoose.model('patient', patientSchema);

module.exports = patient;





