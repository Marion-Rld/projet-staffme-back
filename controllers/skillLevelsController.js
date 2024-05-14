const SkillLevel = require('../models/Skill_Level');

exports.getSkillLevels = async (req, res) => {
    try {
        const skillLevels = await SkillLevel.find();
        res.json(skillLevels);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createSkillLevel = async (req, res) => {
    try {
        const skillLevel = new SkillLevel(req.body);
        await skillLevel.save();
        res.status(201).json(skillLevel);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getSkillLevelById = async (req, res) => {
    try {
        const skillLevel = await SkillLevel.findById(req.params.id);
        if (!skillLevel) {
            return res.status(404).send('No skill level found');
        }
        res.json(skillLevel);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateSkillLevel = async (req, res) => {
    try {
        const skillLevel = await SkillLevel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!skillLevel) {
            return res.status(404).send('No skill level found');
        }
        res.json(skillLevel);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteSkillLevel = async (req, res) => {
    try {
        const skillLevel = await SkillLevel.findByIdAndDelete(req.params.id);
        if (!skillLevel) {
            return res.status(404).send('No skill level found');
        }
        res.send('Skill level deleted');
    } catch (error) {
        res.status(500).send(error);
    }
};