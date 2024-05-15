const jwt = require('jsonwebtoken');

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);
    return token;
};

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

module.exports = { generateAuthToken, authMiddleware };