const projectsService = require('./projectsService');

exports.getProjects = async (req, res) => {
    try {
        const projects = await projectsService.getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createProject = async (req, res) => {
    try {
        const project = await projectsService.createProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await projectsService.getProjectById(req.params.id);
        if (!project) return res.status(404).send('No project found');
        res.json(project);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await projectsService.updateProject(req.params.id, req.body);
        if (!project) return res.status(404).send('No project found');
        res.json(project);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await projectsService.deleteProject(req.params.id);
        if (!project) return res.status(404).send('No project found');
        res.send('Project deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
