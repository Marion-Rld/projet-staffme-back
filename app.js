// app.js
require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000; // Utilisez le port spécifié dans les variables d'environnement ou 3000 par défaut

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;
database
	.once('open', () => {
		console.log('mongoDB database connection established');
	})
	.on('error', err => {
		console.log('Error: ', err);
	});

// Importez les routes définies dans apiRoutes.js
const apiRoutes = require('./routes/apiRoutes');

// Middleware pour analyser les corps de requête JSON
app.use(express.json());

// Middleware pour gérer les en-têtes CORS (si nécessaire)
app.use(cors());

// Utilisez les routes définies dans apiRoutes.js
app.use('/api', apiRoutes);

// Gestionnaire d'erreurs pour les routes non trouvées
app.use((req, res, next) => {
    const error = new Error('Route non trouvée');
    error.status = 404;
    next(error);
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Erreur interne du serveur'
    });
});

// Écoute du serveur sur le port spécifié
app.listen(port, '0.0.0.0', function() { 
    console.log(`Serveur démarré sur le port ${port}`);
});