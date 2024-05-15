const mongoose = require('mongoose');

const skillLevelSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = mongoose.model('Skill-level', skillLevelSchema);