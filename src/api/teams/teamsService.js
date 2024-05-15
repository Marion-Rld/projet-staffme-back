const Team = require('./TeamModel');
const crudService = require('../common/crud/crudService');

exports.getTeams = async () => {
    return await crudService.getAll(Team, 'users projects');
};

exports.createTeam = async (teamData) => {
    return await crudService.create(Team, teamData);
};

exports.getTeamById = async (id) => {
    return await crudService.getById(Team, id, 'users projects');
};

exports.updateTeam = async (id, teamData) => {
    return await crudService.updateById(Team, id, teamData);
};

exports.deleteTeam = async (id) => {
    return await crudService.deleteById(Team, id);
};
