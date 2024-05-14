const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Liaison avec les utilisateurs
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }] // Liaison avec les projets
});

module.exports = mongoose.model('Team', teamSchema);