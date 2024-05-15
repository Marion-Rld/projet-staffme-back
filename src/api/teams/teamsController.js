const Team = require('./TeamModel');

exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('users projects');
        res.json(teams);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createTeam = async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('users projects');
        if (!team) {
            return res.status(404).send('No team found');
        }
        res.json(team);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!team) {
            return res.status(404).send('No team found');
        }
        res.json(team);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            return res.status(404).send('No team found');
        }
        res.send('Team deleted');
    } catch (error) {
        res.status(500).send(error);
    }
};
