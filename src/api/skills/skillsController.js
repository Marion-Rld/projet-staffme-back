const skillsService = require('./skillsService');

exports.getSkills = async (req, res) => {
    try {
        const skills = await skillsService.getSkills();
        res.json(skills);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createSkill = async (req, res) => {
    try {
        const skill = await skillsService.createSkill(req.body);
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getSkillById = async (req, res) => {
    try {
        const skill = await skillsService.getSkillById(req.params.id);
        if (!skill) return res.status(404).send('No skill found');
        res.json(skill);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const skill = await skillsService.updateSkill(req.params.id, req.body);
        if (!skill) return res.status(404).send('No skill found');
        res.json(skill);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const skill = await skillsService.deleteSkill(req.params.id);
        if (!skill) return res.status(404).send('No skill found');
        res.send('Skill deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
