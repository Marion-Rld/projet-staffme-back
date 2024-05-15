const SkillLevel = require('./SkillLevelModel');
const crudService = require('../common/crud/crudService');

exports.getSkillLevels = async () => {
    return await crudService.getAll(SkillLevel);
};

exports.createSkillLevel = async (skillLevelData) => {
    return await crudService.create(SkillLevel, skillLevelData);
};

exports.getSkillLevelById = async (id) => {
    return await crudService.getById(SkillLevel, id);
};

exports.updateSkillLevel = async (id, skillLevelData) => {
    return await crudService.updateById(SkillLevel, id, skillLevelData);
};

exports.deleteSkillLevel = async (id) => {
    return await crudService.deleteById(SkillLevel, id);
};
