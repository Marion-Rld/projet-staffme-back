require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

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

const apiRoutes = require('./src/api/main/apiRoutes');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(helmet());
app.disable('x-powered-by');

const { doubleCsrf } = require("csrf-csrf");

// Générer le secret CSRF pour toutes les requêtes
app.use((req, res, next) => {
    let csrfSecret = req.cookies['csrfSecret'];
    if (!csrfSecret) {
        csrfSecret = crypto.randomBytes(32).toString('hex');
        res.cookie('csrfSecret', csrfSecret, { httpOnly: true, secure: true, sameSite: 'Strict' });
    }
    res.locals.csrfSecret = csrfSecret;
    next();
});

const doubleCsrfOptions = {
    getSecret: (req) => req.locals.csrfSecret,
    cookieName: "XSRF-TOKEN",
    cookieOptions: { httpOnly: true, secure: true, sameSite: 'Strict' },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS']
};

const {
    invalidCsrfTokenError,
    generateToken,
    validateRequest,
    doubleCsrfProtection
} = doubleCsrf(doubleCsrfOptions);

// Générer le token CSRF pour toutes les requêtes
app.use((req, res, next) => {
    const token = generateToken(res, req);
    res.cookie('XSRF-TOKEN', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.locals.csrfToken = token;
    next();
});

// Protection CSRF pour les requêtes non ignorées
app.use(doubleCsrfProtection);

// Routes de l'API
app.use('/api', apiRoutes);

// Gestion des erreurs CSRF
app.use((err, req, res, next) => {
    if (err && err.message && err.message.includes('invalid CSRF token')) {
        res.status(403).json({ message: 'Invalid CSRF token' });
    } else {
        res.status(err.status || 500).json({
            message: err.message || 'Erreur interne du serveur'
        });
    }
});

// Route non trouvée
app.use((req, res, next) => {
    const error = new Error('Route non trouvée');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Erreur interne du serveur'
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${port}`);
});