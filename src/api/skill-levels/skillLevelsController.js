const skillLevelsService = require('./skillLevelsService');
const Joi = require('joi');

const validateSkillLevel = (skillLevel) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return schema.validate(skillLevel);
};

exports.getSkillLevels = async (req, res) => {
    try {
        const skillLevels = await skillLevelsService.getSkillLevels();
        res.json(skillLevels);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des niveaux de compétence' });
    }
};

exports.createSkillLevel = async (req, res) => {
    const { error } = validateSkillLevel(req.body);
    if (error) return res.status(400).json({ message: 'Les données envoyées sont invalides' });

    try {
        const skillLevel = await skillLevelsService.createSkillLevel(req.body);
        res.status(201).json(skillLevel);
    } catch (error) {
        res.status(400).json({ message: 'Une erreur est survenue lors de la création du niveau de compétence' });
    }
};

exports.getSkillLevelById = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.getSkillLevelById(req.params.id);
        if (!skillLevel) return res.status(404).json({ message: 'Le niveau de compétence demandé n\'a pas été trouvé' });
        res.json(skillLevel);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du niveau de compétence' });
    }
};

exports.updateSkillLevel = async (req, res) => {
    const { error } = validateSkillLevel(req.body);
    if (error) return res.status(400).json({ message: 'Les données envoyées sont invalides' });

    try {
        const skillLevel = await skillLevelsService.updateSkillLevel(req.params.id, req.body);
        if (!skillLevel) return res.status(404).json({ message: 'Le niveau de compétence demandé n\'a pas été trouvé' });
        res.json(skillLevel);
    } catch (error) {
        res.status(400).json({ message: 'Une erreur est survenue lors de la mise à jour du niveau de compétence' });
    }
};

exports.deleteSkillLevel = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.deleteSkillLevel(req.params.id);
        if (!skillLevel) return res.status(404).json({ message: 'Le niveau de compétence demandé n\'a pas été trouvé' });
        res.status(200).json({ message: 'Le niveau de compétence a été supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du niveau de compétence' });
    }
};