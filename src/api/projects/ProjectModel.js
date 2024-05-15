const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new mongoose.Schema({
    name : { type: String, required: true },
    description : { type: String, required: true },
    status : { type: String, required: true },
    startDate : { type: Date, required: true },
    endDate : { type: Date, required: true },
    budget : { type: Number, required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }] // Liaison avec les équipes
});

module.exports = mongoose.model('Project', projectSchema);