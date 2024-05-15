const authService = require('./authService');

exports.signup = async (req, res) => {
    try {
        const user = await authService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await authService.loginUser(email, password);
        res.json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
};