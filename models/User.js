const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, 
    password: { type: String, required: true },
    role: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    job: { type: String, required: true },
    gender: { type: String, required: false },
    postalAddress: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);
