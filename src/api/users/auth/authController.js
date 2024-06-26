const authService = require('./authService');

exports.signup = async (req, res) => {
    try {
        const user = await authService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la création de l\'utilisateur');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await authService.loginUser(email, password);
        res.json({ user, token });
    } catch (error) {
        res.status(400).send('Identifiants invalides');
    }
};

exports.validateToken = (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
};

exports.isAdmin = (req, res) => {
    if (req.user && req.user.role === 'admin') {
      res.json({ isAdmin: true });
    } else {
      res.json({ isAdmin: false });
    }
  };

  exports.isSuperAdmin = (req, res) => {
    if (req.user && req.user.role === 'superadmin') {
      res.json({ isSuperAdmin: true });
    } else {
      res.json({ isSuperAdmin: false });
    }
  };