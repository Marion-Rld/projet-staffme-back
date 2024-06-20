const jwt = require('jsonwebtoken');

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

const authMiddleware = (req, res, next) => {
    const tokenHeader = req.header('Authorization');
  
    if (!tokenHeader) return res.status(401).send('Access denied. No token provided.');
  
    try {
      const token = tokenHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decoded;
      
      next();
    } catch (ex) {
      res.status(400).send('Invalid token.');
    }
  };

module.exports = { generateAuthToken, authMiddleware };