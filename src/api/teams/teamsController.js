const teamsService = require('./teamsService');
const Joi = require('joi');

const validateTeam = (team) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        users: Joi.array().items(Joi.string()),
        projects: Joi.array().items(Joi.string()),
    });
    return schema.validate(team);
};

exports.getTeams = async (req, res) => {
    try {
        const teams = await teamsService.getTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la sélection des equipes' });
    }
};

exports.createTeam = async (req, res) => {
    const { error } = validateTeam(req.body);
    if (error) return res.status(400).json({ message: 'Les données envoyées sont invalides' });

    try {
        const team = await teamsService.createTeam(req.body);
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: 'Une erreur est survenue lors de la création de l\'équipe' });
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const team = await teamsService.getTeamById(req.params.id);
        if (!team) return res.status(404).json({ message: 'L\'équipe demandée n\'a pas été trouvée' });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la sélection de l\'équipe' });
    }
};

exports.updateTeam = async (req, res) => {
    const { error } = validateTeam(req.body);
    if (error) return res.status(400).json({ message: 'Les données envoyées sont invalides' });

    try {
        const team = await teamsService.updateTeam(req.params.id, req.body);
        if (!team) return res.status(404).json({ message: 'L\'équipe demandée n\'a pas été trouvée' });
        res.json(team);
    } catch (error) {
        res.status(400).json({ message: 'Une erreur est survenue lors de la mise à jour de l\'équipe' });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const team = await teamsService.deleteTeam(req.params.id);
        if (!team) return res.status(404).json({ message: 'L\'équipe demandée n\'a pas été trouvée' });
        res.status(200).json( {message: 'L\'équipe a été supprimée avec succes'});
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'équipe' });
    }
};