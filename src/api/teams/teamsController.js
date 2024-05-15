const teamsService = require('./teamsService');

exports.getTeams = async (req, res) => {
    try {
        const teams = await teamsService.getTeams();
        res.json(teams);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createTeam = async (req, res) => {
    try {
        const team = await teamsService.createTeam(req.body);
        res.status(201).json(team);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const team = await teamsService.getTeamById(req.params.id);
        if (!team) return res.status(404).send('No team found');
        res.json(team);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const team = await teamsService.updateTeam(req.params.id, req.body);
        if (!team) return res.status(404).send('No team found');
        res.json(team);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const team = await teamsService.deleteTeam(req.params.id);
        if (!team) return res.status(404).send('No team found');
        res.send('Team deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
