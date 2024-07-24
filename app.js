require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const { doubleCsrf } = require('csrf-csrf');

const {
    generateToken,
    doubleCsrfProtection,
    invalidCsrfTokenError
} = doubleCsrf({
    getSecret: (req) => req.session.secret,
    cookieName: "x-csrf-token",
    cookieOptions: { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' }, // Configurez ces options selon vos besoins
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getTokenFromRequest: (req) => req.headers['x-csrf-token']
});

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

// Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use((req, res, next) => {
    if (!req.session.secret) {
        req.session.secret = crypto.randomBytes(16).toString('hex');
    }
    next();
});

app.use(doubleCsrfProtection);

app.get('/csrf-token', (req, res) => {
    const csrfToken = generateToken(res, req);
    res.json({ csrfToken });
});

app.use('/api', apiRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    if (err.name === 'invalidCsrfTokenError') {
        res.status(403).json({
            message: 'Invalid CSRF token'
        });
    } else {
        res.status(err.status || 500).json({
            message: err.message || 'Internal Server Error'
        });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
});