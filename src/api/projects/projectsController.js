const Project = require('./ProjectModel');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('teams');
        res.json(projects);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('teams');
        if (!project) {
            return res.status(404).send('No project found');
        }
        res.json(project);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).send('No project found');
        }
        res.json(project);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).send('No project found');
        }
        res.send('Project deleted');
    } catch (error) {
        res.status(500).send(error);
    }
};
