require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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

/*
const { doubleCsrf } = require("csrf-csrf");

const doubleCsrfOptions = {
    getSecret: (req) => req.cookies['csrfSecret'],
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

app.use(doubleCsrfProtection);

app.use((req, res, next) => {
    const token = generateToken(res, req);
    res.cookie('XSRF-TOKEN', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.locals.csrfToken = token;
    next();
});

// gestion de l'erreur CSRF
app.use((err, req, res, next) => {
    if (err && err.message && err.message.includes('invalid CSRF token')) {
        res.status(403).json({ message: 'Invalid CSRF token' });
    } else {
        res.status(err.status || 500).json({
            message: err.message || 'Erreur interne du serveur'
        });
    }
});
*/

app.use('/api', apiRoutes);

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