const skillsService = require('./skillsService');
const Joi = require('joi');

const validateSkill = (skill) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return schema.validate(skill);
};

exports.getSkills = async (req, res) => {
    try {
        const skills = await skillsService.getSkills();
        res.json(skills);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération des compétences');
    }
};

exports.createSkill = async (req, res) => {
    const { error } = validateSkill(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const skill = await skillsService.createSkill(req.body);
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la création de la compétence');
    }
};

exports.getSkillById = async (req, res) => {
    try {
        const skill = await skillsService.getSkillById(req.params.id);
        if (!skill) return res.status(404).send('La compétence demandée n\'a pas été trouvée');
        res.json(skill);
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la récupération de la compétence');
    }
};

exports.updateSkill = async (req, res) => {
    const { error } = validateSkill(req.body);
    if (error) return res.status(400).send('Les données envoyées sont invalides');

    try {
        const skill = await skillsService.updateSkill(req.params.id, req.body);
        if (!skill) return res.status(404).send('La compétence demandée n\'a pas été trouvée');
        res.json(skill);
    } catch (error) {
        res.status(400).send('Une erreur est survenue lors de la mise à jour de la compétence');
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const skill = await skillsService.deleteSkill(req.params.id);
        if (!skill) return res.status(404).send('La compétence demandée n\'a pas été trouvée');
        res.send('La compétence a été supprimée avec succès');
    } catch (error) {
        res.status(500).send('Une erreur est survenue lors de la suppression de la compétence');
    }
};