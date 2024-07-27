const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    skill_id: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    level_id: { type: Schema.Types.ObjectId, ref: 'SkillLevel', required: true },
});

const userSchema = new mongoose.Schema({
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    job: { type: String, required: false },
    gender: { type: String, required: false },
    postalAddress: { type: String, required: false },
    skills: { type: [skillSchema], required: false },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team', required: false }],
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document', required: false }],
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
