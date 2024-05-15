const skillLevelsService = require('./skillLevelsService');

exports.getSkillLevels = async (req, res) => {
    try {
        const skillLevels = await skillLevelsService.getSkillLevels();
        res.json(skillLevels);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createSkillLevel = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.createSkillLevel(req.body);
        res.status(201).json(skillLevel);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getSkillLevelById = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.getSkillLevelById(req.params.id);
        if (!skillLevel) return res.status(404).send('No skill level found');
        res.json(skillLevel);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateSkillLevel = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.updateSkillLevel(req.params.id, req.body);
        if (!skillLevel) return res.status(404).send('No skill level found');
        res.json(skillLevel);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteSkillLevel = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.deleteSkillLevel(req.params.id);
        if (!skillLevel) return res.status(404).send('No skill level found');
        res.send('Skill level deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
