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
        res.status(500).send('Une erreur est survenue lors de la récupération des utilisateurs');
    }
};

exports.createUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const user = await usersService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la création de l\'utilisateur');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await usersService.getUserById(req.params.id);
        if (!user) return res.status(404).send('L\'utilisateur demandé n\'a pas été trouvé');
        res.json(user);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération de l\'utilisateur');
    }
};

exports.updateUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const user = await usersService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).send('L\'utilisateur demandé n\'a pas été trouvé');
        res.json(user);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la mise à jour de l\'utilisateur');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await usersService.deleteUser(req.params.id);
        if (!user) return res.status(404).send('L\'utilisateur demandé n\'a pas été trouvé');
        res.send('L\'utilisateur a été supprimé avec succès');
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la suppression de l\'utilisateur');
    }
};