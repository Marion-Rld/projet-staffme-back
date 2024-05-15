const Skill = require('./SkillModel');
const crudService = require('../common/crud/crudService');

exports.getSkills = async () => {
    return await crudService.getAll(Skill);
};

exports.createSkill = async (skillData) => {
    return await crudService.create(Skill, skillData);
};

exports.getSkillById = async (id) => {
    return await crudService.getById(Skill, id);
};

exports.updateSkill = async (id, skillData) => {
    return await crudService.updateById(Skill, id, skillData);
};

exports.deleteSkill = async (id) => {
    return await crudService.deleteById(Skill, id);
};
