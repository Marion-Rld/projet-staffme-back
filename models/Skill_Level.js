const mongoose = require('mongoose');

const skillLevelSchema = new mongoose.Schema({

    id: { type: Number, required: true, unique: true }, 
    name: { type: String, required: true },
    
});

module.exports = mongoose.model('Skill_Level', skillLevelSchema);