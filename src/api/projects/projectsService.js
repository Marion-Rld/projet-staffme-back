const Project = require('./ProjectModel');
const crudService = require('../common/crud/crudService');

exports.getProjects = async () => {
    return await crudService.getAll(Project, 'teams');
};

exports.getProjectsByTeamId = async (teamId) => {
    try {
        return await Project.find({ teams: teamId });
    } catch (error) {
        throw new Error('Erreur lors de la récupération des projets pour l\'équipe spécifiée');
    }
};

exports.createProject = async (projectData) => {
    return await crudService.create(Project, projectData);
};

exports.getProjectById = async (id) => {
    return await crudService.getById(Project, id, 'teams');
};

exports.updateProject = async (id, projectData) => {
    return await crudService.updateById(Project, id, projectData);
};

exports.deleteProject = async (id) => {
    return await crudService.deleteById(Project, id);
};
