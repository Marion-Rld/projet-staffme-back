const usersService = require('./usersService');
const Joi = require('joi');

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(user);
};

exports.getUsers = async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await usersService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await usersService.getUserById(req.params.id);
        if (!user) return res.status(404).send('No user found');
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await usersService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).send('No user found');
        res.json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await usersService.deleteUser(req.params.id);
        if (!user) return res.status(404).send('No user found');
        res.send('User deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
};