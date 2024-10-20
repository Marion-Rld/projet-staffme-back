const usersService = require('./usersService');
const Joi = require('joi');

const validateUser = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phoneNumber: Joi.string().optional(),
        job: Joi.string().optional(),
        gender: Joi.string().optional(),
        postalAddress: Joi.string().optional(),
        role: Joi.string().required().valid('user', 'admin', 'superadmin'),
        skills: Joi.array().items(Joi.object({
            skill_id: Joi.string().required(),
            level_id: Joi.string().required(),
        })).optional(),
        teams: Joi.array().items(Joi.string()).optional(),
        documents: Joi.array().items(Joi.string()).optional()
    });
    return schema.validate(user);
};

const validateUpdateUser = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).optional(),
        lastName: Joi.string().min(3).optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).optional(),
        phoneNumber: Joi.string().optional(),
        job: Joi.string().optional(),
        gender: Joi.string().optional(),
        postalAddress: Joi.string().optional(),
        role: Joi.string().optional().valid('user', 'admin', 'superadmin'),
        skills: Joi.array().items(Joi.object({
            skill_id: Joi.string().optional(),
            level_id: Joi.string().optional(),
        })).optional(),
        teams: Joi.array().items(Joi.string()).optional(),
        documents: Joi.array().items(Joi.string()).optional()
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
    const { error } = validateUpdateUser(req.body);
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