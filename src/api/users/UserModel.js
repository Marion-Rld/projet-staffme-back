const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition du sous-schéma pour un objet skill
const skillSchema = new Schema({
    skill_id: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    level_id: { type: Schema.Types.ObjectId, ref: 'SkillLevel', required: true },
});

const userSchema = new mongoose.Schema({
    password: { type: String, required: true },
    role: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    job: { type: String, required: true },
    gender: { type: String, required: false },
    postalAddress: { type: String, required: false },
    skills: { type: [skillSchema], required: false },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }], // Liaison avec les équipes
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }] // Liaison avec les documents
});

module.exports = mongoose.model('User', userSchema);