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
        res.status(500).send('Une erreur est survenue lors de la récupération des niveaux de compétence');
    }
};

exports.createSkillLevel = async (req, res) => {
    const { error } = validateSkillLevel(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const skillLevel = await skillLevelsService.createSkillLevel(req.body);
        res.status(201).json(skillLevel);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la création du niveau de compétence');
    }
};

exports.getSkillLevelById = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.getSkillLevelById(req.params.id);
        if (!skillLevel) return res.status(404).send('Le niveau de compétence demandé n\'a pas été trouvé');
        res.json(skillLevel);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération du niveau de compétence');
    }
};

exports.updateSkillLevel = async (req, res) => {
    const { error } = validateSkillLevel(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const skillLevel = await skillLevelsService.updateSkillLevel(req.params.id, req.body);
        if (!skillLevel) return res.status(404).send('Le niveau de compétence demandé n\'a pas été trouvé');
        res.json(skillLevel);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la mise à jour du niveau de compétence');
    }
};

exports.deleteSkillLevel = async (req, res) => {
    try {
        const skillLevel = await skillLevelsService.deleteSkillLevel(req.params.id);
        if (!skillLevel) return res.status(404).send('Le niveau de compétence demandé n\'a pas été trouvé');
        res.send('Le niveau de compétence a été supprimé avec succès');
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la suppression du niveau de compétence');
    }
};