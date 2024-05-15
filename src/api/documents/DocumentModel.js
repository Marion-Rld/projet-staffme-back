const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Liaison avec l'utilisateur
});

module.exports = mongoose.model('Document', documentSchema);