const User = require('./UserModel');
const crudService = require('../common/crud/crudService');
const { model } = require('mongoose');

exports.getUsers = async () => {
    return await crudService.getAll(User);
};

exports.createUser = async (userData) => {
    return await crudService.create(User, userData);
};

exports.getUserById = async (id) => {
    return await crudService.getById(User, id)
};

exports.updateUser = async (id, userData) => {
    return await crudService.updateById(User, id, userData);
};

exports.deleteUser = async (id) => {
    return await crudService.deleteById(User, id);
};