const teamsService = require('./teamsService');
const Joi = require('joi');

const validateTeam = (team) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        users: Joi.array().items(Joi.string()).required(),
        projects: Joi.array().items(Joi.string()).required(),
    });
    return schema.validate(team);
};

exports.getTeams = async (req, res) => {
    try {
        const teams = await teamsService.getTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération des équipes');
    }
};

exports.createTeam = async (req, res) => {
    const { error } = validateTeam(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const team = await teamsService.createTeam(req.body);
        res.status(201).json(team);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la création de l\'équipe');
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const team = await teamsService.getTeamById(req.params.id);
        if (!team) return res.status(404).send('L\'équipe demandée n\'a pas été trouvée');
        res.json(team);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération de l\'équipe');
    }
};

exports.updateTeam = async (req, res) => {
    const { error } = validateTeam(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const team = await teamsService.updateTeam(req.params.id, req.body);
        if (!team) return res.status(404).send('L\'équipe demandée n\'a pas été trouvée');
        res.json(team);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la mise à jour de l\'équipe');
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const team = await teamsService.deleteTeam(req.params.id);
        if (!team) return res.status(404).send('L\'équipe demandée n\'a pas été trouvée');
        res.send('L\'équipe a été supprimée avec succès');
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la suppression de l\'équipe');
    }
};