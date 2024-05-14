const Skill = require('../models/Skill');

exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createSkill = async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).send('No skill found');
        }
        res.json(skill);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!skill) {
            return res.status(404).send('No skill found');
        }
        res.json(skill);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) {
            return res.status(404).send('No skill found');
        }
        res.send('Skill deleted');
    } catch (error) {
        res.status(500).send(error);
    }
};
