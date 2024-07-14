const projectsService = require('./projectsService');
const Joi = require('joi');

const validateProject = (project) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        description: Joi.string().required(),
        status: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        budget: Joi.number().required(),
        teams: Joi.array().items(Joi.string()).required(),
    });
    return schema.validate(project);
};


exports.getProjects = async (req, res) => {
    try {
        const projects = await projectsService.getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des projets' });
    }
};

exports.createProject = async (req, res) => {
    const { error } = validateProject(req.body);
    if (error) return res.status(400).json({ message: 'Les données envoyées sont invalides' });

    try {
        const project = await projectsService.createProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: 'Une erreur est survenue lors de la création du projet' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await projectsService.getProjectById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Le projet demandé n\'a pas été trouvé' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du projet' });
    }
};

exports.updateProject = async (req, res) => {
    console.log('Requête reçue:', req.body);
    const { error } = validateProject(req.body);
    if (error) {
        console.log("erreur de validation:", error.details);
        return res.status(400).json({ message: 'Les données envoyées sont invalides' });
    }

    try {
        const project = await projectsService.updateProject(req.params.id, req.body);
        if (!project) return res.status(404).json({ message: 'Le projet demandé n\'a pas été trouvé' });
        res.json(project);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
        res.status(400).json({ message: 'Une erreur est survenue lors de la mise à jour du projet' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await projectsService.deleteProject(req.params.id);
        if (!project) return res.status(404).json({ message: 'Le projet demandé n\'a pas été trouvé' });
        res.status(200).json({ message: 'Le projet a été supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du projet' });
    }
};