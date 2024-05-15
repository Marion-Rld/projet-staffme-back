const Project = require('./ProjectModel');
const crudService = require('../common/crud/crudService');

exports.getProjects = async () => {
    return await crudService.getAll(Project, 'teams');
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
